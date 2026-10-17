// Content for the internal pages, word for word from the resort's "Revised Website Content" document.

import { url } from "./site";

const photo = (file: string) => url(`/images/resort/${file}`);
const img = (file: string) => url(`/images/yugharling/${file}`);

/* ---------- Facilities: 4. Dining, Bar & Lounge · 5. Spa & Wellness · 6. Meetings & Events ---------- */
const groups = [
  {
    id: "dining", title: "Dining, Bar & Lounge",
    intro: "Our dining and social spaces combine Bhutanese character with comfortable settings for meals, refreshments and relaxed conversation.",
    items: [
      { name: "Soelkhang", local: "Dining", text: ["A welcoming dining space for resort guests to enjoy meals in a warm and comfortable setting."], images: ["dining.jpg", "dining-3.jpg", "dining-2.jpg", "dining-1.jpg"] },
      { name: "Chhangkhang", local: "Bar", text: ["A relaxed bar where guests can unwind and enjoy refreshments after a day of exploring Bumthang."], images: ["bar.jpg", "bar-pool.jpg", "bar-counter.jpg"] },
      { name: "Trokhang", local: "Lounge & Cafe", text: ["A comfortable lounge and cafe for tea, coffee, light refreshments and informal gatherings."], images: ["lobby-cafe-balcony.jpg", "cafe-counter.jpg", "lobby.jpg", "lobby-chairs.jpg"] },
    ],
  },
  {
    id: "wellness", title: "Spa & Wellness",
    intro: null,
    items: [
      {
        name: "Zugdekhang", local: "Spa & Fitness",
        text: [
          "Zugdekhang is our dedicated wellness space, designed to support relaxation, renewal and physical well-being. The spa and fitness areas are climate-controlled using energy-efficient heat-pump and fan-coil technology for year-round comfort.",
          "The wellness facilities include spaces for spa treatments, fitness, sauna and hot-stone bathing, creating a peaceful environment in which guests can unwind after travel or a day of sightseeing.",
        ],
        images: ["hot-stone-bath.jpg", "massage.jpg", "sauna-room.jpg", "gym.jpg"],
      },
    ],
    note: {
      title: "Wellness with a Local Connection",
      text: "Where appropriate, locally sourced herbs and Bhutanese-inspired elements are incorporated into our wellness approach, connecting the experience to the landscape and traditions of Bhutan.",
    },
  },
  {
    id: "meetings", title: "Meetings & Events",
    intro: null,
    items: [
      {
        name: "Tshogkhang", local: "Conference & Meeting Facilities",
        text: [
          "Tshogkhang provides a dedicated setting for meetings, conferences, workshops and group events. The space is suited to both formal programs and private gatherings, supported by the resort's hospitality and food-and-beverage services.",
          "For event enquiries, guests and organizers may contact the resort directly for seating arrangements, catering options and other requirements.",
        ],
        images: ["conference.jpg", "conference-1.jpg"],
      },
      { name: "Choesham", local: "Altar & Prayer Room", text: ["Choesham offers a quiet space reflecting Bhutan's spiritual traditions, providing guests with an environment for contemplation and prayer."], images: ["yoga-room.jpg", "yoga-room-1.jpg"] },
    ],
  },
];

let n = 0;
export const facilityGroups = groups.map((g) => ({
  ...g,
  items: g.items.map((f) => ({ ...f, id: f.name.toLowerCase(), num: String(++n).padStart(2, "0"), images: f.images.map(img) })),
}));

// 9. Facilities & Amenities — the remaining key facilities
export const keyAmenities = [
  "Complimentary Wi-Fi",
  "24-hour hot water powered by heat-pump systems",
  "Fresh-air ventilation through ERV systems in guest rooms",
  "Garden and outdoor areas",
];

/* ---------- 8. Experience Bumthang ---------- */
// The document asks that specific attractions, distances, travel times and seasonal
// activities be added only after the resort confirms the exact details.
export const experience = {
  intro: "Bumthang is known for its spiritual heritage, peaceful valleys, sacred monasteries and deep connection to Bhutanese history and culture. Yugharling offers a tranquil base from which guests can discover the region at an unhurried pace.",
  categories: [
    { text: "Sacred monasteries, temples and spiritual sites.", image: photo("kurje.jpg"), alt: "Temple in Bumthang" },
    { text: "Bhutanese culture, traditional architecture and local communities.", image: photo("Bumthang.jpg"), alt: "Bumthang valley and farmland" },
    { text: "Valley walks and nature experiences.", image: photo("Bridungla3.jpg"), alt: "Pine forest and mountain peaks" },
    { text: "Seasonal festivals and cultural events.", image: photo("Bumthang-festivals-story-image1.jpg"), alt: "Masked dancer at a Bumthang festival" },
    { text: "Local food, crafts and traditional products.", image: photo("Bumthang-Textiles.jpg"), alt: "Traditional Bumthang textile" },
    { text: "Wellness, quiet reflection and slow travel.", image: img("hot-stone-bath-1.jpg"), alt: "Traditional hot stone bath" },
  ],
};

/* ---------- 10. Contact & Booking ---------- */
export const contact = {
  intro: "Whether you are visiting Bumthang for its sacred heritage, natural beauty, cultural experiences or simply a peaceful escape, Yugharling Resort & Wellness Spa welcomes you to a stay shaped by Bhutanese warmth and thoughtful comfort.",
  note: "For room reservations, group bookings, meetings, events or special requests, please contact us directly or use the enquiry form on our website.",
  mapEmbed: "https://maps.google.com/maps?q=Yu-Gharling%20Resort%20%26%20Spa&t=m&z=12&output=embed&iwloc=near",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Yu-Gharling%20Resort%20%26%20Spa%20Bumthang",
};
