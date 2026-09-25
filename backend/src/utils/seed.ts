import bcrypt from 'bcryptjs';
import {
  AdminModel,
  PortfolioModel,
  ReelModel,
  ServiceModel,
  PackageModel,
  TestimonialModel,
  SettingsModel,
  BookingModel,
  InquiryModel,
} from '../models/index';
import { dbManager } from '../database/db';

export async function seedDatabase() {
  console.log('[SEED] Starting LEOX database initialization...');

  // 1. Seed Admin
  const existingAdmins = await AdminModel.find();
  const rawPassword = process.env.ADMIN_PASSWORD || 'leoX@4536';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  const adminEmails = [
    (process.env.ADMIN_EMAIL || 'admin@leox').toLowerCase(),
    'admin2@leox',
  ];

  for (const email of adminEmails) {
    const foundAdmin = existingAdmins.find(a => a.email.toLowerCase() === email);
    if (!foundAdmin) {
      await AdminModel.create({
        name: 'LEOX Admin',
        email,
        password: hashedPassword,
        role: 'superadmin',
        lastLogin: new Date().toISOString(),
      });
      console.log(`[SEED] Admin account seeded: ${email}`);
    }
  }

  // 2. Seed Settings
  await SettingsModel.get();

  // 3. Seed Services
  const existingServices = await ServiceModel.find();
  if (existingServices.length === 0) {
    const initialServices = [
      {
        serviceName: 'Cinematic Reels & Short-Form Content',
        slug: 'cinematic-reels-short-form',
        description: 'High-octane, rhythm-synced vertical videos crafted specifically to dominate Instagram feeds. Shot on latest iPhones in 4K HDR with trending music and cinematic grade.',
        startingPrice: '₹1,599',
        duration: 'Same-Day / 24-Hour Turnaround',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Vertical 9:16 Cinematic Reels', 'Audio Sync & Sound Design', 'Same-Day Preview Clips', 'Instagram Optimization'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Event & Celebration Videography',
        slug: 'event-celebration-videography',
        description: 'Complete dynamic coverage for birthdays, anniversaries, corporate parties, and milestones. Fast-paced filming capturing authentic moments.',
        startingPrice: '₹2,999',
        duration: 'Full Event Coverage',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Highlight Reels', 'Full Event Moments', 'Color Graded 4K', 'Rush Turnaround'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Wedding Reels & Cinematic Coverage',
        slug: 'wedding-reels-cinematic-coverage',
        description: 'Emotional, cinematic vertical wedding highlights and celebration coverage crafted for couples who want viral-ready memories on their feeds.',
        startingPrice: '₹4,499',
        duration: 'Multi-Day or Single Event',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Haldi / Sangeet / Muhurtham Reels', 'Cinematic Teaser', 'Same-Day Rush Edit', 'RAW Footage Option'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Brand & Product Content',
        slug: 'brand-product-content',
        description: 'Sleek, product-focused video reels engineered to stop scrollers and convert viewers into customers. Perfect for fashion, cafes, launches, and retail.',
        startingPrice: '₹2,999',
        duration: 'Studio & On-Location',
        image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Macro & Lighting Setup', 'Conversion Hook Cuts', 'Multi-Platform Formats', 'Commercial Usage Rights'],
        featured: true,
        published: true,
      },
      {
        serviceName: 'Personal & Lifestyle Shoots',
        slug: 'personal-lifestyle-shoots',
        description: 'Solo creators, influencers, fitness coaches, and professionals looking for crisp, elevated visual branding and lifestyle portfolio reels.',
        startingPrice: '₹1,599',
        duration: '1 - 2 Hours',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Creative Posing Direction', '2-3 Edited Reels', 'Cinematic Color Tone', 'High-Res Stills'],
        featured: false,
        published: true,
      },
      {
        serviceName: 'Political Event Reels',
        slug: 'political-event-reels',
        description: 'High-energy crowd captures, rally highlights, and speech reels designed for political campaigns and public leader outreach with instant dispatch.',
        startingPrice: '₹3,999',
        duration: 'Live Campaign Coverage',
        image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Crowd & Leader Highlights', 'Rapid 2-Hour Delivery', 'Subtitle & Dialogue Sync', 'High-Impact Audio'],
        featured: false,
        published: true,
      },
      {
        serviceName: 'Car & Bike Delivery Reels',
        slug: 'car-bike-delivery-reels',
        description: 'Capture the thrilling moment of taking delivery of your new automobile. Cinematic rolling shots, ribbon unwrapping, and showroom celebration.',
        startingPrice: '₹1,599',
        duration: 'Showroom Delivery Time',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Rolling & Detail Shots', 'Unveiling Highlight Reel', 'Same-Day Delivery', 'Instagram Audio Sync'],
        featured: false,
        published: true,
      },
      {
        serviceName: 'Photography',
        slug: 'photography',
        description: 'Professional high-resolution digital photography for portraits, events, products, and ceremonies with editorial color grading.',
        startingPrice: '₹1,999',
        duration: 'Session / Event Based',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['High-Resolution Edits', 'Online Cloud Album', 'Color Graded Stills', 'Commercial / Personal Use'],
        featured: false,
        published: true,
      },
      {
        serviceName: 'Other / Custom Requirement',
        slug: 'other-custom-requirement',
        description: 'Have a unique creative concept, multi-city tour, documentary, or custom shoot? We customize crew, equipment, and schedule to your vision.',
        startingPrice: 'Custom Quote',
        duration: 'Custom Project Schedule',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
        deliverables: ['Dedicated Creative Producer', 'Tailored Gear & Crew', 'Custom Deliverables', 'Full Production Support'],
        featured: false,
        published: true,
      },
    ];

    for (const s of initialServices) {
      await ServiceModel.create(s);
    }
    console.log('[SEED] Services initialized.');
  }

  // 4. Seed Packages
  const existingPackages = await PackageModel.find();
  if (existingPackages.length === 0) {
    const initialPackages = [
      {
        packageName: 'LEOX Elite',
        slug: 'leox-elite',
        description: 'Ideal for creators, intimate gatherings, and quick social updates.',
        price: '₹1,599',
        duration: 'Single Session',
        includedServices: [
          '1 Cinematic Reel (9:16 Vertical)',
          'Full High-Definition Export',
          'Professional Color Grading',
          'Fast 24-48h Delivery',
          'Shot on Latest iPhone',
        ],
        featured: false,
        popular: false,
        published: true,
      },
      {
        packageName: 'LEOX Pro',
        slug: 'leox-pro',
        description: 'Perfect for events, celebrations, and personal branding.',
        price: '₹2,999',
        duration: 'Extended Session',
        includedServices: [
          '2 High-Impact Cinematic Reels',
          '4K Ultra HD Export Quality',
          'Sound Design & Audio Mastering',
          'Priority 24h Turnaround',
          'Cover Photo / Thumbnail Included',
        ],
        featured: true,
        popular: true,
        published: true,
      },
      {
        packageName: 'LEOX Pro+',
        slug: 'leox-pro-plus',
        description: 'Our most comprehensive package for weddings and large celebrations.',
        price: '₹4,499',
        duration: 'Half-Day Event Coverage',
        includedServices: [
          '3 Premium Cinematic Reels',
          '4K HDR Master Delivery',
          'Speed Ramping & Visual FX',
          'Same-Day Reel Delivery',
          'Dedicated iPhone Creator Kit',
        ],
        featured: true,
        popular: false,
        published: true,
      },
      {
        packageName: 'LEOX Max',
        slug: 'leox-max',
        description: 'The ultimate VIP coverage for grand milestones and high-profile events.',
        price: '₹5,999',
        duration: 'Full Event Coverage',
        includedServices: [
          '5 Ultra-Cinematic Reels',
          'Raw Footage Archive',
          'Story Teaser Cut included',
          'Dedicated Lead Cinematographer',
          'VIP Same-Day Turnaround',
        ],
        featured: false,
        popular: false,
        published: true,
      },
    ];

    for (const p of initialPackages) {
      await PackageModel.create(p);
    }
    console.log('[SEED] Packages initialized.');
  }

  // 5. Seed Portfolio Projects (with CITY, VENUE, EVENT DATE)
  const existingPortfolio = await PortfolioModel.find();
  if (existingPortfolio.length === 0) {
    const initialPortfolio = [
      {
        title: 'The Royal Grandeur Wedding Gala',
        category: 'Wedding',
        description: 'An ethereal multi-day South Indian wedding celebration featuring royal ivory aesthetics, candlelit mandap styling, and electrifying sangeet choreography.',
        city: 'Vijayawada',
        venue: 'A Convention Centre, MG Road',
        eventDate: '2026-08-18',
        coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop',
        ],
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-ceremony-in-a-forest-43309-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: true,
        published: true,
        clientName: 'Aditya & Ananya',
      },
      {
        title: 'Neon Pulse Festival & EDM Night',
        category: 'Event',
        description: 'High-energy concert cinematography capturing 15,000 partygoers, pyrotechnics, heavy bass drops, and rapid-fire visual edits synchronized to the beat.',
        city: 'Hyderabad',
        venue: 'HITEX Exhibition Center, Hitec City',
        eventDate: '2026-07-24',
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
        ],
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-in-the-air-at-a-music-festival-43310-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: true,
        published: true,
        clientName: 'Submerge Events',
      },
      {
        title: 'Monochrome Luxe Fashion Editorial',
        category: 'Portraits',
        description: 'Bespoke haute-couture fashion portfolio exploring high-contrast rim lighting, stark shadows, and high-fashion architectural silhouettes.',
        city: 'Visakhapatnam',
        venue: 'Bayview Coastal Resort Suites',
        eventDate: '2026-06-30',
        coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
        ],
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        featured: true,
        published: true,
        clientName: 'Vogue Collective',
      },
    ];

    for (const p of initialPortfolio) {
      await PortfolioModel.create(p);
    }
    console.log('[SEED] Portfolio projects initialized.');
  }

  // 6. Seed Vertical Reels (9:16)
  const existingReels = await ReelModel.find();
  if (existingReels.length === 0) {
    const initialReels = [
      {
        title: 'Urban Runway & Night Beats',
        description: 'Dynamic low-light street style reel shot on iPhone with fast cuts and neon atmospheric highlights.',
        eventName: 'Metropolitan Showcase',
        city: 'Hyderabad',
        venue: 'Jubilee Hills Square',
        eventDate: '2026-06-15',
        thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-in-the-air-at-a-music-festival-43310-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        views: '98K',
        featured: true,
        published: true,
        order: 1,
      },
      {
        title: 'Festival Golden Euphoria',
        description: 'Agile handheld mobile capture sweeping through celebration crowds with precision color grading.',
        eventName: 'Sunwaves Open Air',
        city: 'Vijayawada',
        venue: 'Riverfront Arena',
        eventDate: '2026-05-20',
        thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-in-the-air-at-a-music-festival-43310-large.mp4',
        instagramUrl: 'https://www.instagram.com/leox_shoots/',
        views: '112K',
        featured: true,
        published: true,
        order: 2,
      },
    ];

    for (const r of initialReels) {
      await ReelModel.create(r);
    }
    console.log('[SEED] Reels initialized.');
  }

  // 7. Seed Testimonials
  const existingTestimonials = await TestimonialModel.find();
  if (existingTestimonials.length === 0) {
    const initialTestimonials = [
      {
        customerName: 'Rahul & Priya',
        customerRole: 'Client',
        eventType: 'Wedding Reels',
        review: 'LEOX captured our special moments beautifully. The editing was smooth, cinematic, and perfectly matched the mood of our wedding. We loved how every important moment was turned into a memorable reel.',
        rating: 5,
        photo: '',
        published: true,
      },
      {
        customerName: 'Arjun',
        customerRole: 'Client',
        eventType: 'Birthday Celebration',
        review: 'The LEOX team made our birthday celebration look truly special. They were creative, professional, and captured all the best moments. The final reel was stylish, energetic, and better than we expected.',
        rating: 5,
        photo: '',
        published: true,
      },
      {
        customerName: 'Sneha Reddy',
        customerRole: 'Client',
        eventType: 'Brand Promotional Shoot',
        review: 'LEOX understood our brand vision and created content that looked clean, modern, and professional. The video was perfect for Instagram and helped us present our brand in a much better way.',
        rating: 5,
        photo: '',
        published: true,
      },
      {
        customerName: 'Kiran Kumar',
        customerRole: 'Client',
        eventType: 'Bike Delivery Reel',
        review: 'I booked LEOX for my bike delivery video, and the final result was amazing. They captured every important moment and turned it into a cinematic reel. The editing, music, and overall presentation were excellent.',
        rating: 5,
        photo: '',
        published: true,
      },
    ];

    for (const t of initialTestimonials) {
      await TestimonialModel.create(t);
    }
    console.log('[SEED] Testimonials initialized.');
  }

  // 8. Seed sample initial bookings for analytics demonstration
  const existingBookings = await BookingModel.find();
  if (existingBookings.length === 0) {
    const sampleBookings = [
      {
        fullName: 'Kalyan Chakravarthy',
        phone: '+91 98480 22334',
        email: 'kalyan.c@example.com',
        service: 'Event & Celebration Reels',
        package: 'LEOX Pro+',
        eventDate: '2026-09-25',
        city: 'Vijayawada',
        venue: 'A Convention Centre',
        eventDetails: 'Engagement ceremony with 600 attendees, need live reels and cinematic mobile coverage.',
        expectedGuests: '500-1000',
        budgetRange: '₹10,000 - ₹25,000',
        instagramHandle: 'kalyan_c',
        status: 'CONFIRMED' as const,
        internalNotes: 'Advance deposit received. iPhone mobile cinematography creator scheduled.',
      },
      {
        fullName: 'Meghana Rao',
        phone: '+91 99890 55412',
        email: 'meghana.rao@example.com',
        service: 'Instagram Reels & Short-Form Content',
        package: 'LEOX Pro',
        eventDate: '2026-10-02',
        city: 'Hyderabad',
        venue: 'Novotel Convention Centre',
        eventDetails: 'Fashion exhibition showcase and runway walk; need high-energy reels with same-day edits.',
        expectedGuests: '250',
        budgetRange: '₹5,000 - ₹10,000',
        instagramHandle: 'meghana_style',
        status: 'NEW' as const,
        internalNotes: 'Client contacted via Instagram DM previously.',
      },
      {
        fullName: 'Dr. Siddharth Varma',
        phone: '+91 97000 88910',
        email: 'siddharth.varma@example.com',
        service: 'Event & Celebration Reels',
        package: 'LEOX Elite',
        eventDate: '2026-10-15',
        city: 'Visakhapatnam',
        venue: 'The Gateway Hotel Beach Road',
        eventDetails: 'Annual Medical Conclave & Awards Gala dinner highlights.',
        expectedGuests: '300',
        budgetRange: '₹5,000',
        instagramHandle: '',
        status: 'CONTACTED' as const,
        internalNotes: 'Sent quotation and schedule draft.',
      },
    ];

    for (const b of sampleBookings) {
      await BookingModel.create(b);
    }
    console.log('[SEED] Initial sample bookings initialized.');
  }

  dbManager.save();
  console.log('[SEED] Database initialization complete.');
}

// Run standalone if called directly
if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase().then(() => {
    console.log('[SEED] Completed successfully.');
    process.exit(0);
  }).catch(err => {
    console.error('[SEED] Error:', err);
    process.exit(1);
  });
}
