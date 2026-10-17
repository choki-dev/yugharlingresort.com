// All page content lives here so copy, rates and images can be edited in one place.
// Text and contact details follow the resort's "Revised Website Content" document word for word;
// room rates and the Bumthang photos are from https://www.yugharlingresort.com/

const photo = (file: string) => `/images/resort/${file}`;
// The resort's own photography
export const img = (file: string) => `/images/yugharling/${file}`;

export const site = {
  name: "Yugharling Resort & Wellness Spa",
  tagline: "A Sanctuary of Serenity, Bhutanese Heritage and Sustainable Comfort",
  description:
    "Surrounded by sacred monasteries, pine-covered hills and the crystal-clear waters of the Chamkhar Chhu, Yugharling Resort & Wellness Spa offers a peaceful retreat where Bhutanese tradition, warm hospitality and modern comfort come together.",
  phone: "03 631602",
  phoneHref: "tel:+9753631602",
  phone2: "03 631484",
  phone3: "03 631567",
  mobile: "+975 16169333",
  email: "reservations.yugharling@gmail.com",
  email2: "trepatsang@gmail.com",
  website: "yugharlingresort.com",
  // WhatsApp number that receives Reserve Now requests: digits only, with
  // country code (e.g. "97517123456"). If empty, WhatsApp opens and the visitor picks the chat.
  whatsapp: "97516169333",
  address: "P.O. Box 101, Chamkhar, Bumthang, Bhutan",
};

/** tel: link for a number written as on the content document ("03 631602", "+975 16169333") */
export const telHref = (n: string) => {
  const digits = n.replace(/\D/g, "");
  return `tel:+${n.trim().startsWith("+") ? digits : `975${digits.replace(/^0/, "")}`}`;
};

export const navLeft = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About Us" },
  { href: "/accommodation/", label: "Rooms & Suites" },
  { href: "/facilities/", label: "Facilities" },
];

export const navRight = [
  { href: "/things-to-do/", label: "Bumthang" },
  { href: "/booking/", label: "Booking" },
  { href: "/contact/", label: "Contact" },
];

export const socials = [
  { icon: "fb", label: "Facebook" },
  { icon: "ig", label: "Instagram" },
  { icon: "x", label: "X" },
  { icon: "yt", label: "YouTube" },
];

/* ---------- 1. Home page ---------- */

// Hero Section: "A Sanctuary of Serenity in the Heart of Bumthang"
export const heroSlides = [
  {
    script: "A Sanctuary of Serenity in the Heart of",
    title: "Bumthang",
    text: "Surrounded by sacred monasteries, pine-covered hills and the crystal-clear waters of the Chamkhar Chhu, Yugharling Resort & Wellness Spa offers a peaceful retreat where Bhutanese tradition, warm hospitality and modern comfort come together.",
    image: img("resort-view.jpg"),
  },
  {
    script: "A Sanctuary of Serenity in the Heart of",
    title: "Bumthang",
    text: "Inspired by the spiritual heritage and natural beauty of Bumthang, our resort invites you to slow down, reconnect and experience the timeless rhythm of Bhutanese life.",
    image: img("balcony.jpg"),
  },
];

// Welcome to Yugharling
export const about = {
  imgMain: img("garden.jpg"),
  imgMainAlt: "Resort garden and terrace",
  imgSmall: img("lobby-cafe-balcony-1.jpg"),
  imgSmallAlt: "Café balcony overlooking the Bumthang Valley",
  stamp: { count: 5, text: "Room<br />types" },
  intro: [
    "Bumthang has long been a place of spiritual reflection and inspiration. At Yugharling, we seek to reflect that same sense of calm through genuine hospitality, thoughtful service and spaces designed for rest and renewal.",
    "Traditional Bhutanese craftsmanship, locally inspired interiors and energy-efficient technologies come together to create an experience that feels rooted in place while offering the comforts of a modern resort.",
  ],
};

