// 基于签名 Cookie 的登录态校验（Workers 是无状态的，不用服务端 session store）。
// Cookie 内容: "<过期时间戳>.<签名>"，签名 = HMAC-SHA256(SESSION_SECRET, "admin:<过期时间戳>")

const COOKIE_NAME = 'nav_admin';
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 天

function toBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return toBase64Url(sig);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function createSessionCookieValue(secret) {
  const expires = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const sig = await hmac(secret, `admin:${expires}`);
  return `${expires}.${sig}`;
}

async function verifySessionCookieValue(secret, value) {
  if (!value) return false;
  const [expiresStr, sig] = value.split('.');
  if (!expiresStr || !sig) return false;
  const expires = parseInt(expiresStr, 10);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const expectedSig = await hmac(secret, `admin:${expiresStr}`);
  return timingSafeEqual(sig, expectedSig);
}

export { COOKIE_NAME, TTL_SECONDS, createSessionCookieValue, verifySessionCookieValue };
