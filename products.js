/**
 * WAOU! - CATÁLOGO DE PRODUCTOS (Tech Pit Stop, Cars & Collectibles)
 * Diseñado y fabricado en Colombia con biopolímeros PLA de alta densidad y tecnología 3D.
 * Solo contiene los productos oficiales suministrados por WAOU!
 */

const F1_CIRCUITS_LIST = [
  "MONACO",
  "MONZA",
  "BELGICA",
  "IMOLA",
  "HNOS RODRIGUEZ",
  "AUSTIN",
  "LAS VEGAS",
  "INTERLAGOS",
  "REDBULL RING",
  "CANADA",
  "SILVERSTONE",
  "MADRID",
  "BARCELONA",
  "ALBERT PARK",
  "ABU DHABI",
  "HARD ROCK",
  "SUZUKA",
  "NURBURGRING",
  "MARINA BAY",
  "QATAR",
  "JEDDAH",
  "ZANDVOORT",
  "BAKU CITY",
  "HUNGRIA",
  "SAKHIR",
  "SHANGHAI",
  "TOCANCIPA"
];

const F1_TIRE_FINISHES = [
  "Rojo Suave P Zero",
  "Amarillo Medio P Zero",
  "Blanco Duro P Zero"
];

const PISTON_CUP_FINISHES = [
  "Dorado Satinado Metalizado"
];

const PRODUCTS_DATA = [
  {
    id: "WAOU-POLE-F1-20CM",
    name: "POLE F1 20cm",
    category: "f1-motorsport",
    categoryName: "F1 & Motorsport",
    priceCOP: 115000,
    dimensions: "DIÁMETRO: 20 cm | ALTO: 20 cm | PROFUNDIDAD: 10 cm",
    material: "PLA Bio-Polímero Premium",
    image: "Imagenes/polef1.jpg",
    gallery: [
      "Imagenes/polef1.jpg",
      "Imagenes/polef1banner.jpeg",
      "Imagenes/WhatsApp Image 2026-08-31 at 11.50.41 PM.jpg"
    ],
    badge: { type: "limited", text: "ENVÍO INCLUIDO 🇨🇴" },
    featured: true,
    description: "Llanta decorativa inspirada en la Formula 1, viene con su base de exhibición, y el envío a toda Colombia está totalmente incluido.",
    circuits: F1_CIRCUITS_LIST,
    finishes: F1_TIRE_FINISHES
  },
  {
    id: "WAOU-POLE-F1-30CM",
    name: "POLE F1 30cm",
    category: "f1-motorsport",
    categoryName: "F1 & Motorsport",
    priceCOP: 245000,
    dimensions: "DIÁMETRO: 30 cm | ALTO: 30 cm | PROFUNDIDAD: 15 cm",
    material: "PLA Bio-Polímero Premium",
    image: "Imagenes/polef1.jpg",
    gallery: [
      "Imagenes/polef1.jpg",
      "Imagenes/polef1banner.jpeg",
      "Imagenes/WhatsApp Image 2026-08-31 at 11.50.41 PM.jpg"
    ],
    badge: { type: "bestseller", text: "GRAN FORMATO 30CM" },
    featured: true,
    description: "Llanta decorativa de gran formato inspirada en la Formula 1. Presencia imponente de 30 cm de diámetro con base de exhibición pesada. Envío gratis a toda Colombia incluido.",
    circuits: F1_CIRCUITS_LIST,
    finishes: F1_TIRE_FINISHES
  },
  {
    id: "WAOU-COPA-PISTON-21CM",
    name: "Copa Pistón Gde 21CM",
    category: "coleccionables",
    categoryName: "Cars & Coleccionables",
    priceCOP: 70000,
    dimensions: "ANCHO: 24 cm | ALTO: 21 cm | PROFUNDIDAD: 12 cm",
    material: "PLA Bio-Polímero Premium",
    image: "Imagenes/pistoncup.jpg",
    gallery: [
      "Imagenes/pistoncup.jpg"
    ],
    badge: { type: "bestseller", text: "TAMAÑO GRANDE" },
    featured: true,
    description: "Copa Pistón inspirada en la Pelicula de Cars, viene con su base, y el envio esta incluido",
    sizes: [
      { name: "Grande 21 cm (ANCHO: 24 cm | ALTO: 21 cm | PROFUNDIDAD: 12 cm)", priceModifier: 0 },
      { name: "Pequeña 16 cm (ANCHO: 20 cm | ALTO: 16 cm | PROFUNDIDAD: 9 cm)", priceModifier: -15000 }
    ],
    finishes: PISTON_CUP_FINISHES
  },
  {
    id: "WAOU-COPA-PISTON-16CM",
    name: "Copa Pistón peq 16CM",
    category: "coleccionables",
    categoryName: "Cars & Coleccionables",
    priceCOP: 55000,
    dimensions: "ANCHO: 20 cm | ALTO: 16 cm | PROFUNDIDAD: 9 cm",
    material: "PLA Bio-Polímero Premium",
    image: "Imagenes/pistoncup.jpg",
    gallery: [
      "Imagenes/pistoncup.jpg"
    ],
    badge: { type: "new", text: "ENVÍO INCLUIDO 🇨🇴" },
    featured: true,
    description: "Copa Pistón inspirada en la Pelicula de Cars, viene con su base, y el envio esta incluido",
    sizes: [
      { name: "Pequeña 16 cm (ANCHO: 20 cm | ALTO: 16 cm | PROFUNDIDAD: 9 cm)", priceModifier: 0 },
      { name: "Grande 21 cm (ANCHO: 24 cm | ALTO: 21 cm | PROFUNDIDAD: 12 cm)", priceModifier: 15000 }
    ],
    finishes: PISTON_CUP_FINISHES
  }
];

function getProductById(id) {
  return PRODUCTS_DATA.find(p => p.id === id);
}

const CATEGORIES = [
  { id: "all", name: "Todos los Objetos" },
  { id: "f1-motorsport", name: "F1 & Motorsport" },
  { id: "coleccionables", name: "Cars & Coleccionables" }
];
