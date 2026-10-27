/* Yugharling Resort — Check Availability bar */
import flatpickr from "flatpickr";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const BOOKING_URL = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/booking/`;

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

  setCount("adults", getCount("adults"));
  setCount("children", getCount("children"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleDropdown(false);
    const p = new URLSearchParams();
    const [start, end] = picker.selectedDates;
    if (start && end) {
      p.set("checkin", toISO(start));
      p.set("checkout", toISO(end));
    }
    p.set("adults", getCount("adults"));
    p.set("children", getCount("children"));
    window.location.href = `${BOOKING_URL}?${p}#booking-form`;
  });
}

/* ---------- Boot ---------- */
$$(".js-booking-bar").forEach(initBar);
