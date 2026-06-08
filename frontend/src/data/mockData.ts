export interface Accommodation {
  id: string;
  title: string;
  type: 'PG' | 'Hostel' | 'Flat';
  price: number; // monthly
  deposit: number;
  distance: number; // km from main campus
  safetyScore: number; // out of 100
  verified: boolean;
  images: string[];
  features: string[];
  landlord: {
    name: string;
    phone: string;
    verifiedSince: string;
    responseRate: string;
  };
  address: string;
  amenities: string[];
  proofProvided: ('Photo Proof' | 'Video Walkthrough' | 'Deed Verified')[];
  reviewsCount: number;
  rating: number;
}

export interface RoommateCandidate {
  id: string;
  name: string;
  avatar: string;
  major: string;
  year: string;
  compatibilityScore: number; // percentage
  lifestyleParams: {
    sleepSchedule: 'Early Bird' | 'Night Owl' | 'Flexible';
    cleanliness: 'Neat Freak' | 'Moderate' | 'Relaxed';
    studyHabits: 'Absolute Silence' | 'Background Music' | 'Library Goer';
    diet: 'Vegetarian' | 'Non-Veg' | 'Vegan' | 'Anything';
    smoking: 'Strictly No' | 'Outside Only' | 'Yes';
    guests: 'Rarely' | 'Weekends' | 'Frequent';
    sharing: 'Everything' | 'Ask First' | 'Strictly Separate';
    acTemperature: string;
    musicTaste: string;
    cooking: 'Daily' | 'Occasionally' | 'Never';
    pets: 'Loves Pets' | 'No Pets' | 'Allergic';
  };
  bio: string;
  preferredBudget: number;
  lookingFor: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'Rent' | 'Groceries' | 'Utilities' | 'Dining Out' | 'Transport' | 'Study Material';
  paidBy: string;
  date: string;
  splitAmong: string[];
  status: 'Settled' | 'Pending';
}

export interface CommunityPost {
  id: string;
  author: string;
  role: string; // 'Senior', 'Sophomore', 'Alumni'
  avatar: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  repliesCount: number;
  timeAgo: string;
}

export interface SpringBootEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  samplePayload?: string;
  sampleResponse: string;
}

export const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'acc-1',
    title: 'Prestige Heights Luxury Premium PG',
    type: 'PG',
    price: 12500,
    deposit: 25000,
    distance: 0.4,
    safetyScore: 98,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80'
    ],
    features: ['Zero Brokerage', 'Biometric Entry', 'CCTV 24/7', 'High-Speed WiFi'],
    landlord: {
      name: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      verifiedSince: '2022',
      responseRate: '99% (Under 10 mins)'
    },
    address: 'Plot 42, Knowledge Park Avenue, Gate 2',
    amenities: ['AC Rooms', 'Attached Washroom', '3 Meals Included', 'Power Backup', 'Washing Machine'],
    proofProvided: ['Photo Proof', 'Video Walkthrough', 'Deed Verified'],
    reviewsCount: 48,
    rating: 4.8
  },
  {
    id: 'acc-2',
    title: 'Scholar Nest Co-ed Student Hostel',
    type: 'Hostel',
    price: 8500,
    deposit: 10000,
    distance: 1.2,
    safetyScore: 94,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80'
    ],
    features: ['Zero Brokerage', 'Security Guards', 'Common Study Lounge'],
    landlord: {
      name: 'Priya Mehra',
      phone: '+91 99112 23344',
      verifiedSince: '2023',
      responseRate: '95%'
    },
    address: 'Lane 3, University Road, Opposite Metro Station',
    amenities: ['Non-AC', 'Common Washroom', '2 Meals Included', 'Gymnasium', 'Library Access'],
    proofProvided: ['Photo Proof', 'Deed Verified'],
    reviewsCount: 32,
    rating: 4.5
  },
  {
    id: 'acc-3',
    title: 'GreenView 3BHK Premium Flat Share',
    type: 'Flat',
    price: 16000,
    deposit: 32000,
    distance: 2.0,
    safetyScore: 91,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80'
    ],
    features: ['Direct Owner Contact', 'Gated Society', 'Fully Furnished Kitchen'],
    landlord: {
      name: 'Amitabh Verma',
      phone: '+91 98100 55667',
      verifiedSince: '2021',
      responseRate: '92%'
    },
    address: 'Apt 402, Tower B, Greenwoods Society',
    amenities: ['AC', 'Modular Kitchen', 'Balcony', 'Reserved Parking', 'Smart TV'],
    proofProvided: ['Photo Proof', 'Video Walkthrough'],
    reviewsCount: 19,
    rating: 4.7
  },
  {
    id: 'acc-4',
    title: 'NestPro Solo Executive Living Studios',
    type: 'Flat',
    price: 21000,
    deposit: 40000,
    distance: 0.8,
    safetyScore: 99,
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80'
    ],
    features: ['Premium Safety Score', 'Keyless PIN Code Lock', 'Zero Brokerage'],
    landlord: {
      name: 'Sunita Reddy',
      phone: '+91 98450 11223',
      verifiedSince: '2020',
      responseRate: '100%'
    },
    address: 'Platinum Enclave, 4th Cross, Tech Hub Blvd',
    amenities: ['AC', 'Private Kitchenette', 'Housekeeping Service', 'Gigabit Internet'],
    proofProvided: ['Photo Proof', 'Video Walkthrough', 'Deed Verified'],
    reviewsCount: 65,
    rating: 4.9
  }
];

