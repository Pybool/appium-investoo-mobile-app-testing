import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { Client } from 'pg';

dotenvConfig();

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8081/api';
const OTP = '000000';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@investoo.qa';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'AdminPassword123!';
const INVESTOR_PASSWORD = 'TestPassword123!';

const pg = new Client({
  host: process.env.QA_POSTGRES_HOST ?? '127.0.0.1',
  port: Number(process.env.QA_POSTGRES_PORT ?? 5434),
  database: process.env.QA_POSTGRES_DB ?? 'investoo_qa',
  user: process.env.QA_POSTGRES_USER ?? 'investoo',
  password: process.env.QA_POSTGRES_PASSWORD ?? 'investoo_qa',
});

type Envelope<T> = { success: boolean; message?: string; data?: T };

async function api<T = void>(
  urlPath: string,
  opts: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${urlPath}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const json = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok) {
    throw new Error(`${opts.method ?? 'GET'} ${urlPath} -> ${res.status}: ${json?.message ?? res.statusText}`);
  }
  return json?.data as T;
}

async function userExists(email: string): Promise<boolean> {
  const { rows } = await pg.query('SELECT 1 FROM users WHERE email = $1', [email]);
  return rows.length > 0;
}

async function registerAndVerify(user: {
  email: string; password: string; firstName: string; lastName: string;
}): Promise<void> {
  await api('/auth/register', { method: 'POST', body: user });
  await api('/auth/verify-email', { method: 'POST', body: { email: user.email, otp: OTP } });
}

async function login(email: string, password: string): Promise<string> {
  await api('/auth/login', { method: 'POST', body: { email, password } });
  const auth = await api<{ accessToken: string }>('/auth/confirm-login', {
    method: 'POST',
    body: { email, otp: OTP },
  });
  return auth.accessToken;
}

