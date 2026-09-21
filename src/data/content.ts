export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Profile', href: '#profile' },
  { label: 'Products', href: '#products' },
  { label: 'Gallery', href: '#riders' },
  { label: 'Contact Us', href: '#contact' },
]

export type Product = {
  id: string
  shortName: string
  name: string
  grade: string
  tagline: string
  intro: string
  image: string
  imageAlt: string
  heroImage: string
  techImage: string
  category: string
  headline: [string, string]
  eyebrow: string
  callouts: [{ title: string; desc: string }, { title: string; desc: string }]
  ratingLabel: string
  features: string[]
  standards: string[]
  specs: { label: string; value: string; desc: string }[]
  table: [string, string][]
}

export const PRODUCTS: Product[] = [
  {
    id: '10w40',
    shortName: '10W-40 SN',
    name: 'PureLube Platinum Fully Synthetic 10W-40 SN',
    grade: '10W-40',
    tagline: 'For all kinds of modern bikes',
    category: 'Motorcycle',
    image: '/img/story-can.png',
    imageAlt: 'PureLube Platinum Fully Synthetic 10W-40 SN',
    heroImage: '/img/hero-can.png',
    techImage: '/img/tech-can.png',
    headline: ['Feel Its Power', 'On Every Ride'],
    eyebrow: 'German Technology, Russian Formulation',
    ratingLabel: 'Rider Rating',
    callouts: [
      {
        title: 'Fully Synthetic',
        desc: 'Synthetic hydro-treated paraffinic base oils with advanced additives for modern bikes.',
      },
      {
        title: 'High Mileage',
        desc: 'Exceptional resistance to thermal viscosity breakdown under severe driving conditions.',
      },
    ],
    intro:
      'PureLube Platinum Fully Synthetic 10W-40 SN is a multi-grade high mileage engine oil engineered for ultimate performance and designed to provide outstanding engine protection and performance for all kinds of modern bikes. It is formulated with synthetic, hydro-treated, paraffinic base oils and a technologically advanced additive system to deliver exceptional resistance to thermal viscosity breakdown, outstanding low temperature fluidity, and resist engine component wear and deposit formation under severe driving conditions.',
    features: [
      'Reduced friction for excellent protection against engine wear',
      'Highly resistant to viscosity and thermal breakdown',
      'Reduced internal engine friction for improved fuel economy',
      'Reduces combustion blow-by and oil leakage',
      'API SN · JASO MA & MA2',
      'SAE 10W-40 Fully Synthetic',
      'For all kinds of modern bikes',
    ],
    standards: ['API SN', 'JASO MA & MA2'],
    specs: [
      {
        label: 'SAE Grade',
        value: '10W-40',
        desc: 'Multi-grade high mileage oil with outstanding low temperature fluidity',
      },
      {
        label: 'API Rating',
        value: 'API SN',
        desc: 'Meets or exceeds API SN and JASO MA & MA2',
      },
      {
        label: 'Base Oil',
        value: 'Synthetic',
        desc: 'Hydro-treated paraffinic base oils with advanced additives',
      },
    ],
    table: [
      ['Product', 'PureLube Platinum Fully Synthetic'],
      ['Type', 'Multi-Grade High Mileage Engine Oil'],
      ['SAE Grade', '10W-40'],
      ['API Rating', 'SN'],
      ['JASO', 'MA & MA2'],
      ['Base Oil', 'Synthetic · Hydro-treated · Paraffinic'],
      ['Application', 'All kinds of modern bikes'],
      ['Origin', 'Made in Germany'],
    ],
  },
  {
    id: '5w40',
    shortName: '5W-40 SP/CK-4',
    name: 'PureLube Platinum Fully Synthetic 5W-40 SP/CK-4',
    grade: '5W-40',
    tagline: 'For gasoline & diesel engines',
    category: 'Automotive',
    image: '/img/story-bottle.png',
    imageAlt: 'PureLube Platinum Fully Synthetic 5W-40 SP/CK-4 gold bottle',
    heroImage: '/img/hero-bottle.png',
    techImage: '/img/tech-bottle.png',
    headline: ['Ultimate Power', 'For Every Drive'],
    eyebrow: 'German Technology, Russian Formulation',
    ratingLabel: 'Driver Rating',
    callouts: [
      {
        title: 'Gasoline & Diesel',
        desc: 'Shear-stable crankcase oil for cars, vans and light trucks of almost all markets.',
      },
      {
        title: '10,000 KM',
        desc: 'Excellent wear control, fuel economy and cold-start pumpability.',
      },
    ],
    intro:
      'PureLube Platinum Fully Synthetic 5W-40 SP/CK-4 multi-grade motor oils are superior quality, all-season high performance products formulated from high quality synthetic base fluids and high-speed circuit proven additives technology meeting and exceeding API & SAE specifications. It is a highly shear stable automotive crankcase oil formulated for use in gasoline and diesel powered cars, vans and light trucks of almost all markets. It provides excellent control over engine wear and soot build-up and protects against rust and corrosion. Recommended for supercharged and naturally aspirated gasoline and diesel engines.',
    features: [
      'Formulated to protect emissions control system catalysts',
      'Advanced varnish and sludge protection to keep the engine clean',
      'Excellent fuel economy',
      'Good low temperature pumpability for cold starts',
      'Enhanced After Treatment Devices (ATD) protection',
      'Enhanced seal protection to reduce oil leakage',
      'Mileage 10,000 KM · Made in Germany',
    ],
    standards: [
      'API SP / CK-4',
      'ACEA A3 / B4',
      'BMW Long Life-01',
      'MB-Approval 226.5 / 229.3 / 229.5',
      'Porsche A40',
      'Renault RN 0700 / RN 0710',
      'VW 502.00 / 505.00',
    ],
    specs: [
      {
        label: 'SAE Grade',
        value: '5W-40',
        desc: 'All-season multi-grade for gasoline and diesel engines',
      },
      {
        label: 'API Rating',
        value: 'SP / CK-4',
        desc: 'Meets and exceeds API SP / CK-4 and ACEA A3 / B4',
      },
      {
        label: 'Mileage',
        value: '10,000 KM',
        desc: 'High mileage protection with shear-stable formula',
      },
    ],
    table: [
      ['Product', 'PureLube Platinum Fully Synthetic'],
      ['Type', 'Multi-Grade Motor Oil · Gasoline & Diesel'],
      ['SAE Grade', '5W-40'],
      ['API Rating', 'SP / CK-4'],
      ['ACEA', 'A3 / B4'],
      ['OEM Approvals', 'BMW LL-01 · MB · Porsche A40 · Renault · VW'],
      ['Application', 'Cars, vans & light trucks'],
      ['Origin', 'Made in Germany'],
    ],
  },
]