export const INITIAL_ROOMMATES: RoommateCandidate[] = [
  {
    id: 'rm-1',
    name: 'Aarav Mehta',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    major: 'Computer Science',
    year: 'Sophomore',
    compatibilityScore: 96,
    lifestyleParams: {
      sleepSchedule: 'Night Owl',
      cleanliness: 'Neat Freak',
      studyHabits: 'Absolute Silence',
      diet: 'Vegetarian',
      smoking: 'Strictly No',
      guests: 'Rarely',
      sharing: 'Ask First',
      acTemperature: '22°C',
      musicTaste: 'Indie Rock / Lo-Fi',
      cooking: 'Occasionally',
      pets: 'Loves Pets'
    },
    bio: 'Coding till 3 AM but keep my desk spotless. Looking for someone who doesn\'t mind double monitors and quiet focus hours. Let\'s split a 2BHK flat near Gate 2!',
    preferredBudget: 13000,
    lookingFor: '2BHK shared with one more student'
  },
  {
    id: 'rm-2',
    name: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    major: 'Economics & Finance',
    year: 'Junior',
    compatibilityScore: 91,
    lifestyleParams: {
      sleepSchedule: 'Early Bird',
      cleanliness: 'Moderate',
      studyHabits: 'Background Music',
      diet: 'Vegan',
      smoking: 'Strictly No',
      guests: 'Weekends',
      sharing: 'Everything',
      acTemperature: '24°C',
      musicTaste: 'Acoustic / Classical',
      cooking: 'Daily',
      pets: 'No Pets'
    },
    bio: 'Love meal-prepping on Sundays and morning jogging. Highly respectful of personal boundaries but would love a roommate who doubles as a good coffee companion.',
    preferredBudget: 15000,
    lookingFor: 'Premium PG share or spacious apartment'
  },
  {
    id: 'rm-3',
    name: 'Kabir Sen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    major: 'Mechanical Engineering',
    year: 'Senior',
    compatibilityScore: 84,
    lifestyleParams: {
      sleepSchedule: 'Flexible',
      cleanliness: 'Relaxed',
      studyHabits: 'Library Goer',
      diet: 'Non-Veg',
      smoking: 'Outside Only',
      guests: 'Frequent',
      sharing: 'Everything',
      acTemperature: '20°C',
      musicTaste: 'EDM / Hip Hop',
      cooking: 'Never',
      pets: 'Loves Pets'
    },
    bio: 'Mostly out at campus clubs or labs. Super easygoing, have a PlayStation 5 that anyone can use. Let\'s rent a place with zero landlord interference.',
    preferredBudget: 11000,
    lookingFor: 'Spacious flat with friendly roommates'
  },
  {
    id: 'rm-4',
    name: 'Rhea Iyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    major: 'Architecture',
    year: 'Sophomore',
    compatibilityScore: 88,
    lifestyleParams: {
      sleepSchedule: 'Night Owl',
      cleanliness: 'Neat Freak',
      studyHabits: 'Background Music',
      diet: 'Vegetarian',
      smoking: 'Strictly No',
      guests: 'Rarely',
      sharing: 'Ask First',
      acTemperature: '23°C',
      musicTaste: 'Jazz / Soft Pop',
      cooking: 'Occasionally',
      pets: 'Loves Pets'
    },
    bio: 'Architectural drafting takes space, so I like well-lit clean rooms. Big fan of clean living and collaborative study vibes.',
    preferredBudget: 14000,
    lookingFor: 'Shared PG or Flat near the Design building'
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Monthly High-Speed WiFi Fiber',
    amount: 1200,
    category: 'Utilities',
    paidBy: 'You',
    date: '2026-03-01',
    splitAmong: ['You', 'Aarav Mehta', 'Kabir Sen'],
    status: 'Settled'
  },
  {
    id: 'exp-2',
    title: 'Supermarket Groceries & Snacks',
    amount: 3450,
    category: 'Groceries',
    paidBy: 'Aarav Mehta',
    date: '2026-03-04',
    splitAmong: ['You', 'Aarav Mehta'],
    status: 'Pending'
  },
  {
    id: 'exp-3',
    title: 'Advanced Electricity Prepayment',
    amount: 2800,
    category: 'Utilities',
    paidBy: 'Kabir Sen',
    date: '2026-03-05',
    splitAmong: ['You', 'Aarav Mehta', 'Kabir Sen'],
    status: 'Pending'
  },
  {
    id: 'exp-4',
    title: 'Emergency Tap Repair & Maintenance',
    amount: 600,
    category: 'Rent',
    paidBy: 'You',
    date: '2026-03-08',
    splitAmong: ['You', 'Aarav Mehta', 'Kabir Sen'],
    status: 'Settled'
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Vikram R.',
    role: 'Senior Verified Guide',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: '🚨 BEWARE: Fake Broker Scam on University Road',
    content: 'Guys, if anyone asks for an advance token deposit via QR code before showing the flat, DO NOT pay! CampusNest verified listings bypass brokers entirely. Stick to the blue badge landlords only.',
    tags: ['Safety Alert', 'Zero Brokerage', 'Scam Warning'],
    upvotes: 142,
    repliesCount: 23,
    timeAgo: '2 hours ago'
  },
  {
    id: 'post-2',
    author: 'Shruti K.',
    role: 'Alumni Mentor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: '💡 Hacks for Negotiating PG Security Deposits',
    content: 'Landlords usually ask for 2 months advance. Since CampusNest provides verified student background checks and automated rent collection, show them your CampusNest Trust Score! I got my deposit reduced by 40%.',
    tags: ['Financial Hack', 'Deposits', 'Trust Score'],
    upvotes: 98,
    repliesCount: 15,
    timeAgo: '1 day ago'
  },
  {
    id: 'post-3',
    author: 'Nikhil P.',
    role: 'Sophomore',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    title: 'Looking for a fourth roommate for GreenView society ASAP',
    content: 'We already secured a flat via CampusNest direct landlord contact. Need one more person who likes strict cleanliness and plays badminton. Rent is 4k per head. DM via AI Roommate tool!',
    tags: ['Roommate Request', 'Flatmates', 'Immediate Move-In'],
    upvotes: 56,
    repliesCount: 31,
    timeAgo: '3 days ago'
  }
];

