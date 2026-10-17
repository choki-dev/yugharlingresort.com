/* Yugharling Resort — Check Availability bar */
import flatpickr from "flatpickr";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const BOOKING_URL = "/booking/";

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const guestsLabel = (a, c) => `${plural(a, "Adult", "Adults")}, ${plural(c, "Child", "Children")}`;

// Local-date ISO (avoids the UTC shift of toISOString)
const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ---------- One booking bar instance ---------- */
function initBar(form) {
  const datesInput = $(".bb-dates", form);
  const checkin = $(".bb-checkin", form);
  const checkout = $(".bb-checkout", form);
  const guestsGroup = $(".bb-group--guests", form);
  const dropdown = $(".guests-dropdown", form);
  const total = $(".bb-guests-total", form);
  const hidden = { adults: $(".bb-adults", form), children: $(".bb-children", form) };
  const limits = {
    adults: [1, parseInt(form.dataset.maxAdults, 10) || 10],
    children: [0, parseInt(form.dataset.maxChildren, 10) || 6],
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
      form.dispatchEvent(new CustomEvent("booking:change"));
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
    total.textContent = guestsLabel(getCount("adults"), getCount("children"));
    $$(`.btn-ctrl[data-target="${key}"]`, form).forEach((b) => {
      b.disabled = (b.dataset.dir === "-1" && v <= min) || (b.dataset.dir === "1" && v >= max);
    });
  }

  $$(".btn-ctrl", form).forEach((btn) =>
    btn.addEventListener("click", () => {
      const key = btn.dataset.target;
      setCount(key, getCount(key) + parseInt(btn.dataset.dir, 10));
      form.dispatchEvent(new CustomEvent("booking:change"));
    })
  );

  function toggleDropdown(open) {
    dropdown.classList.toggle("show", open);
    guestsGroup.setAttribute("aria-expanded", String(open));
  }
  guestsGroup.addEventListener("click", () => toggleDropdown(!dropdown.classList.contains("show")));
  guestsGroup.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target === guestsGroup) {
      e.preventDefault();
      toggleDropdown(!dropdown.classList.contains("show"));
    }
    if (e.key === "Escape") toggleDropdown(false);
  });
  dropdown.addEventListener("click", (e) => e.stopPropagation());
  $(".btn-ok", form).addEventListener("click", () => toggleDropdown(false));
  document.addEventListener("click", (e) => {
    if (!guestsGroup.contains(e.target)) toggleDropdown(false);
  });

  /** Read the current selection */
  function getState() {
    const [start, end] = picker.selectedDates;
    return {
      checkin: start || null,
      checkout: end || null,
      adults: getCount("adults"),
      children: getCount("children"),
    };
  }

  setCount("adults", getCount("adults"));
  setCount("children", getCount("children"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleDropdown(false);
    window.location.href = `${BOOKING_URL}?${toParams(getState())}#booking-form`;
  });

}

function toParams({ checkin, checkout, adults, children }) {
  const p = new URLSearchParams();
  if (checkin && checkout) {
    p.set("checkin", toISO(checkin));
    p.set("checkout", toISO(checkout));
  }
  p.set("adults", adults);
  p.set("children", children);
  return p.toString();
}

/* ---------- Boot ---------- */
$$(".js-booking-bar").forEach(initBar);
