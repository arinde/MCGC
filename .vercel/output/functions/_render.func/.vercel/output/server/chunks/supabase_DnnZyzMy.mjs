import { t as env } from "./env_X662t_9j.mjs";
import { createClient } from "@supabase/supabase-js";
var convention = {
	church: "Mercy of Christ Gospel Church",
	churchSuffix: "(World Wide) · Ori Oke Majiyagbe",
	title: "Majiyagbe Convention",
	year: "2026",
	theme: [
		"BEHOLD",
		"I COME",
		"QUICKLY"
	],
	tagline: "seven days at Ori Oke Majiyagbe",
	verse: "Behold, I come quickly; and my reward is with me, to give every man according as his work shall be.",
	verseRef: "Revelation 22:12",
	/** First service of the convention — drives the countdown. */
	starts: {
		y: 2026,
		m: 8,
		d: 24,
		hh: 17,
		mm: 0
	},
	datesLabel: "Mon 24 – Sun 30 August 2026",
	venue: {
		name: "Ori Oke Majiyagbe",
		address: "1–7 Majiyagbe Street, Igbe Alagemo, Off Ipetu-Oloja, Igbogbo Bayeku, Ikorodu, Lagos State",
		landmark: "Mercy of Christ Gospel Church (World Wide)",
		/** Text Google Maps searches for. Test this on a phone before sharing the link. */
		maps: "Majiyagbe Mountain Mercy of Christ Gospel Church Ikorodu Lagos",
		getting: [
			"Parking is available within the church compound.",
			"Igbogbo Bayeku is reachable by bus from Ikorodu garage.",
			"Ushers are on hand at the gate to direct you to a seat."
		]
	},
	contact: {
		whatsapp: "2348000000000",
		display: "+234 800 000 0000",
		email: "info@mcgcworldwide.org"
	},
	facts: [
		{
			k: "Dates",
			v: "24 – 30 August",
			s: "Monday to Sunday"
		},
		{
			k: "Venue",
			v: "Ori Oke Majiyagbe",
			s: "Ikorodu, Lagos"
		},
		{
			k: "Convener",
			v: "Prophet N.G. Bolarinde",
			s: "General Overseer"
		},
		{
			k: "Admission",
			v: "Free",
			s: "Everyone welcome"
		}
	],
	expect: [
		{
			t: "Seven days of worship",
			d: "Ministration nightly, with guest artistes through the week."
		},
		{
			t: "The Word, daily",
			d: "Taught by the General Overseer and other anointed men of God."
		},
		{
			t: "Praise Night",
			d: "Friday 28th from 9:00 PM — the loudest night of the convention."
		},
		{
			t: "Thanksgiving Service",
			d: "Sunday 30th at 9:00 AM, closing the convention together."
		},
		{
			t: "Prayer and ministration",
			d: "Personal prayer at the altar after every service."
		}
	],
	days: [
		{
			label: "Day 1",
			date: "Mon · 24 Aug",
			title: "Opening Service",
			sub: "Behold, I Come Quickly",
			starts: {
				y: 2026,
				m: 8,
				d: 24,
				hh: 17,
				mm: 0
			},
			sessions: [{
				time: "5:00 PM",
				title: "Doors open · Praise & worship",
				who: "Convention Choir"
			}, {
				time: "6:00 PM",
				title: "Opening charge",
				who: "Prophet N.G. Bolarinde JP",
				tag: "Opening"
			}]
		},
		{
			label: "Day 2",
			date: "Tue · 25 Aug",
			title: "Second Night",
			sub: "Watch Therefore",
			starts: {
				y: 2026,
				m: 8,
				d: 25,
				hh: 17,
				mm: 0
			},
			sessions: [{
				time: "5:00 PM",
				title: "Praise & worship",
				who: "Convention Choir"
			}, {
				time: "6:00 PM",
				title: "Ministration & the Word",
				who: "Anointed Men of God"
			}]
		},
		{
			label: "Day 3",
			date: "Wed · 26 Aug",
			title: "Third Night",
			sub: "Prepare The Way",
			starts: {
				y: 2026,
				m: 8,
				d: 26,
				hh: 17,
				mm: 0
			},
			sessions: [{
				time: "5:00 PM",
				title: "Praise & worship",
				who: "Convention Choir"
			}, {
				time: "6:00 PM",
				title: "Ministration & the Word",
				who: "Anointed Men of God"
			}]
		},
		{
			label: "Day 4",
			date: "Thu · 27 Aug",
			title: "Fourth Night",
			sub: "His Reward Is With Him",
			starts: {
				y: 2026,
				m: 8,
				d: 27,
				hh: 17,
				mm: 0
			},
			sessions: [{
				time: "5:00 PM",
				title: "Praise & worship",
				who: "Convention Choir"
			}, {
				time: "6:00 PM",
				title: "Ministration & the Word",
				who: "Anointed Men of God"
			}]
		},
		{
			label: "Day 5",
			date: "Fri · 28 Aug",
			title: "Praise Night",
			sub: "All Night Of Praise",
			starts: {
				y: 2026,
				m: 8,
				d: 28,
				hh: 21,
				mm: 0
			},
			sessions: [{
				time: "9:00 PM",
				title: "Praise Night begins",
				who: "All guest artistes",
				tag: "Praise Night"
			}]
		},
		{
			label: "Day 6",
			date: "Sat · 29 Aug",
			title: "Sixth Day",
			sub: "Even So, Come",
			starts: {
				y: 2026,
				m: 8,
				d: 29,
				hh: 17,
				mm: 0
			},
			sessions: [{
				time: "5:00 PM",
				title: "Praise & worship",
				who: "Convention Choir"
			}, {
				time: "6:00 PM",
				title: "Ministration & the Word",
				who: "Anointed Men of God"
			}]
		},
		{
			label: "Day 7",
			date: "Sun · 30 Aug",
			title: "Thanksgiving Service",
			sub: "Grand Finale",
			starts: {
				y: 2026,
				m: 8,
				d: 30,
				hh: 9,
				mm: 0
			},
			sessions: [{
				time: "9:00 AM",
				title: "Thanksgiving Service",
				who: "Prophet N.G. Bolarinde JP",
				tag: "Finale"
			}]
		}
	],
	ministers: [
		{
			name: "Prophet N.G. Bolarinde JP",
			role: "Convener",
			org: "General Overseer · aka Baba Majiyagbe",
			slots: "Throughout the convention"
		},
		{
			name: "Min. Biola Tayo",
			role: "Guest Artiste",
			slots: "Ministering"
		},
		{
			name: "Min. Mobolaji John",
			role: "Guest Artiste",
			org: "Authority",
			slots: "Ministering"
		},
		{
			name: "Min. Oluwafemi Simeon",
			role: "Guest Artiste",
			slots: "Ministering"
		},
		{
			name: "Min. Segun Peculiar",
			role: "Guest Artiste",
			slots: "Ministering"
		},
		{
			name: "Min. Ariyo Best",
			role: "Guest Artiste",
			slots: "Ministering"
		}
	]
};
/** Day labels, for the form, the dashboard and check-in. */
var dayLabels = convention.days.map((d) => d.label);
/** Turns the flat {y,m,d,hh,mm} into a real Date. */
function toDate(s) {
	return new Date(s.y, s.m - 1, s.d, s.hh, s.mm, 0);
}
/**
* Which day is "today"? Preselects the right night at check-in so an usher on
* Day 3 doesn't have to remember to switch tabs. A day is current from 4 hours
* before its first service until 6 hours after.
*/
function currentDayLabel(now = /* @__PURE__ */ new Date()) {
	for (const day of convention.days) {
		const start = toDate(day.starts);
		const opensAt = /* @__PURE__ */ new Date(start.getTime() - 144e5);
		const closesAt = new Date(start.getTime() + 216e5);
		if (now >= opensAt && now <= closesAt) return day.label;
	}
	const [first] = convention.days;
	const last = convention.days[convention.days.length - 1];
	return now < toDate(first.starts) ? first.label : last.label;
}
//#endregion
//#region src/lib/supabase.ts
/**
* Server-only Supabase client.
*
* Uses the SERVICE ROLE key, which bypasses Row Level Security. That is
* deliberate: every table has RLS on with zero policies, so the database is
* unreachable except through this file, which only ever runs on the server.
*
* Never import this into a component that ships to the browser.
*/
var cached = null;
function getSupabase() {
	if (cached) return cached;
	const url = env.supabaseUrl;
	const key = env.supabaseServiceRoleKey;
	if (!url || !key) throw new Error("Supabase is not configured. Copy .env.example to .env and fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API).");
	cached = createClient(url, key, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
	return cached;
}
/** True when the database is wired up — lets pages degrade gracefully instead of crashing. */
function isConfigured() {
	return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}
/**
* Confirmation code: 6 characters, no vowels (so it can't spell anything
* unfortunate) and no 0/O/1/I (so it can't be misread over the phone).
*/
var ALPHABET = "23456789BCDFGHJKLMNPQRSTVWXYZ";
function makeCode() {
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6));
	return Array.from(bytes, (b) => ALPHABET[b % 29]).join("");
}
/** Writes a line to the dashboard's activity feed. Never throws — logging must not break a request. */
async function logActivity(kind, summary, meta = {}) {
	try {
		await getSupabase().from("activity_log").insert({
			kind,
			summary,
			meta
		});
	} catch {}
}
//#endregion
export { convention as a, makeCode as i, isConfigured as n, currentDayLabel as o, logActivity as r, dayLabels as s, getSupabase as t };