/** Legacy aliases used by simpler sections (defaults to bike oil) */
export const PRODUCT_NAME = PRODUCTS[0].name
export const PRODUCT_INTRO = PRODUCTS[0].intro
export const FEATURES = PRODUCTS[0].features
export const PERFORMANCE_STANDARDS = PRODUCTS[0].standards
export const SPECS = PRODUCTS[0].specs
export const SPEC_TABLE = PRODUCTS[0].table

export const TESTIMONIALS = [
  {
    name: 'David W.',
    role: 'CRF Trail Rider',
    image: '/img/rider-portrait.png',
    quote:
      '“PureLube Platinum keeps my CRF running cool on long trail days. Shifts feel lighter and the engine stays quiet even after hours of hard riding.”',
  },
  {
    name: 'Maria S.',
    role: 'Daily Scooter Commuter',
    image: '/img/rider-portrait-2.png',
    quote:
      '“Outstanding low temperature fluidity — my scooter starts smooth every morning. High mileage protection I can actually feel.”',
  },
  {
    name: 'Ramon T.',
    role: 'Fleet Driver',
    image: '/img/rider-portrait-3.png',
    quote:
      '“I run PureLube Platinum 5W-40 SP/CK-4 in my diesel van. Cold starts are smooth and oil consumption stayed low past 10,000 km.”',
  },
]

export const RIDES = [
  {
    src: '/img/ride-scooter.png',
    tag: 'Scooter',
    caption: 'Daily commuting, cool and clean',
  },
  {
    src: '/img/ride-crf.png',
    tag: 'CRF / Off-Road',
    caption: 'High-rev protection on every trail',
  },
  {
    src: '/img/ride-bigbike.png',
    tag: 'Big Bikes',
    caption: 'Stable at highway speed, tour after tour',
  },
  {
    src: '/img/ride-auto.png',
    tag: 'Cars & Light Trucks',
    caption: 'Gasoline & diesel · Platinum 5W-40',
  },
]

/** Featured brand / facility films used across the site */
export const FILMS = [
  {
    id: 'brand',
    title: 'PureLube Brand Film',
    subtitle: 'German Technology · Motion Identity',
    src: '/video/purelube-brand.mp4',
    poster: '/video/purelube-brand-poster.jpg',
  },
  {
    id: 'factory',
    title: 'Precision Filling Line',
    subtitle: 'Platinum production · Made in Germany',
    src: '/video/purelube-factory.mp4',
    poster: '/video/purelube-factory-poster.jpg',
  },
] as const