// Discover Yugharling
export const amenities = [
  { num: "01", title: "Rooms & Suites", text: "Warm Bhutanese interiors, restful spaces and beautiful views of the Bumthang Valley.", image: img("junior-suite.jpg"), href: "/accommodation/" },
  { num: "02", title: "Dining & Lounge", text: "Enjoy dining, refreshments and relaxed social spaces in our distinctive Bhutanese-named venues.", image: img("dining-3.jpg"), href: "/facilities/#dining" },
  { num: "03", title: "Spa & Wellness", text: "Restore body and mind in a wellness environment designed for quiet comfort and relaxation.", image: img("hot-stone-bath.jpg"), href: "/facilities/#wellness" },
];

// Comfort by Nature (short guest-focused reference; details on the Sustainability page)
export const comfort = {
  image: img("resort-view.jpg"),
  imageSmall: img("garden.jpg"),
  text: "Our approach to sustainability combines Bhutanese building traditions with modern efficiency. Locally produced mud bricks and traditional mud wash help the buildings sit naturally within the valley, while heat-pump hot water, Energy Recovery Ventilation (ERV), efficient climate control, LED lighting, waste reduction and locally sourced products support a more mindful way of operating.",
};

// Experience Bumthang
export const explore = {
  label: "Bumthang, Bhutan",
  title: "Experience Bumthang",
  text: "Let Yugharling be your peaceful base for discovering Bumthang's spiritual heritage, cultural landscapes and quiet natural beauty. From sacred sites and traditional communities to valley walks and seasonal experiences, Bumthang offers time and space to reconnect with Bhutan.",
  tiles: [
    { title: "Sacred sites", label: "Spiritual heritage", image: photo("kurje.jpg"), alt: "Temple in Bumthang", cls: "dest--tall" },
    { title: "Local crafts", label: "Traditional products", image: photo("Bumthang-Textiles.jpg"), alt: "Traditional Bumthang textile", cls: "" },
    { title: "Seasonal festivals", label: "Cultural events", image: photo("Bumthang-festivals-story-image1.jpg"), alt: "Masked dancer at a Bumthang festival", cls: "" },
    { title: "Wellness", label: "Quiet reflection", image: img("hot-stone-bath-1.jpg"), alt: "Traditional hot stone bath", cls: "" },
    { title: "Valley walks", label: "Nature", image: photo("Ura1-1.jpg"), alt: "Valley pastures in Bumthang", cls: "" },
  ],
};

export const gallery = [
  { file: "lobby-cafe-balcony.jpg", alt: "Café deck overlooking the valley" },
  { file: "massage.jpg", alt: "Spa massage room" },
  { file: "suite-sitting.jpg", alt: "Executive suite lounge" },
  { file: "bonfire.jpg", alt: "Evening bonfire on the terrace" },
  { file: "bar-pool.jpg", alt: "Bar with pool table" },
  { file: "yoga-room.jpg", alt: "Choesham altar room" },
].map((g) => ({ full: img(g.file), thumb: img(g.file), alt: g.alt }));

/* ---------- 2. About Us ---------- */
export const aboutPage = [
  {
    title: "A Sanctuary of Serenity and Sustainability",
    image: img("resort-view.jpg"), imageSmall: img("lobby-cafe-balcony.jpg"),
    text: [
      "Located in the spiritual heartland of Bhutan, Yugharling Resort & Wellness Spa is a peaceful haven where tradition, nature and mindful hospitality converge. Nestled among sacred monasteries, pine-covered hills and the clear waters of the Chamkhar Chhu, the resort offers a calm setting from which to experience the character of Bumthang.",
      "Bumthang has long served as a refuge and source of inspiration for saints and sages drawn to the valley's tranquility and spiritual stillness. At Yugharling, we seek to honour that atmosphere through genuine hospitality, personalized service and thoughtful attention to guest comfort and well-being.",
    ],
  },
  {
    title: "Rooted in Bhutanese Tradition",
    image: img("garden.jpg"), imageSmall: img("suite-corridor.jpg"),
    text: [
      "Our buildings reflect Bhutanese architectural heritage and a respect for the surrounding environment. Locally produced mud bricks and natural mud wash create earthy exteriors that blend with the valley while supporting natural thermal regulation. Inside, warm wood finishes and modern materials provide comfort, cleanliness and durability.",
    ],
  },
  {
    title: "Our Approach to Hospitality",
    image: img("reception.jpg"), imageSmall: img("dining.jpg"),
    text: [
      "We believe a memorable stay is created through warmth, calm and authenticity. From restful rooms and fresh indoor air to local flavours, wellness experiences and attentive service, each element is intended to help guests feel comfortable, connected and at ease.",
    ],
  },
];

