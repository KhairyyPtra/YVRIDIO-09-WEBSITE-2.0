/**
 * POST /api/unsubscribe
 * Body: { endpoint } atau PushSubscription
 */

const { removeSubscription, redisConfigured } = require("../lib/subscriptions");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!redisConfigured()) {
    return res.status(503).json({ error: "Push storage belum dikonfigurasi" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const result = await removeSubscription(body);
    return res.status(200).json({ ok: !!result.ok });
  } catch (e) {
    console.error("unsubscribe error:", e);
    return res.status(500).json({ error: "Gagal menghapus subscription" });
  }
};
