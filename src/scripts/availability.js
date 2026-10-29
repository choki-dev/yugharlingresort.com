/* Availability page, as on the33rdes.com: stay summary, a notice when the request can't be made
   online, and per room a status line, the stay total, Book Now (booking form, pre-filled) and
   Reserve Now carrying the stay to the reservations WhatsApp */
import { bookUrl, fromISO, readStayParams } from "./stay-params.js";

const list = document.getElementById("availabilityList");

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const nu = (n) => `Nu. ${n.toLocaleString("en-US")}`;
const pretty = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

if (list) init();

function init() {
  const summary = document.getElementById("staySummary");
  const notice = document.getElementById("stayNotice");
  const number = list.dataset.whatsapp;
  const maxRooms = Number(list.dataset.maxRooms);
  const maxNights = Number(list.dataset.maxNights);

  const fromUrl = readStayParams(location.search);
  const start = fromISO(fromUrl.checkIn);
  const end = fromISO(fromUrl.checkOut);
  // Without dates, ask for them rather than guessing; the room cards keep their plain links
  if (!start || !end) {
    summary.textContent = "Choose your arrival and departure dates above";
    return;
  }

  const stay = {
    checkIn: fromUrl.checkIn,
    checkOut: fromUrl.checkOut,
    adults: Math.max(1, fromUrl.adults ?? 2),
    children: fromUrl.children ?? 0,
    rooms: Math.min(maxRooms, Math.max(1, fromUrl.rooms ?? 1)),
  };
  const nights = Math.round((end - start) / 86400000);
  const guests = `${plural(stay.adults, "Adult", "Adults")}, ${plural(stay.children, "Child", "Children")}`;

  summary.textContent = [
    guests,
    plural(stay.rooms, "Room", "Rooms"),
    plural(Math.max(nights, 0), "Night", "Nights"),
    nights > 0 ? `${pretty(start)} – ${pretty(end)}` : "",
  ].filter(Boolean).join(" · ");

  const showNotice = (msg) => {
    if (!notice.hidden) return;
    notice.textContent = msg;
    notice.hidden = false;
  };

  // Problems with the dates apply to every room
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let dateError = null;
  if (start < today) dateError = "Arrival date cannot be in the past.";
  else if (nights < 1) dateError = "Departure must be after arrival.";
  else if (nights > maxNights) dateError = `For stays longer than ${maxNights} nights, please contact us directly.`;

  list.querySelectorAll(".avail-card").forEach((card) => {
    if (dateError) {
      card.classList.add("is-disabled");
      showNotice(dateError);
      return;
    }

    const rate = Number(card.dataset.rate);
    const occupancy = Number(card.dataset.occupancy);
    // Children share with parents; adults set how many rooms are needed
    const needed = Math.max(stay.rooms, Math.ceil(stay.adults / occupancy));
    if (needed > maxRooms) {
      card.classList.add("is-disabled");
      showNotice(`Online requests are limited to ${maxRooms} rooms. For groups, please contact us.`);
      return;
    }
    const forRoom = { ...stay, rooms: needed };
    const total = rate * needed * nights;

    const status = card.querySelector(".js-stay-status");
    if (needed > stay.rooms) {
      status.textContent = `Sleeps ${occupancy} adults per room — ${plural(needed, "room", "rooms")} needed for ${plural(stay.adults, "adult", "adults")}`;
      status.classList.add("is-warn");
    } else {
      status.textContent = `Suits ${plural(stay.adults, "adult", "adults")}${stay.children ? ` and ${plural(stay.children, "child", "children")}` : ""} in ${plural(needed, "room", "rooms")}`;
    }

    const note = card.querySelector(".js-stay-note");
    note.textContent = `${nu(total)} for ${plural(nights, "night", "nights")}${needed > 1 ? ` (${needed} rooms)` : ""}`;
    note.hidden = false;

    card.querySelector(".js-book").href = bookUrl(forRoom, card.dataset.slug);

    const message = [
      "Hello Yugharling Resort,",
      "",
      "I would like to make a reservation:",
      `• Room type: ${card.dataset.room}`,
      `• Check-in: ${pretty(start)}`,
      `• Check-out: ${pretty(end)}`,
      `• Nights: ${nights}`,
      `• Rooms: ${needed}`,
      `• Guests: ${guests}`,
      `• Estimated total: from ${nu(total)}`,
      "",
      `Could you please let me know if the ${needed > 1 ? "rooms are" : "room is"} available for these dates?`,
      "",
      "Thank you!",
    ].join("\n");
    card.querySelector(".js-reserve").href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  });
}