/* ---------- 3. Rooms & Suites ---------- */
export const formatNu = (n: number) => `Nu. ${n.toLocaleString("en-US")}`;

/** wa.me link to the resort with a pre-filled message */
export const whatsappLink = (lines: string[]) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(["Hello Yugharling Resort,", "", ...lines, "", "Thank you!"].join("\n"))}`;

// details = the Bed / Inventory / Location / Balcony / View lines from the content document.
// rate ("Rates From" per night) is from yugharlingresort.com; beds/occupancy/count feed the room cards and booking form.
const roomList = [
  {
    slug: "standard-room", title: "Standard Room", script: "main building",
    intro: "A cozy and peaceful retreat in the main building for guests who value simplicity and comfort. These rooms provide essential amenities and a quiet atmosphere for rest and reflection.",
    details: [["Bed", "Twin beds"], ["Inventory", "3 rooms"], ["Location", "Main building"], ["Balcony", "No"], ["Valley view", "No"]],
    image: img("standard-room.jpg"),
    gallery: ["standard-room.jpg", "bathroom.jpg"],
    rate: 6500, count: 3, beds: "Twin beds", occupancy: 2, valleyView: false, balcony: false, tag: null,
  },
  {
    slug: "standard-deluxe", title: "Standard Deluxe Room", script: "valley view",
    intro: "Located in our cottage buildings, these inviting rooms combine handcrafted wooden interiors, warm lighting and modern comforts with beautiful views across the Bumthang Valley. Each cottage room includes a private balcony.",
    details: [["Bed", "Twin or Double"], ["Inventory", "19 Twin rooms and 5 Double rooms"], ["Location", "Cottage buildings"], ["Balcony", "Yes"], ["View", "Bumthang Valley"]],
    image: img("deluxe-double.jpg"),
    gallery: ["deluxe-double.jpg", "deluxe-twin.jpg", "deluxe-double-1.jpg", "balcony-2.jpg", "bathroom.jpg"],
    rate: 8200, count: 24, beds: "Twin or Double", occupancy: 2, valleyView: true, balcony: true, tag: "Valley View",
  },
  {
    slug: "family-room", title: "Family Room", script: "valley view",
    intro: "A spacious and practical choice for families or small groups. Located in the main building, the room offers generous interior space and a valley-facing window.",
    details: [["Bed", "1 Double + 2 Twin beds"], ["Inventory", "2 rooms"], ["Location", "Main building"], ["Balcony", "No"]],
    image: img("family-room.jpg"),
    gallery: ["family-room.jpg", "family-room-2.jpg", "family-bathroom.jpg"],
    rate: 9500, count: 2, beds: "1 Double + 2 Twin beds", occupancy: 4, valleyView: true, balcony: false, tag: "Valley View",
  },
  {
    slug: "junior-suite", title: "Junior Suite", script: "private balcony",
    intro: "A refined retreat with a cozy two-seat lounge, panoramic valley views and warm interiors. Step onto the private balcony and enjoy the peaceful Bumthang landscape.",
    details: [["Bed", "Double or Twin"], ["Inventory", "3 Double rooms and 3 Twin rooms"], ["Balcony", "Yes"], ["View", "Bumthang Valley"]],
    image: img("junior-suite.jpg"),
    gallery: ["junior-suite.jpg", "junior-suite-1.jpg", "junior-suite-2.jpg", "balcony.jpg", "bathroom.jpg"],
    rate: 8500, count: 6, beds: "Double or Twin", occupancy: 2, valleyView: true, balcony: true, tag: null,
  },
  {
    slug: "executive-suite", title: "Executive Suite", script: "valley view",
    intro: "Our most spacious and luxurious accommodation offers a separate lounge area, panoramic valley-facing windows and a serene design. Located in the main building, these suites provide enhanced privacy and generous living space.",
    details: [["Bed", "Twin or Double"], ["Inventory", "5 Twin rooms and 3 Double rooms"], ["Location", "Main building"], ["Balcony", "No"], ["View", "Bumthang Valley"]],
    image: img("suite.jpg"),
    gallery: ["suite.jpg", "suite-sitting.jpg", "suite-double.jpg", "suite-twin.jpg", "suite-double-1.jpg", "suite-1.jpg", "suite-corridor.jpg", "bathroom.jpg"],
    rate: 13500, count: 8, beds: "Twin or Double", occupancy: 2, valleyView: true, balcony: false, tag: "Valley View",
  },
];

export const rooms = roomList.map((r) => ({
  ...r,
  href: `/accommodation/${r.slug}/`,
  price: formatNu(r.rate),
  // First sentence of the description, for cards
  text: r.intro.split(/(?<=\.)\s/)[0],
  label: r.details.filter(([k]) => k === "Location" || k === "View").map(([, v]) => v).join(" · "),
  meta: [r.beds, `${r.occupancy} guests`, r.valleyView ? "Valley view" : "Main building"],
  gallery: r.gallery.map(img),
}));

export const accommodation = {
  intro: "Step into newly renovated guest rooms where traditional Bhutanese craftsmanship blends with modern refinement. Natural wood finishes, ambient lighting and locally crafted furnishings create warm, restful spaces inspired by the tranquility of Bumthang.",
  balconyNote: "Private balconies are available only in rooms located in the cottage buildings. Main-building rooms feature large windows but do not have outdoor balconies.",
  // Room Features
  features: [
    "Locally produced mud-brick exterior walls with traditional mud wash.",
    "Locally crafted wooden interiors with exposed beams and slatted wall details.",
    "Polished wood flooring for natural warmth.",
    "Large windows with sheer and blackout curtains for comfort and privacy.",
    "Custom-designed Bhutanese furniture, including armchairs, desks and tea stations.",
    "Complimentary herbal tea and a locally sourced hospitality tray.",
    "Flat-screen TV, complimentary Wi-Fi, intercom and writing desk; lounge seating in select rooms.",
    "Spacious en suite bathrooms with 24-hour hot water powered by energy-efficient heat pumps.",
    "Energy Recovery Ventilation (ERV) supplying fresh air to support a comfortable indoor environment.",
  ],
};

export const booking = {
  // Scrolling notice inside the Check Availability bar
  notice: "Private balconies are available only in rooms located in the cottage buildings · Complimentary Wi-Fi · 24-hour hot water powered by heat-pump systems",
  maxAdults: 10,
  maxChildren: 6,
};

/* ---------- 7. Sustainability ---------- */
export const sustainability = {
  intro: "At Yugharling, sustainability is integrated into the way the resort is built and operated. Our aim is to combine traditional Bhutanese knowledge with practical modern technologies that improve guest comfort while reducing unnecessary energy and resource use.",
  items: [
    { title: "Traditional Materials", text: "Locally produced mud bricks and natural mud wash connect the resort to Bhutanese craftsmanship and the earthy character of the Bumthang Valley.", image: img("garden.jpg") },
    { title: "Heat-Pump Hot Water", text: "Hot water throughout the resort is provided by energy-efficient heat-pump systems, reducing electricity use compared with conventional resistance heating.", image: img("bathroom.jpg") },
    { title: "Fresh-Air Ventilation", text: "Energy Recovery Ventilation (ERV) brings fresh air into guest and common areas while helping conserve indoor heating energy.", image: img("suite-sitting.jpg") },
    { title: "Efficient Spa Comfort", text: "Spa and wellness areas use heat-pump and fan-coil systems to maintain comfortable indoor conditions efficiently.", image: img("sauna-room.jpg") },
    { title: "Local & Mindful", text: "We support local artisans, use locally sourced produce and herbs where practical, and follow waste-reduction practices including segregation, composting and recycling.", image: img("gift-shop.jpg") },
  ],
};
