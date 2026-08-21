/**
 * Products Data Layer — Product catalog data and utilities
 */

interface ProductColor {
  name: string;
  hex: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  details: string[];
  sizes: number[];
  colors: ProductColor[];
  images: string[];
  badge: string | null;
  material: string;
  construction: string;
  origin: string;
}

export const Products: Product[] = [
  {
    id: 'milano-oxford',
    name: 'The Milano Oxford',
    category: 'oxfords',
    price: 1290,
    currency: '₵',
    description: 'Our signature silhouette, reimagined for the discerning collector. Hand-burnished patina leather, leather sole, Goodyear welted construction.',
    details: [
      'Full-grain Italian calfskin leather',
      'Hand-burnished patina finish',
      'Blake stitched construction',
      'Leather sole with rubber heel tip',
      'Made in Florence, Italy'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: 'Dark Brown', hex: '#3d2b1f' },
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Burgundy', hex: '#4a0e0e' }
    ],
    images: [
      '/images/shoescat1.jpeg',
      '/images/shoes1.jpeg',
      '/images/shoes2.jpeg',
      '/images/shoes3.jpeg'
    ],

    badge: 'Signature',
    material: 'Italian Calfskin',
    construction: 'Blake Stitched',
    origin: 'Florence, Italy'
  },
  {
    id: 'roma-loafer',
    name: 'The Roma Loafer',
    category: 'loafers',
    price: 980,
    currency: '₵',
    description: 'Effortless elegance for the modern gentleman. Hand-stitched apron toe, premium suede lining, flexible leather sole.',
    details: [
      'Premium suede or smooth leather',
      'Hand-stitched apron toe',
      'Leather lining for breathability',
      'Flexible leather sole',
      'Made in Florence, Italy'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: 'Tan', hex: '#c9a96e' },
      { name: 'Navy', hex: '#1a1a2e' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    images: [
      '/images/shoescat2.jpeg',
      '/images/shoes4.jpeg',
      '/images/shoes5.jpeg',
      '/images/shoes6.jpeg'
    ],

    badge: null,
    material: 'Suede / Smooth Leather',
    construction: 'Hand-Stitched',
    origin: 'Florence, Italy'
  },
  {
    id: 'napoli-boot',
    name: 'The Napoli Chelsea',
    category: 'boots',
    price: 1450,
    currency: '₵',
    description: 'Commanding presence meets understated refinement. Premium shell cordovan, Goodyear welted, stacked leather heel.',
    details: [
      'Shell cordovan leather',
      'Goodyear welted construction',
      'Stacked leather heel',
      'Leather sole with rubber insert',
      'Made in Florence, Italy'
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: 'Color #8', hex: '#4a0e0e' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    images: [
      '/images/shoescat3.jpeg',
      '/images/shoes7.jpeg',
      '/images/shoes8.jpeg',
      '/images/shoes9.jpeg'
    ],

    badge: 'New Arrival',
    material: 'Shell Cordovan',
    construction: 'Goodyear Welted',
    origin: 'Florence, Italy'
  },
  {
    id: 'firenze-monk',
    name: 'The Firenze Monk',
    category: 'oxfords',
    price: 1180,
    currency: '₵',
    description: 'A study in restraint and precision. Double monk strap, hand-burnished leather, elegant silhouette.',
    details: [
      'Full-grain Italian calfskin',
      'Hand-burnished finish',
      'Double monk strap closure',
      'Leather sole',
      'Made in Florence, Italy'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: 'Cognac', hex: '#8b4513' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    images: [
      '/images/shoescat4.jpeg',
      '/images/shoes10.jpeg',
      '/images/shoes11.jpeg',
      '/images/shoes12.jpeg'
    ],

    badge: null,
    material: 'Italian Calfskin',
    construction: 'Blake Stitched',
    origin: 'Florence, Italy'
  },
  {
    id: 'venezia-slipper',
    name: 'The Venezia Slipper',
    category: 'loafers',
    price: 850,
    currency: '₵',
    description: 'Indoor luxury, refined. Velvet upper, leather sole, hand-finished details.',
    details: [
      'Premium velvet upper',
      'Leather lining',
      'Leather sole',
      'Hand-finished details',
      'Made in Florence, Italy'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: [
      { name: 'Burgundy Velvet', hex: '#4a0e0e' },
      { name: 'Navy Velvet', hex: '#1a1a2e' },
      { name: 'Black Velvet', hex: '#0a0a0a' }
    ],
    images: [
      '/images/shoescat5.jpeg',
      '/images/shoes13.jpeg',
      '/images/shoes14.jpeg',
      '/images/shoes1.jpeg'
    ],

    badge: null,
    material: 'Velvet',
    construction: 'Hand-Finished',
    origin: 'Florence, Italy'
  },
  {
    id: 'torino-derby',
    name: 'The Torino Derby',
    category: 'oxfords',
    price: 1100,
    currency: '₵',
    description: 'Classic open lacing, modern refinement. Hand-stitched detailing, flexible construction.',
    details: [
      'Full-grain Italian leather',
      'Hand-stitched detailing',
      'Open lacing system',
      'Leather sole',
      'Made in Florence, Italy'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: 'Dark Brown', hex: '#3d2b1f' },
      { name: 'Black', hex: '#0a0a0a' }
    ],
    images: [
      '/images/shoescat6.jpeg',
      '/images/shoes2.jpeg',
      '/images/shoes3.jpeg',
      '/images/shoes4.jpeg'
    ],

    badge: null,
    material: 'Italian Leather',
    construction: 'Blake Stitched',
    origin: 'Florence, Italy'
  },
  {
    id: 'milano-captoe',
    name: 'The Milano Cap Toe',
    category: 'oxfords',
    price: 1390,
    currency: '₵',
    description: 'The pinnacle of formal footwear. Hand-burnished cap toe, closed lacing, leather sole.',
    details: [
      'Full-grain Italian calfskin',
      'Hand-burnished cap toe',
      'Closed lacing system',
      'Leather sole with rubber heel',
      'Made in Florence, Italy'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Dark Brown', hex: '#3d2b1f' }
    ],
    images: [
      '/images/shoescat7.jpeg',
      '/images/shoes5.jpeg',
      '/images/shoes6.jpeg',
      '/images/shoes7.jpeg'
    ],

    badge: null,
    material: 'Italian Calfskin',
    construction: 'Blake Stitched',
    origin: 'Florence, Italy'
  },
  {
    id: 'roma-bit-loafer',
    name: 'The Roma Bit Loafer',
    category: 'loafers',
    price: 1150,
    currency: '₵',
    description: 'Hardware meets heritage. Gold bit detail, premium leather, hand-stitched construction.',
    details: [
      'Premium calfskin leather',
      'Gold-tone bit hardware',
      'Hand-stitched apron',
      'Leather sole',
      'Made in Florence, Italy'
    ],
    sizes: [39, 40, 41, 42, 43, 44, 45, 46],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Cognac', hex: '#8b4513' }
    ],
    images: [
      '/images/shoescat8.jpeg',
      '/images/shoes8.jpeg',
      '/images/shoes9.jpeg',
      '/images/shoes10.jpeg'
    ],

    badge: null,
    material: 'Calfskin with Hardware',
    construction: 'Hand-Stitched',
    origin: 'Florence, Italy'
  }
];

export const ProductCategories = [
  { id: 'all', name: 'All' },
  { id: 'oxfords', name: 'Oxfords' },
  { id: 'loafers', name: 'Loafers' },
  { id: 'boots', name: 'Boots' }
];

export function getProductById(id: string) {
  return Products.find(p => p.id === id);
}

export function getProductsByCategory(category: string) {
  if (category === 'all') return Products;
  return Products.filter(p => p.category === category);
}

export function formatPrice(price: number, currency = '₵') {
  return `${currency}${price.toLocaleString()}`;
}

export function getRecentlyViewed(): string[] {
  try {
    const stored = localStorage.getItem('dubee-recently-viewed');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToRecentlyViewed(productId: string) {
  try {
    let recent = getRecentlyViewed();
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    recent = recent.slice(0, 6);
    localStorage.setItem('dubee-recently-viewed', JSON.stringify(recent));
  } catch {
    // localStorage not available
  }
}

export function getRecommendedProducts(productId: string) {
  const product = getProductById(productId);
  if (!product) return [];
  
  return Products
    .filter(p => p.id !== productId)
    .sort((a, b) => {
      const aMatch = a.category === product.category ? 1 : 0;
      const bMatch = b.category === product.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 3);
}
