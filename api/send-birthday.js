/**
 * GET/POST /api/send-birthday
 *
 * Mengecek siapa yang ultah hari ini (zona WITA)
 * lalu mengirim Web Push ke semua subscription tersimpan.
 *
 * Proteksi:
 *   - Header Authorization: Bearer <CRON_SECRET>
 *   - atau query ?secret=<CRON_SECRET>
 *
 * Dipanggil otomatis oleh Vercel Cron (lihat vercel.json)
 * atau manual untuk uji:
 *   curl -H "Authorization: Bearer SECRET" https://domainmu/api/send-birthday
 */

const webpush = require("web-push");
const {
  getBirthdaysOn,
  buildBirthdayPayload
} = require("../lib/birthdays");
const {
  listSubscriptions,
  removeSubscription,
  redisConfigured
} = require("../lib/subscriptions");

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = req.headers.authorization || "";
  if (auth === `Bearer ${secret}`) return true;

  const q = req.query && req.query.secret;
  if (q && q === secret) return true;

  // Vercel Cron mengirim header khusus
  if (req.headers["x-vercel-cron"] === "1") return true;

  return false;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT || "mailto:yvridio09@gmail.com";

  if (!publicKey || !privateKey) {
    return res.status(503).json({
      error: "VAPID keys belum diset",
      hint: "Set VAPID_PUBLIC_KEY dan VAPID_PRIVATE_KEY di Vercel"
    });
  }

  if (!redisConfigured()) {
    return res.status(503).json({
      error: "Redis belum dikonfigurasi"
    });
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const people = getBirthdaysOn(new Date(), "Asia/Makassar");
  const payload = buildBirthdayPayload(people);

  if (!payload) {
    return res.status(200).json({
      ok: true,
      message: "Tidak ada yang ulang tahun hari ini",
      birthdays: [],
      sent: 0
    });
  }

  const subscriptions = await listSubscriptions();
  let sent = 0;
  let failed = 0;
  const errors = [];

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
      sent += 1;
    } catch (err) {
      failed += 1;
      const status = err.statusCode || err.status;

      // Subscription sudah tidak valid → hapus
      if (status === 404 || status === 410) {
        try {
          await removeSubscription(sub);
        } catch (_) {}
      }

      errors.push({
        endpoint: sub.endpoint ? sub.endpoint.slice(0, 64) + "…" : "?",
        status: status || null,
        message: err.message
      });
    }
  }

  return res.status(200).json({
    ok: true,
    birthdays: people.map((p) => p.nick),
    subscribers: subscriptions.length,
    sent,
    failed,
    errors: errors.slice(0, 10)
  });
};
