/* Yugharling Resort — Check Availability bar */
import flatpickr from "flatpickr";
import { availabilityUrl, fromISO, readStayParams, toISO } from "./stay-params.js";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const guestsLabel = (a, c, r) =>
  `${plural(a, "Adult", "Adults")}, ${plural(c, "Child", "Children")} · ${plural(r, "Room", "Rooms")}`;

/* ---------- One booking bar instance ---------- */
function initBar(form) {
  const datesInput = $(".bb-dates", form);
  const checkin = $(".bb-checkin", form);
  const checkout = $(".bb-checkout", form);
  const guestsGroup = $(".bb-group--guests", form);
  const dropdown = $(".guests-dropdown", form);
  const total = $(".bb-guests-total", form);
  const hidden = { adults: $(".bb-adults", form), children: $(".bb-children", form), rooms: $(".bb-rooms", form) };
  const limits = {
    adults: [1, parseInt(form.dataset.maxAdults, 10) || 10],
    children: [0, parseInt(form.dataset.maxChildren, 10) || 6],
    rooms: [1, parseInt(form.dataset.maxRooms, 10) || 5],
  };

  const picker = flatpickr(datesInput, {
    mode: "range",
    minDate: "today",
    dateFormat: "j M Y",
    showMonths: window.innerWidth <= 768 ? 1 : 2,
    disableMobile: true,
    locale: { rangeSeparator: "  →  " },
    onChange(selected) {
      checkin.value = selected[0] ? toISO(selected[0]) : "";
      checkout.value = selected[1] ? toISO(selected[1]) : "";
    },
  });

  function getCount(key) {
    return parseInt(hidden[key].value, 10) || 0;
  }
  function setCount(key, value) {
    const [min, max] = limits[key];
    const v = Math.min(max, Math.max(min, value));
    hidden[key].value = v;
    $(`[data-count-for="${key}"]`, form).textContent = v;
    total.textContent = guestsLabel(getCount("adults"), getCount("children"), getCount("rooms"));
    $$(`.btn-ctrl[data-target="${key}"]`, form).forEach((b) => {
      b.disabled = (b.dataset.dir === "-1" && v <= min) || (b.dataset.dir === "1" && v >= max);
    });
  }

  $$(".btn-ctrl", form).forEach((btn) =>
    btn.addEventListener("click", () => {
      const key = btn.dataset.target;
      setCount(key, getCount(key) + parseInt(btn.dataset.dir, 10));
    })
  );

  const toggle = $(".bb-toggle", guestsGroup);
  function toggleDropdown(open) {
    dropdown.classList.toggle("show", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", () => toggleDropdown(!dropdown.classList.contains("show")));
  guestsGroup.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dropdown.classList.contains("show")) {
      toggleDropdown(false);
      toggle.focus();
    }
  });
  // Close when focus or a click moves outside the guests group
  guestsGroup.addEventListener("focusout", (e) => {
    if (e.relatedTarget && !guestsGroup.contains(e.relatedTarget)) toggleDropdown(false);
  });
  $(".btn-ok", form).addEventListener("click", () => {
    toggleDropdown(false);
    toggle.focus();
  });
  document.addEventListener("click", (e) => {
    if (!guestsGroup.contains(e.target)) toggleDropdown(false);
  });

  // Start from the stay in the URL (e.g. on the availability page); past dates are dropped
  const fromUrl = readStayParams(location.search);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = fromISO(fromUrl.checkIn);
  const end = fromISO(fromUrl.checkOut);
  if (start && end && start >= today && end > start) picker.setDate([start, end], true);
  for (const key of ["adults", "children", "rooms"]) {
    if (fromUrl[key] !== null) hidden[key].value = fromUrl[key];
    setCount(key, getCount(key));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleDropdown(false);
    const [start, end] = picker.selectedDates;
    // No dates yet: open the calendar instead of searching
    if (!start || !end) return picker.open();
    // Opens the room list for these dates, e.g. /availability/?dates=22/10/2026 to 24/10/2026&adults=2…
    window.location.href = availabilityUrl({
      checkIn: toISO(start),
      checkOut: toISO(end),
      adults: getCount("adults"),
      children: getCount("children"),
      rooms: getCount("rooms"),
    });
  });
}

/* ---------- Boot ---------- */
$$(".js-booking-bar").forEach(initBar);
