/* Reads and writes a stay in the URL, shared by the booking bar and the availability page.
   Availability links use ?dates=22/10/2026 to 24/10/2026&adults=2&children=0&rooms=1;
   booking links use ?checkin=2026-10-22&checkout=2026-10-24, so both are accepted when reading. */

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

const isoDate = (v) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

/** "22/10/2026" → "2026-10-22" */
const fromDmy = (v) => {
  const m = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : null;
};

/** "2026-10-22" → "22/10/2026" */
const toDmy = (iso) => iso.split("-").reverse().join("/");

const count = (v) => {
  const n = Number(v);
  return v !== null && v !== "" && Number.isInteger(n) && n >= 0 ? n : null;
};

/** Local-date ISO (avoids the UTC shift of toISOString) */
export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fromISO = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};

export function readStayParams(search) {
  const p = new URLSearchParams(search);
  let checkIn = isoDate(p.get("checkin"));
  let checkOut = isoDate(p.get("checkout"));
  const dates = p.get("dates");
  if (dates) {
    const [a, b] = dates.split(/\s+to\s+/i);
    checkIn = (a && fromDmy(a)) || checkIn;
    checkOut = (b && fromDmy(b)) || checkOut;
  }
  return { checkIn, checkOut, adults: count(p.get("adults")), children: count(p.get("children")), rooms: count(p.get("rooms")) };
}

export function availabilityUrl(s) {
  const p = new URLSearchParams({
    dates: `${toDmy(s.checkIn)} to ${toDmy(s.checkOut)}`,
    adults: String(s.adults),
    children: String(s.children),
    rooms: String(s.rooms),
  });
  return `${base}/availability/?${p}`;
}

export function bookUrl(s, room) {
  const p = new URLSearchParams({
    checkin: s.checkIn,
    checkout: s.checkOut,
    adults: String(s.adults),
    children: String(s.children),
    rooms: String(s.rooms),
  });
  if (room) p.set("room", room);
  return `${base}/booking/?${p}#booking-form`;
}
