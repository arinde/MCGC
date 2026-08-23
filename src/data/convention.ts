/**
 * =====================================================================
 *  THE ONLY CONTENT FILE.
 *  Everything the public site says lives here. Edit this, nothing else.
 *
 *  Sourced from the official convention flyers in /public/Guest Artiste/.
 *  🔴 = still unconfirmed, needs the convention desk to verify.
 * =====================================================================
 */

export type Session = {
  time: string;
  title: string;
  who: string;
  /** Small badge, e.g. "Praise Night". Leave out for a normal session. */
  tag?: string;
};

export type Day = {
  /** Stable key used by the schedule tabs, the form, and check-in. Never rename after go-live. */
  label: string;
  date: string;
  title: string;
  sub: string;
  /** Local start of this day's first session — powers "tonight" detection at check-in. */
  starts: { y: number; m: number; d: number; hh: number; mm: number };
  sessions: Session[];
};

export type Minister = {
  name: string;
  role: string;
  org?: string;
  slots: string;
  /** Drop a headshot in /public/ministers/ and reference it: "/ministers/name.jpg" */
  photo?: string;
};

export const convention = {
  // ---------- identity ----------
  church: "Mercy of Christ Gospel Church",
  churchSuffix: "(World Wide) · Ori Oke Majiyagbe",
  title: "Majiyagbe Convention",
  year: "2026",
  theme: ["BEHOLD", "I COME", "QUICKLY"],
  tagline: "seven days at Ori Oke Majiyagbe",
  verse: "Behold, I come quickly; and my reward is with me, to give every man according as his work shall be.",
  verseRef: "Revelation 22:12",

  /** First service of the convention — drives the countdown. */
  starts: { y: 2026, m: 8, d: 24, hh: 17, mm: 0 }, // 🔴 confirm Monday's start time
  datesLabel: "Mon 24 – Sun 30 August 2026",

  // ---------- venue ----------
  venue: {
    name: "Ori Oke Majiyagbe",
    address: "1–7 Majiyagbe Street, Igbe Alagemo, Off Ipetu-Oloja, Igbogbo Bayeku, Ikorodu, Lagos State",
    landmark: "Mercy of Christ Gospel Church (World Wide)",
    /** Text Google Maps searches for. Test this on a phone before sharing the link. */
    maps: "Ori Oke Majiyagbe, Majiyagbe Street, Igbe Alagemo, Igbogbo Bayeku, Ikorodu, Lagos",
    getting: [
      // 🔴 replace all three with the real arrangements
      "Parking is available within the church compound.",
      "Igbogbo Bayeku is reachable by bus from Ikorodu garage.",
      "Ushers are on hand at the gate to direct you to a seat.",
    ],
  },

  // ---------- contact ----------
  contact: {
    whatsapp: "2348000000000", // 🔴 real number, international format, no + and no spaces
    display: "+234 800 000 0000", // 🔴
    email: "info@mcgcworldwide.org", // 🔴
  },

  // ---------- hero strip ----------
  facts: [
    { k: "Dates", v: "24 – 30 August", s: "Monday to Sunday" },
    { k: "Venue", v: "Ori Oke Majiyagbe", s: "Ikorodu, Lagos" },
    { k: "Convener", v: "Prophet N.G. Bolarinde", s: "General Overseer" },
    { k: "Admission", v: "Free", s: "Everyone welcome" },
  ],

  expect: [
    { t: "Seven days of worship", d: "Ministration nightly, with guest artistes through the week." },
    { t: "The Word, daily", d: "Taught by the General Overseer and other anointed men of God." },
    { t: "Praise Night", d: "Friday 28th from 9:00 PM — the loudest night of the convention." },
    { t: "Thanksgiving Service", d: "Sunday 30th at 9:00 AM, closing the convention together." },
    { t: "Prayer and ministration", d: "Personal prayer at the altar after every service." },
  ],

  // ---------- programme ----------
  // 🔴 Only Friday's Praise Night (9PM) and Sunday's Thanksgiving (9AM) are
  // confirmed from the flyer. Every other time below is a sensible assumption
  // and must be checked with the convention desk before this goes out.
  days: [
    {
      label: "Day 1", date: "Mon · 24 Aug", title: "Opening Service", sub: "Behold, I Come Quickly",
      starts: { y: 2026, m: 8, d: 24, hh: 17, mm: 0 },
      sessions: [
        { time: "5:00 PM", title: "Doors open · Praise & worship", who: "Convention Choir" },
        { time: "6:00 PM", title: "Opening charge", who: "Prophet N.G. Bolarinde JP", tag: "Opening" },
      ],
    },
    {
      label: "Day 2", date: "Tue · 25 Aug", title: "Second Night", sub: "Watch Therefore",
      starts: { y: 2026, m: 8, d: 25, hh: 17, mm: 0 },
      sessions: [
        { time: "5:00 PM", title: "Praise & worship", who: "Convention Choir" },
        { time: "6:00 PM", title: "Ministration & the Word", who: "Anointed Men of God" },
      ],
    },
    {
      label: "Day 3", date: "Wed · 26 Aug", title: "Third Night", sub: "Prepare The Way",
      starts: { y: 2026, m: 8, d: 26, hh: 17, mm: 0 },
      sessions: [
        { time: "5:00 PM", title: "Praise & worship", who: "Convention Choir" },
        { time: "6:00 PM", title: "Ministration & the Word", who: "Anointed Men of God" },
      ],
    },
    {
      label: "Day 4", date: "Thu · 27 Aug", title: "Fourth Night", sub: "His Reward Is With Him",
      starts: { y: 2026, m: 8, d: 27, hh: 17, mm: 0 },
      sessions: [
        { time: "5:00 PM", title: "Praise & worship", who: "Convention Choir" },
        { time: "6:00 PM", title: "Ministration & the Word", who: "Anointed Men of God" },
      ],
    },
    {
      label: "Day 5", date: "Fri · 28 Aug", title: "Praise Night", sub: "All Night Of Praise",
      starts: { y: 2026, m: 8, d: 28, hh: 21, mm: 0 },
      sessions: [
        { time: "9:00 PM", title: "Praise Night begins", who: "All guest artistes", tag: "Praise Night" },
      ],
    },
    {
      label: "Day 6", date: "Sat · 29 Aug", title: "Sixth Day", sub: "Even So, Come",
      starts: { y: 2026, m: 8, d: 29, hh: 17, mm: 0 },
      sessions: [
        { time: "5:00 PM", title: "Praise & worship", who: "Convention Choir" },
        { time: "6:00 PM", title: "Ministration & the Word", who: "Anointed Men of God" },
      ],
    },
    {
      label: "Day 7", date: "Sun · 30 Aug", title: "Thanksgiving Service", sub: "Grand Finale",
      starts: { y: 2026, m: 8, d: 30, hh: 9, mm: 0 },
      sessions: [
        { time: "9:00 AM", title: "Thanksgiving Service", who: "Prophet N.G. Bolarinde JP", tag: "Finale" },
      ],
    },
  ] satisfies Day[],

  // ---------- ministering ----------
  ministers: [
    {
      name: "Prophet N.G. Bolarinde JP",
      role: "Convener",
      org: "General Overseer · aka Baba Majiyagbe",
      slots: "Throughout the convention",
    },
    { name: "Min. Biola Tayo", role: "Guest Artiste", slots: "Ministering" },
    { name: "Min. Mobolaji John", role: "Guest Artiste", org: "Authority", slots: "Ministering" },
    { name: "Min. Oluwafemi Simeon", role: "Guest Artiste", slots: "Ministering" },
    { name: "Min. Segun Peculiar", role: "Guest Artiste", slots: "Ministering" },
    { name: "Min. Ariyo Best", role: "Guest Artiste", slots: "Ministering" },
  ] satisfies Minister[],
};

export type Convention = typeof convention;

/** Day labels, for the form, the dashboard and check-in. */
export const dayLabels = convention.days.map((d) => d.label);

/** Turns the flat {y,m,d,hh,mm} into a real Date. */
export function toDate(s: { y: number; m: number; d: number; hh: number; mm: number }) {
  return new Date(s.y, s.m - 1, s.d, s.hh, s.mm, 0);
}

/**
 * Which day is "today"? Preselects the right night at check-in so an usher on
 * Day 3 doesn't have to remember to switch tabs. A day is current from 4 hours
 * before its first service until 6 hours after.
 */
export function currentDayLabel(now = new Date()): string {
  for (const day of convention.days) {
    const start = toDate(day.starts);
    const opensAt = new Date(start.getTime() - 4 * 3_600_000);
    const closesAt = new Date(start.getTime() + 6 * 3_600_000);
    if (now >= opensAt && now <= closesAt) return day.label;
  }

  const [first] = convention.days;
  const last = convention.days[convention.days.length - 1];
  return now < toDate(first.starts) ? first.label : last.label;
}