export const SPRING_BOOT_ENDPOINTS: SpringBootEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/accommodations?verified=true&maxDistance=2.5',
    description: 'Retrieves all Neon Cloud PostgreSQL backed verified housing listings with safety score filters.',
    sampleResponse: `[
  {
    "id": "acc-1",
    "title": "Prestige Heights Luxury Premium PG",
    "price": 12500,
    "safetyScore": 98,
    "verified": true,
    "brokerage": 0.00,
    "landlordName": "Rajesh Sharma",
    "neonDbId": "uuid-pg-neon-9921"
  }
]`
  },
  {
    method: 'POST',
    path: '/api/v1/roommates/match',
    description: 'Executes the AI Compatibility weighted algorithm over 20+ lifestyle parameters stored in Neon Cloud Postgres arrays.',
    samplePayload: `{
  "studentId": "usr-current-101",
  "lifestyleWeights": {
    "sleepScheduleImportance": 0.95,
    "cleanlinessImportance": 0.88,
    "smokingIntolerance": 1.0
  }
}`,
    sampleResponse: `{
  "status": "SUCCESS",
  "matchesFound": 4,
  "topCandidateId": "rm-1",
  "matchScore": 0.96,
  "neonQueryExecutionMs": 14
}`
  },
  {
    method: 'POST',
    path: '/api/v1/expenses/split',
    description: 'Inserts shared expenses into Neon Cloud Postgres transaction table and triggers push alerts.',
    samplePayload: `{
  "title": "Supermarket Groceries",
  "amount": 3450.00,
  "paidById": "usr-aarav",
  "splitType": "EQUAL",
  "participants": ["usr-you", "usr-aarav"]
}`,
    sampleResponse: `{
  "transactionId": "txn-neon-7749",
  "status": "RECORDED",
  "autoAlertSentToParents": true,
  "ledgerBalanceUpdated": true
}`
  },
  {
    method: 'GET',
    path: '/api/v1/safety/sos/trigger',
    description: 'Dispatches emergency signals to verified contacts, parent dashboard webhook, and local security grid.',
    sampleResponse: `{
  "status": "ALERT_ACTIVE",
  "timestamp": "2026-03-09T14:32:10Z",
  "escalatedToParentDashboard": true,
  "landlordNotified": true
}`
  }
];

export const NEON_PROPERTIES_SAMPLE = `# CampusNest Spring Boot Application Configuration for Neon Cloud PostgreSQL
spring.datasource.url=jdbc:postgresql://ep-curly-waterfall-a5qw81x2-pooler.us-east-2.aws.neon.tech/campusnest_prod?sslmode=require
spring.datasource.username=campusnest_db_admin
spring.datasource.password=********[HIDDEN_SECURE_TOKEN]********
spring.datasource.driver-class-name=org.postgresql.Driver

# Connection Pooling optimized for high-traffic student marketplace
spring.datasource.hikari.maximum-pool-size=15
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000

# JPA / Hibernate setup
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Custom Application settings
app.security.broker-bypass.enabled=true
app.ai.matching.parameters-count=22
app.neon-metrics.auto-publish=true
`;
