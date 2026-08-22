/**
 * POST /api/subscribe
 * Body: PushSubscription JSON dari browser
 *
 * Menyimpan subscription agar server bisa kirim push nanti.
 */

const { saveSubscription, redisConfigured } = require("../lib/subscriptions");

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
    return res.status(503).json({
      error: "Push storage belum dikonfigurasi",
      hint: "Set UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN di Vercel"
    });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!body || !body.endpoint || !body.keys) {
      return res.status(400).json({ error: "Subscription tidak valid" });
    }

    const result = await saveSubscription(body);

    if (!result.ok) {
      return res.status(400).json({ error: result.reason });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("subscribe error:", e);
    return res.status(500).json({ error: "Gagal menyimpan subscription" });
  }
};
