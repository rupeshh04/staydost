/**
 * StayDost — Database Seeder
 * Run: npm run seed
 *
 * Creates:
 *  - 1 Admin account
 *  - 1 Owner account
 *  - 15 sample properties (PGs & Flats across Delhi NCR)
 *  - 5 sample leads
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');
const Lead = require('../models/Lead');

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
];

const seed = async () => {
  await connectDB();

  console.log('🧹 Clearing existing data...');
  await User.deleteMany({});
  await Property.deleteMany({});
  await Lead.deleteMany({});

  // ── Users ────────────────────────────────────────────────────────────────
  console.log('👤 Creating users...');

  const admin = await User.create({
    name: 'StayDost Admin',
    email: 'admin@staydost.com',
    password: 'admin123',
    phone: '+91 98765 43210',
    role: 'admin',
  });

  const owner = await User.create({
    name: 'Rajesh Kumar',
    email: 'owner@staydost.com',
    password: 'owner123',
    phone: '+91 91234 56789',
    role: 'owner',
  });

  // ── Properties ────────────────────────────────────────────────────────────
  console.log('🏠 Creating properties...');

  const properties = await Property.insertMany([
    {
      title: 'Spacious PG for Boys near Metro',
      type: 'PG',
      location: 'Laxmi Nagar',
      area: 'Near Laxmi Nagar Metro Station',
      city: 'Delhi',
      price: 7500,
      description: 'Well-furnished PG with all modern amenities. Walking distance from Laxmi Nagar metro station. 24/7 security and power backup. Home-cooked food available. Ideal for working professionals and students.',
      amenities: ['WiFi', 'Food', 'Furnished', 'Security', 'Power Backup', 'CCTV'],
      images: [PROPERTY_IMAGES[0], PROPERTY_IMAGES[1]],
      gender: 'Male',
      occupancy: 'Double',
      ownerName: 'Rajesh Kumar',
      ownerPhone: '+91 91234 56789',
      ownerEmail: 'rajesh@example.com',
      owner_id: owner._id,
      status: 'approved',
      featured: true,
    },
    {
      title: 'Cozy 1BHK Flat for Working Professionals',
      type: 'Flat',
      location: 'Mukherjee Nagar',
      area: 'Near Delhi University',
      city: 'Delhi',
      price: 14000,
      description: 'Beautiful 1BHK flat fully furnished with modern kitchen. Perfect for couples or single working professionals. Close to Delhi University and multiple markets.',
      amenities: ['WiFi', 'Furnished', 'AC', 'Parking', 'Security'],
      images: [PROPERTY_IMAGES[2], PROPERTY_IMAGES[3]],
      gender: 'Any',
      occupancy: 'Single',
      ownerName: 'Priya Sharma',
      ownerPhone: '+91 98765 12345',
      ownerEmail: 'priya@example.com',
      status: 'approved',
      featured: true,
    },
    {
      title: 'Girls PG with Home Food near Karol Bagh',
      type: 'PG',
      location: 'Karol Bagh',
      area: 'Near Arya Samaj Road',
      city: 'Delhi',
      price: 9000,
      description: 'Safe and secure girls-only PG. Healthy home-cooked meals 3 times a day. CCTV surveillance and biometric entry. Walking distance from Karol Bagh market and metro.',
      amenities: ['Food', 'WiFi', 'CCTV', 'Security', 'Laundry', 'Attached Bathroom'],
      images: [PROPERTY_IMAGES[4], PROPERTY_IMAGES[0]],
      gender: 'Female',
      occupancy: 'Single',
      status: 'approved',
      featured: false,
    },
    {
      title: 'Affordable 2BHK near AIIMS',
      type: 'Flat',
      location: 'Safdarjung',
      area: 'Near AIIMS Metro',
      city: 'Delhi',
      price: 22000,
      description: '2BHK unfurnished flat in a prime location near AIIMS hospital. Excellent connectivity, close to top hospitals and medical institutions. Suitable for doctors and medical students.',
      amenities: ['Parking', 'Security', 'Water Supply', 'Power Backup'],
      images: [PROPERTY_IMAGES[5], PROPERTY_IMAGES[2]],
      gender: 'Any',
      occupancy: 'Any',
      status: 'approved',
    },
    {
      title: 'Premium AC PG for IT Professionals',
      type: 'PG',
      location: 'Noida Sector 62',
      area: 'Near HCL Technologies',
      city: 'Noida',
      price: 12000,
      description: 'Premium fully furnished PG for IT professionals. High-speed fiber WiFi, AC in every room. Gym and recreation room available. Walking distance from major IT offices.',
      amenities: ['WiFi', 'AC', 'Furnished', 'Gym', 'Laundry', 'Power Backup', 'Parking'],
      images: [PROPERTY_IMAGES[1], PROPERTY_IMAGES[3]],
      gender: 'Male',
      occupancy: 'Single',
      status: 'approved',
      featured: true,
    },
    {
      title: 'Furnished Studio Flat in Dwarka',
      type: 'Flat',
      location: 'Dwarka Sector 10',
      area: 'Near Dwarka Sector 10 Metro',
      city: 'Delhi',
      price: 16000,
      description: 'Brand new studio apartment with modular kitchen and attached bathroom. Fully furnished with TV, refrigerator, washing machine. Peaceful residential area.',
      amenities: ['Furnished', 'AC', 'WiFi', 'Water Supply', 'Security'],
      images: [PROPERTY_IMAGES[4], PROPERTY_IMAGES[5]],
      gender: 'Any',
      occupancy: 'Single',
      status: 'approved',
    },
    {
      title: 'Budget PG for Students near Delhi University',
      type: 'PG',
      location: 'Vijay Nagar',
      area: 'North Campus, Delhi University',
      city: 'Delhi',
      price: 6000,
      description: 'Affordable double-sharing PG accommodation for students. Close to Delhi University North Campus. Mess facility available. Good transport connectivity.',
      amenities: ['WiFi', 'Food', 'Security', 'CCTV'],
      images: [PROPERTY_IMAGES[0], PROPERTY_IMAGES[2]],
      gender: 'Male',
      occupancy: 'Double',
      status: 'approved',
    },
    {
      title: 'Luxury 3BHK Flat in Gurgaon',
      type: 'Flat',
      location: 'DLF Phase 2, Gurgaon',
      area: 'Near Cyber Hub',
      city: 'Gurgaon',
      price: 45000,
      description: 'Lavish 3BHK apartment in premium gated society. Clubhouse, swimming pool, gym. 24x7 security. Close to major IT parks and Cyber Hub restaurants.',
      amenities: ['Furnished', 'AC', 'Gym', 'Parking', 'Security', 'Power Backup', 'WiFi', 'CCTV'],
      images: [PROPERTY_IMAGES[3], PROPERTY_IMAGES[1]],
      gender: 'Any',
      occupancy: 'Any',
      status: 'approved',
      featured: true,
    },
    {
      title: 'Girls Hostel with 24/7 Security',
      type: 'PG',
      location: 'Pitampura',
      area: 'Near Pitampura TV Tower',
      city: 'Delhi',
      price: 8500,
      description: 'Safe and well-maintained girls hostel with round-the-clock security. Wardens available 24/7. North Delhi location with good metro connectivity.',
      amenities: ['Food', 'WiFi', 'Security', 'CCTV', 'Laundry', 'Power Backup'],
      gender: 'Female',
      occupancy: 'Double',
      images: [PROPERTY_IMAGES[5], PROPERTY_IMAGES[0]],
      status: 'approved',
    },
    {
      title: 'Semi-Furnished 2BHK in Rohini',
      type: 'Flat',
      location: 'Rohini Sector 7',
      area: 'Near Rohini East Metro',
      city: 'Delhi',
      price: 18000,
      description: 'Spacious semi-furnished 2BHK in a well-maintained society. Covered parking included. Family-friendly building. Excellent connectivity via metro.',
      amenities: ['Parking', 'Security', 'Water Supply', 'Power Backup', 'CCTV'],
      images: [PROPERTY_IMAGES[2], PROPERTY_IMAGES[4]],
      gender: 'Any',
      occupancy: 'Any',
      status: 'approved',
    },
    {
      title: 'Men\'s PG near Connaught Place',
      type: 'PG',
      location: 'Rajendra Place',
      area: 'Near CP and Karol Bagh',
      city: 'Delhi',
      price: 10000,
      description: 'Premium PG for working men. Central Delhi location with walking access to Connaught Place. All meals provided. High-speed WiFi included.',
      amenities: ['WiFi', 'Food', 'AC', 'Furnished', 'Security', 'Attached Bathroom'],
      images: [PROPERTY_IMAGES[1], PROPERTY_IMAGES[5]],
      gender: 'Male',
      occupancy: 'Single',
      status: 'approved',
      featured: true,
    },
    {
      title: 'Affordable 1RK near Nehru Place',
      type: 'Flat',
      location: 'Kalkaji',
      area: 'Near Nehru Place IT Hub',
      city: 'Delhi',
      price: 10500,
      description: 'Compact and affordable 1RK (1 Room Kitchen) for single working professionals. Close to Nehru Place and Govindpuri metro. Basic furnishing included.',
      amenities: ['Security', 'Water Supply', 'WiFi'],
      images: [PROPERTY_IMAGES[3], PROPERTY_IMAGES[0]],
      gender: 'Any',
      occupancy: 'Single',
      status: 'approved',
    },
    {
      title: 'Co-ed PG with Gym Facility',
      type: 'PG',
      location: 'Cyber City, Gurgaon',
      area: 'Corporate Green, Near DLF Cybercity',
      city: 'Gurgaon',
      price: 15000,
      description: 'Modern co-living space for professionals. Fully furnished rooms with high-speed WiFi. Equipped gym, rooftop lounge, and weekly housekeeping included.',
      amenities: ['WiFi', 'AC', 'Furnished', 'Gym', 'Laundry', 'Power Backup', 'CCTV'],
      images: [PROPERTY_IMAGES[4], PROPERTY_IMAGES[2]],
      gender: 'Any',
      occupancy: 'Single',
      status: 'approved',
      featured: true,
    },
    {
      title: 'Owner Submitted: PG in Vasant Kunj',
      type: 'PG',
      location: 'Vasant Kunj',
      area: 'Near Vasant Kunj Mall',
      city: 'Delhi',
      price: 11000,
      description: 'Well-maintained paying guest accommodation near Vasant Kunj mall. South Delhi prime location. Clean rooms and good facilities.',
      amenities: ['WiFi', 'Security', 'Power Backup', 'Water Supply'],
      images: [PROPERTY_IMAGES[5], PROPERTY_IMAGES[1]],
      gender: 'Female',
      occupancy: 'Double',
      ownerName: 'Rajesh Kumar',
      ownerPhone: '+91 91234 56789',
      ownerEmail: 'rajesh@example.com',
      owner_id: owner._id,
      status: 'pending', // Awaiting admin approval
    },
    {
      title: '3BHK Available in Dwarka Mor',
      type: 'Flat',
      location: 'Dwarka Mor',
      area: 'Near Dwarka Mor Metro',
      city: 'Delhi',
      price: 28000,
      description: 'Spacious 3BHK flat available for rent. Two balconies, modular kitchen, three full bathrooms. Society with club house and children\'s play area.',
      amenities: ['Parking', 'Security', 'Water Supply', 'Power Backup', 'Gym', 'CCTV'],
      images: [PROPERTY_IMAGES[0], PROPERTY_IMAGES[3]],
      gender: 'Any',
      occupancy: 'Any',
      status: 'approved',
    },
  ]);

  // ── Leads ─────────────────────────────────────────────────────────────────
  console.log('📋 Creating sample leads...');

  await Lead.insertMany([
    {
      userName: 'Amit Singh',
      userPhone: '+91 98765 00001',
      userEmail: 'amit@example.com',
      property_id: properties[0]._id,
      propertyTitle: properties[0].title,
      message: 'I am looking for accommodation near Laxmi Nagar metro. Please share more details.',
      status: 'new',
      source: 'contact_form',
    },
    {
      userName: 'Priya Gupta',
      userPhone: '+91 98765 00002',
      userEmail: 'priya@example.com',
      property_id: properties[2]._id,
      propertyTitle: properties[2].title,
      message: 'Interested in the girls PG. When can I visit?',
      status: 'contacted',
      source: 'book_visit',
      notes: 'Called on 2024-01-15. Visit scheduled for Saturday.',
      visitDate: new Date('2024-01-20'),
    },
    {
      userName: 'Rahul Verma',
      userPhone: '+91 98765 00003',
      property_id: properties[4]._id,
      propertyTitle: properties[4].title,
      message: 'Need AC PG near Noida Sector 62. Budget is 12k per month.',
      status: 'visit_scheduled',
      source: 'whatsapp',
      notes: 'Visit scheduled for Sunday at 11 AM.',
      visitDate: new Date('2024-01-21'),
    },
    {
      userName: 'Sunita Rao',
      userPhone: '+91 98765 00004',
      userEmail: 'sunita@example.com',
      property_id: properties[7]._id,
      propertyTitle: properties[7].title,
      message: 'Interested in Gurgaon flat for family. 3 members.',
      status: 'closed',
      source: 'contact_form',
      notes: 'Deal closed on 2024-01-10. Commission received: ₹45,000.',
    },
    {
      userName: 'Deepak Joshi',
      userPhone: '+91 98765 00005',
      property_id: properties[10]._id,
      propertyTitle: properties[10].title,
      message: 'Looking for PG near Connaught Place for 2 months.',
      status: 'new',
      source: 'get_details',
    },
  ]);

  console.log('\n✅ Database seeded successfully!\n');
  console.log('─────────────────────────────────────────');
  console.log('🔑 Admin Login:');
  console.log('   Email   : admin@staydost.com');
  console.log('   Password: admin123');
  console.log('─────────────────────────────────────────');
  console.log('🏠 Properties created:', properties.length);
  console.log('   Approved:', properties.filter((p) => p.status === 'approved').length);
  console.log('   Pending :', properties.filter((p) => p.status === 'pending').length);
  console.log('─────────────────────────────────────────\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
