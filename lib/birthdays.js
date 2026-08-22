/**
 * Data ulang tahun anggota YVRIDIO'09
 * (hari + bulan, tanpa tahun — dipakai client & server)
 */

const MEMBER_BIRTHDAYS = [
  { name: "Zafran Khairy Marwan Putra", nick: "Zafran", day: 6, month: 8 },
  { name: "Muhammad Khoirul Fahmi", nick: "Fahmi", day: 22, month: 10 },
  { name: "Gerindra Onata Osta Oswada Pracoyo", nick: "Geri", day: 3, month: 5 },
  { name: "Fazly Al-Fattah Ilin", nick: "Fazly", day: 8, month: 4 },
  { name: "Muhammad Aqsal Rezkyansyah", nick: "Aksal", day: 11, month: 1 },
  { name: "Nurul Islamiyah Istiqomah", nick: "Nurul", day: 28, month: 5 },
  { name: "Aulyana Putri", nick: "Aul", day: 30, month: 11 },
  { name: "Aini Akmalunisa Jupri", nick: "Aini", day: 20, month: 7 },
  { name: "Andini Nur Meisya Mastim", nick: "Andini", day: 25, month: 5 },
  { name: "Annisa Roidah Sukanto Thayeb", nick: "Nisa", day: 4, month: 3 },
  { name: "Dhini Andryani", nick: "Dhini", day: 24, month: 5 },
  { name: "Dinda Keisha Rohaendi", nick: "Dinda", day: 5, month: 11 },
  { name: "Dzakia Rafifah Artanti", nick: "Ifah", day: 31, month: 5 },
  { name: "Dzaqy Ardhani Arham", nick: "Dzaqy", day: 18, month: 1 },
  { name: "Fauziyyah Khansa Ramadhani", nick: "Fauziyyah", day: 18, month: 9 },
  { name: "Salsabillah Yulia Putri S", nick: "Salsa", day: 10, month: 7 },
  { name: "Aqifa Ghaziya Zalika", nick: "Aqifa", day: 17, month: 10 },
  { name: "Naizilah Rasyikah", nick: "Naizilah", day: 10, month: 8 },
  { name: "Ghina Najla Hulwatunnisa", nick: "Ghina", day: 11, month: 7 },
  { name: "Isma Apriyanti", nick: "Isma", day: 7, month: 9 },
  { name: "Janita Fajriyani", nick: "Janita", day: 4, month: 1 },
  { name: "Keyna Noverina Isamu", nick: "Keyna", day: 11, month: 11 },
  { name: "Keyla Noverila Isamu", nick: "Keyla", day: 11, month: 11 },
  { name: "Laode Muhammad Rezky Izzat Pratama", nick: "Izzat", day: 26, month: 12 },
  { name: "Mutia Dwi Mutmainah", nick: "Mutia", day: 27, month: 3 },
  { name: "Muh. Adnan Fabyan Setiawan", nick: "Adnan", day: 9, month: 5 },
  { name: "Izzatun Nafsy Nur Rahmi", nick: "Izzatun", day: 15, month: 4 },
  { name: "Khalisa Nuruljannah Yusuf", nick: "Khalisa", day: 5, month: 6 },
  { name: "Natasya Putri Ramadhani", nick: "Natasya", day: 3, month: 9 },
  { name: "Radisya Humairah A Labuku", nick: "Radisya", day: 6, month: 3 },
  { name: "Ratu Nur Khumairo", nick: "Ratu", day: 31, month: 3 },
  { name: "Andi Idham Pratama", nick: "Idham", day: 3, month: 12 },
  { name: "Iqro Saputri", nick: "Iqro", day: 10, month: 7 },
  { name: "Raudhatul Jannah", nick: "Raudha", day: 29, month: 11 }
];

/**
 * @param {Date} [date]
 * @param {string} [timeZone] default Asia/Makassar (WITA)
 */
function getBirthdaysOn(date = new Date(), timeZone = "Asia/Makassar") {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "numeric",
    month: "numeric"
  }).formatToParts(date);

  const day = Number(parts.find((p) => p.type === "day")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);

  return MEMBER_BIRTHDAYS.filter((m) => m.day === day && m.month === month);
}

function buildBirthdayPayload(people) {
  if (!people.length) return null;

  if (people.length === 1) {
    return {
      title: `🎂 Selamat ulang tahun, ${people[0].nick}!`,
      body: `Hari ini ulang tahun ${people[0].nick} (${people[0].name}).\nYVRIDIO'09 — One class. One orbit. One story.`,
      url: "/",
      tag: "yvridio-birthday",
      icon: "/assets/images/favicon.png",
      badge: "/assets/images/favicon-32.png"
    };
  }

  const names = people.map((p) => p.nick).join(", ");
  return {
    title: `🎂 ${people.length} teman ulang tahun hari ini!`,
    body: `Hari ini ulang tahun: ${names}.\nYVRIDIO'09 — One class. One orbit. One story.`,
    url: "/",
    tag: "yvridio-birthday",
    icon: "/assets/images/favicon.png",
    badge: "/assets/images/favicon-32.png"
  };
}

module.exports = {
  MEMBER_BIRTHDAYS,
  getBirthdaysOn,
  buildBirthdayPayload
};
