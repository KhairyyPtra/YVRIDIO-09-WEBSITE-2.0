/**
 * Penyimpanan subscription Web Push via Upstash Redis REST API.
 * Gratis: https://upstash.com
 *
 * Env yang dibutuhkan:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

const SUB_KEY = "yvridio:push:subscriptions";

function redisConfigured() {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function redisCommand(commandArgs) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis belum dikonfigurasi");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commandArgs)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Redis error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.result;
}

function subscriptionId(sub) {
  // endpoint unik per browser/device
  return sub && sub.endpoint ? sub.endpoint : null;
}

async function listSubscriptions() {
  if (!redisConfigured()) return [];

  const raw = await redisCommand(["HVALS", SUB_KEY]);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      try {
        return typeof item === "string" ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function saveSubscription(subscription) {
  if (!redisConfigured()) {
    return { ok: false, reason: "redis_not_configured" };
  }

  const id = subscriptionId(subscription);
  if (!id) {
    return { ok: false, reason: "invalid_subscription" };
  }

  const payload = JSON.stringify({
    ...subscription,
    savedAt: new Date().toISOString()
  });

  await redisCommand(["HSET", SUB_KEY, id, payload]);
  return { ok: true };
}

async function removeSubscription(subscriptionOrEndpoint) {
  if (!redisConfigured()) {
    return { ok: false, reason: "redis_not_configured" };
  }

  const id =
    typeof subscriptionOrEndpoint === "string"
      ? subscriptionOrEndpoint
      : subscriptionId(subscriptionOrEndpoint);

  if (!id) {
    return { ok: false, reason: "invalid_subscription" };
  }

  await redisCommand(["HDEL", SUB_KEY, id]);
  return { ok: true };
}

module.exports = {
  redisConfigured,
  listSubscriptions,
  saveSubscription,
  removeSubscription
};
