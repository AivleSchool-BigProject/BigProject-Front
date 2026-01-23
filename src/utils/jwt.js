export const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  try {
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getTokenUserId = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  const candidates = [
    payload.userId,
    payload.id,
    payload.memberId,
    payload.loginId,
    payload.sub,
    payload.username,
    payload.email,
  ];
  const found = candidates.find((value) => value !== undefined && value !== null);
  return found ?? null;
};