async function seedAdmin(): Promise<string> {
  console.log('\n--- Admin ---');
  if (await userExists(ADMIN_EMAIL)) {
    console.log(`  ${ADMIN_EMAIL} already exists — reusing`);
  } else {
    await registerAndVerify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, firstName: 'QA', lastName: 'Admin' });
    await pg.query(
      `UPDATE users SET role = 'ADMIN', kyc_status = 'APPROVED', kyc_tier = 3 WHERE email = $1`,
      [ADMIN_EMAIL],
    );
    console.log(`  ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }
  return login(ADMIN_EMAIL, ADMIN_PASSWORD);
}

const investorSpecs = [
  { key: 'tier0', email: 'investor.tier0@investoo.qa', firstName: 'Amaka', lastName: 'Tier0' },
  { key: 'tier1', email: 'investor.tier1@investoo.qa', firstName: 'Bayo', lastName: 'Tier1' },
  { key: 'tier2', email: 'investor.tier2@investoo.qa', firstName: 'Chidi', lastName: 'Tier2' },
  { key: 'tier2Pending', email: 'investor.tier2.pending@investoo.qa', firstName: 'Dupe', lastName: 'Pending' },
  { key: 'tier2Rejected', email: 'investor.tier2.rejected@investoo.qa', firstName: 'Emeka', lastName: 'Rejected' },
  { key: 'funded', email: 'investor.funded@investoo.qa', firstName: 'Funke', lastName: 'Funded' },
  { key: 'zeroBalance', email: 'investor.zero-balance@investoo.qa', firstName: 'Gozie', lastName: 'Zero' },
  { key: 'suspended', email: 'investor.suspended@investoo.qa', firstName: 'Hauwa', lastName: 'Suspended' },
] as const;

type InvestorKey = (typeof investorSpecs)[number]['key'];
type SeededInvestor = { email: string; password: string; token: string; userId: string };

async function submitTier2For(
  users: Record<InvestorKey, SeededInvestor>,
  key: InvestorKey,
  bvn: string,
  idNumber: string,
): Promise<void> {
  await api('/kyc/bvn', { method: 'POST', token: users[key].token, body: { bvn } });
  await api('/kyc/tier2', {
    method: 'POST',
    token: users[key].token,
    body: {
      idType: 'NIN',
      idNumber,
      idDocumentUrl: 'https://example.com/seed/id-document.jpg',
      selfieUrl: 'https://example.com/seed/selfie.jpg',
    },
  });
}

async function latestTier2SubmissionId(userId: string): Promise<string> {
  const { rows } = await pg.query<{ id: string }>(
    `SELECT id FROM kyc_submissions WHERE user_id = $1 AND tier = 2 ORDER BY created_at DESC LIMIT 1`,
    [userId],
  );
  return rows[0].id;
}

async function seedInvestorUsers(adminToken: string): Promise<Record<InvestorKey, SeededInvestor>> {
  console.log('\n--- Investor users ---');
  const users = {} as Record<InvestorKey, SeededInvestor>;
  let anyPreExisting = false;

  for (const spec of investorSpecs) {
    const exists = await userExists(spec.email);
    if (exists) anyPreExisting = true;
    else {
      await registerAndVerify({
        email: spec.email, password: INVESTOR_PASSWORD, firstName: spec.firstName, lastName: spec.lastName,
      });
    }
    const { rows } = await pg.query<{ id: string; status: string }>(
      'SELECT id, status FROM users WHERE email = $1', [spec.email],
    );
    
    const token = rows[0].status === 'SUSPENDED' ? '' : await login(spec.email, INVESTOR_PASSWORD);
    users[spec.key] = { email: spec.email, password: INVESTOR_PASSWORD, token, userId: rows[0].id };
    console.log(`  ${spec.key.padEnd(14)} ${spec.email} / ${INVESTOR_PASSWORD}${exists ? '  (already existed)' : ''}`);
  }

  if (anyPreExisting) {
    console.log('  Some investors already existed — skipping KYC/suspend steps (assumed already done by a prior run).');
    return users;
  }

  await api('/kyc/bvn', { method: 'POST', token: users.tier1.token, body: { bvn: '12345678901' } });

  await submitTier2For(users, 'tier2', '22345678901', '111222333401');
  await api(`/admin/kyc/${await latestTier2SubmissionId(users.tier2.userId)}/approve`, {
    method: 'POST', token: adminToken,
  });

  await submitTier2For(users, 'tier2Pending', '32345678901', '111222333402');


  await submitTier2For(users, 'tier2Rejected', '42345678901', '111222333403');
  await api(`/admin/kyc/${await latestTier2SubmissionId(users.tier2Rejected.userId)}/reject`, {
    method: 'POST',
    token: adminToken,
    body: { reason: 'ID document image is blurry — please resubmit a clearer photo.' },
  });


  await submitTier2For(users, 'funded', '52345678901', '111222333404');
  await api(`/admin/kyc/${await latestTier2SubmissionId(users.funded.userId)}/approve`, {
    method: 'POST', token: adminToken,
  });
  await submitTier2For(users, 'zeroBalance', '62345678901', '111222333405');
  await api(`/admin/kyc/${await latestTier2SubmissionId(users.zeroBalance.userId)}/approve`, {
    method: 'POST', token: adminToken,
  });

  await pg.query(`UPDATE users SET status = 'SUSPENDED' WHERE email = $1`, [users.suspended.email]);

  return users;
}

type SampleOpportunity = {
  title: string; slug: string; sector: string; summary: string; description: string;
  operatorName: string; operatorLocation: string; targetAmountKobo: number; minimumTicketKobo: number;
  unitPriceKobo: number; projectedReturnPct: number; tenorMonths: number; subscriptionDeadline: string;
  coverImageUrl: string | null; highlights: string[]; risks: string[];
};

type SeededOpportunity = { id: string; title: string; slug: string; minimumTicketKobo: number; unitPriceKobo: number };

async function seedOpportunities(adminToken: string): Promise<SeededOpportunity[]> {
  console.log('\n--- Opportunities ---');
  const samplePath = path.resolve(__dirname, '../../sample-opportunities.json');
  const samples: SampleOpportunity[] = JSON.parse(fs.readFileSync(samplePath, 'utf-8'));

  const created: SeededOpportunity[] = [];
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const { rows: existing } = await pg.query<{ id: string; status: string }>(
      'SELECT id, status FROM opportunities WHERE slug = $1', [s.slug],
    );
    if (existing.length > 0) {
      created.push({
        id: existing[0].id, title: s.title, slug: s.slug,
        minimumTicketKobo: s.minimumTicketKobo, unitPriceKobo: s.unitPriceKobo,
      });
      console.log(`  EXISTS (${existing[0].status})  ${s.title}`);
      continue;
    }
 
    const subscriptionDeadline = new Date(Date.now() + (60 + i * 15) * 24 * 60 * 60 * 1000).toISOString();
    const opp = await api<{ id: string }>('/admin/opportunities', {
      method: 'POST',
      token: adminToken,
      body: { ...s, subscriptionDeadline },
    });
    await api(`/admin/opportunities/${opp.id}/publish`, { method: 'POST', token: adminToken });
    created.push({
      id: opp.id, title: s.title, slug: s.slug,
      minimumTicketKobo: s.minimumTicketKobo, unitPriceKobo: s.unitPriceKobo,
    });
    console.log(`  LIVE          ${s.title}`);
  }

  const { rows: firstStatus } = await pg.query<{ status: string }>('SELECT status FROM opportunities WHERE id = $1', [created[0].id]);
  if (firstStatus[0].status !== 'FUNDED') {
    await api(`/admin/opportunities/${created[0].id}/transition`, {
      method: 'POST', token: adminToken, body: { toStatus: 'FUNDED' },
    });
    console.log(`  -> FUNDED     ${created[0].title}`);
  } else {
    console.log(`  already FUNDED  ${created[0].title}`);
  }

 
  await pg.query(`UPDATE opportunities SET units_subscribed = FLOOR(total_units * 0.85) WHERE id = $1`, [created[1].id]);
  console.log(`  -> 85% FUNDED ${created[1].title}`);

  return created;
}

async function creditWallet(userId: string, amountKobo: number, description: string): Promise<void> {
  const { rows } = await pg.query<{ id: string }>('SELECT id FROM wallets WHERE user_id = $1', [userId]);
  const walletId = rows[0].id;
  const txId = randomUUID();

  await pg.query('BEGIN');
  try {
    await pg.query('UPDATE wallets SET balance = balance + $1 WHERE id = $2', [amountKobo, walletId]);
    
    await pg.query(
      `INSERT INTO ledger_entries (transaction_id, account_type, account_id, entry_type, amount, event_type, description)
       VALUES
         ($1, 'USER_WALLET', $2, 'DEBIT', $3, 'WALLET_FUND', $4),
         ($1, 'PLATFORM_REVENUE', $2, 'CREDIT', $3, 'WALLET_FUND', $4)`,
      [txId, walletId, amountKobo, description],
    );
    await pg.query('COMMIT');
  } catch (err) {
    await pg.query('ROLLBACK');
    throw err;
  }
}

async function seedWallets(users: Record<InvestorKey, SeededInvestor>): Promise<void> {
  console.log('\n--- Wallets ---');
  await creditWallet(users.funded.userId, 50_000_00, 'Seed data: QA wallet funding');
  console.log(`  ${users.funded.email}: credited NGN50,000`);
  // zeroBalance stays at its default 0 balance — nothing to do.
  console.log(`  ${users.zeroBalance.email}: left at NGN0`);
}

async function seedInvestment(
  users: Record<InvestorKey, SeededInvestor>,
  opportunities: SeededOpportunity[],
): Promise<void> {
  console.log('\n--- Investment ---');
  const target = opportunities.slice(2).reduce((a, b) => (a.minimumTicketKobo <= b.minimumTicketKobo ? a : b));
  const investment = await api<{ id: string }>('/investments', {
    method: 'POST',
    token: users.funded.token,
    body: { opportunityId: target.id, amountKobo: target.minimumTicketKobo },
  });
  console.log(`  ${users.funded.email} invested NGN${target.minimumTicketKobo / 100} in "${target.title}" (investment ${investment.id})`);
}

async function seedNotifications(users: Record<InvestorKey, SeededInvestor>): Promise<void> {
  console.log('\n--- Notifications ---');
  const rows: Array<{ userId: string; type: string; title: string; body: string; read: boolean }> = [
    { userId: users.funded.userId, type: 'WALLET_FUNDED', title: 'Wallet funded', body: 'Your wallet was credited with NGN50,000.', read: false },
    { userId: users.funded.userId, type: 'INVESTMENT_CONFIRMED', title: 'Investment confirmed', body: 'Your investment has been confirmed.', read: false },
    { userId: users.tier2.userId, type: 'KYC_UPDATED', title: 'KYC approved', body: 'Your tier 2 verification has been approved.', read: true },
    { userId: users.tier2Rejected.userId, type: 'KYC_UPDATED', title: 'KYC rejected', body: 'Your KYC submission was rejected.', read: false },
  ];
  for (const r of rows) {
    await pg.query(
      `INSERT INTO notifications (user_id, type, title, body, read) VALUES ($1, $2, $3, $4, $5)`,
      [r.userId, r.type, r.title, r.body, r.read],
    );
  }
  console.log(`  inserted ${rows.length} notifications`);
}

async function main() {
  await pg.connect();
  try {
    const adminToken = await seedAdmin();
    const users = await seedInvestorUsers(adminToken);
    const opportunities = await seedOpportunities(adminToken);
    await seedWallets(users);
    await seedInvestment(users, opportunities);
    await seedNotifications(users);

    console.log('\n=== Seed complete ===');
    console.log(`Admin:    ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log('Investors (all password TestPassword123!, OTP 000000):');
    for (const spec of investorSpecs) console.log(`  ${spec.key.padEnd(14)} ${spec.email}`);
    console.log(`Opportunities seeded: ${opportunities.length} (1 FUNDED, 1 at 85%, rest LIVE)`);
  } finally {
    await pg.end();
  }
}

main().catch((err) => {
  console.error('\nSEED FAILED:', err);
  process.exit(1);
});
