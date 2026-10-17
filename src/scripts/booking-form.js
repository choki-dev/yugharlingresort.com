/* Booking page: validate the request and send it as a WhatsApp message */
import flatpickr from "flatpickr";

const form = document.getElementById("bookingRequest");

if (form) {
  const error = document.getElementById("bookingError");
  const datesInput = form.querySelector(".js-dates");
  const pretty = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const picker = flatpickr(datesInput, {
    mode: "range",
    minDate: "today",
    dateFormat: "j M Y",
    showMonths: window.innerWidth <= 768 ? 1 : 2,
    disableMobile: true,
    locale: { rangeSeparator: "  →  " },
  });

  const params = new URLSearchParams(location.search);

  // ?room=<slug> (from a room page) pre-selects the room
  const slug = params.get("room");
  if (slug) {
    const opt = form.querySelector(`option[data-slug="${CSS.escape(slug)}"]`);
    if (opt) opt.selected = true;
  }

  // ?checkin=&checkout=&adults=&children= (from the Check Availability bar) pre-fill the stay
  const fromISO = (s) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkinParam = fromISO(params.get("checkin"));
  const checkoutParam = fromISO(params.get("checkout"));
  if (checkinParam && checkoutParam && checkinParam >= today && checkoutParam > checkinParam) {
    picker.setDate([checkinParam, checkoutParam], true);
  }
  const preselect = (name, val) => {
    const opt = Array.from(form.elements[name].options).find((o) => o.value === val);
    if (opt) opt.selected = true;
  };
  preselect("adults", params.get("adults"));
  preselect("kids", params.get("children"));

  const field = (name) => form.elements[name];
  const value = (name) => (field(name).value || "").trim();

  function fail(message, name) {
    error.textContent = message;
    const el = name === "dates" ? datesInput : field(name);
    el.closest(".form-field").classList.add("is-invalid");
    if (name === "dates") picker.open();
    else el.focus();
  }

  form.addEventListener("input", (e) => e.target.closest(".form-field")?.classList.remove("is-invalid"));
  picker.config.onChange.push(() => datesInput.closest(".form-field").classList.remove("is-invalid"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));

    if (!value("name")) return fail("Please enter your full name.", "name");
    if (!value("phone")) return fail("Please enter a phone or WhatsApp number.", "phone");
    if (value("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) return fail("Please enter a valid email address.", "email");
    const [checkin, checkout] = picker.selectedDates;
    if (!checkin || !checkout) return fail("Please choose your check-in and check-out dates.", "dates");

    const nights = Math.max(1, Math.round((checkout - checkin) / 86400000));
    const lines = [
      "Hello Yugharling Resort,",
      "",
      "I would like to make a booking request:",
      "",
      "Personal information",
      `• Name: ${value("name")}`,
      `• Phone: ${value("phone")}`,
      value("email") ? `• Email: ${value("email")}` : null,
      value("country") ? `• Country: ${value("country")}` : null,
      "",
      "Travel requirements",
      `• Check-in: ${pretty(checkin)}`,
      `• Check-out: ${pretty(checkout)} (${nights} ${nights === 1 ? "night" : "nights"})`,
      `• Room type: ${value("room") || "No preference"}`,
      `• Bed type: ${value("bed") || "No preference"}`,
      `• Adults: ${value("adults")}`,
      `• Kids: ${value("kids")}`,
      value("notes") ? "" : null,
      value("notes") ? `Special requests: ${value("notes")}` : null,
      "",
      "Please let me know if this is available. Thank you!",
    ].filter((l) => l !== null);

    const number = (form.dataset.whatsapp || "").replace(/\D/g, "");
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
    // (a "noopener" window.open always returns null, so detach the opener by hand)
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url; // popup blocked: open in this tab
  });
}
