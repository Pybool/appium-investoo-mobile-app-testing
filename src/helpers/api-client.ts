const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080/api";

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type ApiResult<T> = {
  status: number;
  ok: boolean;
  body: ApiEnvelope<T>;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  referralCode?: string;
};

export type UserInfo = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
  kycTier: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
};

export async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string,
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const parsedBody: ApiEnvelope<T> = text ? JSON.parse(text) : { success: res.ok };

  return { status: res.status, ok: res.ok, body: parsedBody };
}

export function apiGet<T>(path: string, token?: string) {
  return apiRequest<T>("GET", path, undefined, token);
}

export function apiPost<T>(path: string, body?: unknown, token?: string) {
  return apiRequest<T>("POST", path, body, token);
}

export function apiPut<T>(path: string, body?: unknown, token?: string) {
  return apiRequest<T>("PUT", path, body, token);
}

export function apiPatch<T>(path: string, body?: unknown, token?: string) {
  return apiRequest<T>("PATCH", path, body, token);
}

export function apiDelete<T>(path: string, token?: string) {
  return apiRequest<T>("DELETE", path, undefined, token);
}

export function register(payload: RegisterPayload) {
  return apiPost<void>("/auth/register", payload);
}

export function verifyEmail(email: string, otp: string) {
  return apiPost<void>("/auth/verify-email", { email, otp });
}

export function resendVerification(email: string) {
  return apiPost<void>("/auth/resend-verification", { email });
}

export function login(email: string, password: string) {
  return apiPost<void>("/auth/login", { email, password });
}

export function confirmLogin(email: string, otp: string) {
  return apiPost<AuthTokens>("/auth/confirm-login", { email, otp });
}

export function refreshToken(refreshToken: string) {
  return apiPost<AuthTokens>("/auth/refresh", { refreshToken });
}

export function logout(refreshToken: string, accessToken: string) {
  return apiPost<void>("/auth/logout", { refreshToken }, accessToken);
}

export function forgotPassword(email: string) {
  return apiPost<void>("/auth/forgot-password", { email });
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return apiPost<void>("/auth/reset-password", { email, otp, newPassword });
}

export async function registerAndVerify(payload: RegisterPayload, otp = process.env.TEST_USER_OTP_OVERRIDE ?? "000000") {
  const registerResponse = await register(payload);
  console.log(registerResponse)
  return await verifyEmail(payload.email, otp);
}

export async function loginAndGetTokens(email: string, password: string, otp = process.env.TEST_USER_OTP_OVERRIDE ?? "000000") {
  await login(email, password);
  const result = await confirmLogin(email, otp);
  return result.body.data as AuthTokens;
}

export async function loginAsAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  return loginAndGetTokens(email, password);
}

export type AdminUserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: string;
  kycStatus: string;
  kycTier: number;
  emailVerified: boolean;
  referralCode: string;
  walletBalanceKobo: number | null;
  reservedBalanceKobo: number | null;
  investooAccountNumber: string;
  lastLoginAt: string | null;
  createdAt: string;
  deletedAt: string | null;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export function adminListUsers(
  token: string,
  params?: { role?: string; kycStatus?: string; q?: string; page?: number; size?: number },
) {
  const query = new URLSearchParams();
  if (params?.role) query.set("role", params.role);
  if (params?.kycStatus) query.set("kycStatus", params.kycStatus);
  if (params?.q) query.set("q", params.q);
  if (params?.page !== undefined) query.set("page", String(params.page));
  if (params?.size !== undefined) query.set("size", String(params.size));
  const qs = query.toString();
  return apiGet<Page<AdminUserDto>>(`/admin/users${qs ? `?${qs}` : ""}`, token);
}

export function adminGetUser(id: string, token: string) {
  return apiGet<AdminUserDto>(`/admin/users/${id}`, token);
}

export function adminSuspendUser(id: string, token: string) {
  return apiPost<AdminUserDto>(`/admin/users/${id}/suspend`, undefined, token);
}

export function adminUnsuspendUser(id: string, token: string) {
  return apiPost<AdminUserDto>(`/admin/users/${id}/unsuspend`, undefined, token);
}

export function adminListAdmins(token: string, page = 0, size = 20) {
  return apiGet<Page<AdminUserDto>>(`/admin/admins?page=${page}&size=${size}`, token);
}

export function adminCreateAdmin(
  payload: { email: string; firstName: string; lastName: string },
  token: string,
) {
  return apiPost<AdminUserDto>("/admin/admins", payload, token);
}

export async function adminFindUserByEmail(email: string, token: string) {
  const result = await adminListUsers(token, { q: email, size: 1 });
  return result.body.data?.content[0];
}

export async function adminSuspendUserByEmail(email: string, token: string) {
  const user = await adminFindUserByEmail(email, token);
  if (!user) throw new Error(`No user found for email ${email}`);
  return adminSuspendUser(user.id, token);
}
