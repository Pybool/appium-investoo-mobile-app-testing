import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import { registerAndVerify, loginAndGetTokens, loginAsAdmin, adminListUsers, adminSuspendUserByEmail, adminUnsuspendUser, adminFindUserByEmail } from "../src/helpers/api-client";

async function main() {
  const email = `smoke.${Date.now()}@example.com`;
  const password = "Eko@1011";

  await registerAndVerify({
    email,
    password,
    firstName: "Smoke",
    lastName: "Test",
    phone: "08100000099",
  });
  console.log("register + verify: ok");

  const tokens = await loginAndGetTokens(email, password);
  console.log("login: ok, got accessToken:", !!tokens.accessToken);

  const adminTokens = await loginAsAdmin();
  console.log("admin login: ok, role:", adminTokens.user.role);

  const list = await adminListUsers(adminTokens.accessToken, { q: email, size: 1 });
  console.log("admin list users status:", list.status, "found:", list.body.data?.content.length);

  const suspendResult = await adminSuspendUserByEmail(email, adminTokens.accessToken);
  console.log("suspend status:", suspendResult.status, "new status:", suspendResult.body.data?.status);

  const user = await adminFindUserByEmail(email, adminTokens.accessToken);
  const unsuspendResult = await adminUnsuspendUser(user!.id, adminTokens.accessToken);
  console.log("unsuspend status:", unsuspendResult.status, "new status:", unsuspendResult.body.data?.status);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
