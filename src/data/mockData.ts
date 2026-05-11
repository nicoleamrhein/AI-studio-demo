export interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  tags: string[];
}

export interface Interest {
  id: string;
  label: string;
  color: string;
  brands: Brand[];
}

export const MOCK_DATA: Interest[] = [
  {
    id: 'sustainability',
    label: 'Sustainability',
    color: '#4ade80', // green-400
    brands: [
      {
        id: 'patagonia',
        name: 'Patagonia',
        description: 'Outdoor clothing and gear for the silent sports: climbing, surfing, skiing and snowboarding, fly fishing, and trail running.',
        logo: 'P',
        website: 'https://www.patagonia.com',
        tags: ['Outdoor', 'Eco-friendly', 'B-Corp']
      },
      {
        id: 'allbirds',
        name: 'Allbirds',
        description: 'Sustainable shoes and clothing made from natural materials like merino wool and eucalyptus tree fiber.',
        logo: 'A',
        website: 'https://www.allbirds.com',
        tags: ['Footwear', 'Natural Materials']
      },
      {
        id: 'veja',
        name: 'Veja',
        description: 'French footwear and accessories brand that creates sneakers using organic cotton, wild rubber from the Amazon, and recycled plastic bottles.',
        logo: 'V',
        website: 'https://www.veja-store.com',
        tags: ['Footwear', 'Fair Trade']
      }
    ]
  },
  {
    id: 'vintage',
    label: 'Vintage Fashion',
    color: '#fbbf24', // amber-400
    brands: [
      {
        id: 'realreal',
        name: 'The RealReal',
        description: 'The world\'s largest online marketplace for authenticated, resale luxury goods.',
        logo: 'R',
        website: 'https://www.therealreal.com',
        tags: ['Luxury', 'Resale']
      },
      {
        id: 'depop',
        name: 'Depop',
        description: 'The fashion marketplace where the next generation buy, sell and get inspired.',
        logo: 'D',
        website: 'https://www.depop.com',
        tags: ['Community', 'Peer-to-peer']
      }
    ]
  },
  {
    id: 'minimal',
    label: 'Minimal Style',
    color: '#94a3b8', // slate-400
    brands: [
      {
        id: 'everlane',
        name: 'Everlane',
        description: 'Modern basics. Radical transparency. High-quality clothing at the best factories.',
        logo: 'E',
        website: 'https://www.everlane.com',
        tags: ['Basics', 'Transparency']
      },
      {
        id: 'cos',
        name: 'COS',
        description: 'Modern, functional, considered design. Reinvented classics and wardrobe essentials.',
        logo: 'C',
        website: 'https://www.cos.com',
        tags: ['Modern', 'Functional']
      }
    ]
  },
  {
    id: 'streetwear',
    label: 'Streetwear',
    color: '#f87171', // red-400
    brands: [
      {
        id: 'stussy',
        name: 'Stüssy',
        description: 'A fashion brand started in the early 1980s by Shawn Stussy. The company is one of many that benefited from the surfwear trend.',
        logo: 'S',
        website: 'https://www.stussy.com',
        tags: ['Surf', 'Skate', 'Iconic']
      },
      {
        id: 'aime',
        name: 'Aimé Leon Dore',
        description: 'Fashion and lifestyle brand based in Queens, New York. Focus on simple yet powerful design.',
        logo: 'A',
        website: 'https://www.aimeleondore.com',
        tags: ['NYC', 'Lifestyle']
      }
    ]
  },
  {
    id: 'celebrity',
    label: 'Celebrity Inspiration',
    color: '#c084fc', // purple-400
    brands: [
      {
        id: 'skims',
        name: 'SKIMS',
        description: 'A solutions-oriented brand creating the next generation of underwear, loungewear and shapewear.',
        logo: 'S',
        website: 'https://www.skims.com',
        tags: ['Shapewear', 'Inclusive']
      },
      {
        id: 'rhode',
        name: 'Rhode',
        description: 'Skincare by Hailey Rhode Bieber. Simple, effective, and curated.',
        logo: 'R',
        website: 'https://www.rhodeskin.com',
        tags: ['Skincare', 'Curated']
      }
    ]
  },
  {
    id: 'tech',
    label: 'Tech Wear',
    color: '#38bdf8', // sky-400
    brands: [
      {
        id: 'acronym',
        name: 'Acronym',
        description: 'High-performance technical apparel with a focus on functional design and innovative materials.',
        logo: 'A',
        website: 'https://acrnm.com',
        tags: ['Technical', 'Performance']
      },
      {
        id: 'arcteryx',
        name: 'Arc\'teryx',
        description: 'Design-driven outdoor equipment and clothing company known for its technical innovations.',
        logo: 'A',
        website: 'https://arcteryx.com',
        tags: ['Outdoor', 'Technical']
      }
    ]
  },
  {
    id: 'luxury',
    label: 'Quiet Luxury',
    color: '#a8a29e', // stone-400
    brands: [
      {
        id: 'loro',
        name: 'Loro Piana',
        description: 'Italian clothing company specialising in high-end, luxury cashmere and wool products.',
        logo: 'L',
        website: 'https://www.loropiana.com',
        tags: ['Luxury', 'Cashmere']
      },
      {
        id: 'brunello',
        name: 'Brunello Cucinelli',
        description: 'Italian luxury fashion brand which sells menswear, women\'s wear and accessories.',
        logo: 'B',
        website: 'https://www.brunellocucinelli.com',
        tags: ['Luxury', 'Craftsmanship']
      }
    ]
  },
  {
    id: 'active',
    label: 'Active Lifestyle',
    color: '#f472b6', // pink-400
    brands: [
      {
        id: 'lululemon',
        name: 'Lululemon',
        description: 'Technical athletic apparel for yoga, running, training and most other sweaty pursuits.',
        logo: 'L',
        website: 'https://www.lululemon.com',
        tags: ['Athletic', 'Yoga']
      },
      {
        id: 'alo',
        name: 'Alo Yoga',
        description: 'Yoga clothing and activewear designed to take you from the studio to the street.',
        logo: 'A',
        website: 'https://www.aloyoga.com',
        tags: ['Yoga', 'Lifestyle']
      }
    ]
  }
];
