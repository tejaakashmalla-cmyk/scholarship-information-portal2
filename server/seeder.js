const mongoose = require('mongoose');
require('dotenv').config();

const Scheme = require('./models/Scheme.model');
const User = require('./models/User.model');
const Profile = require('./models/Profile.model');

const schemes = [
  {
    name: 'PM National Scholarship Scheme',
    description: 'Merit-based scholarship for students pursuing UG/PG courses from central universities. Provides financial support to meritorious students from economically weaker sections.',
    category: 'General',
    ministry: 'Ministry of Education',
    amount: '₹12,000/year',
    amountValue: 12000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 17, maxAge: 25, maxAnnualIncome: 250000,
      educationLevels: ['12th Pass', 'Graduation'],
      categories: ['All'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['Income Certificate', 'Marksheet (last qualifying exam)', 'Aadhaar Card', 'Bank Account Details', 'Admission Letter'],
    applicationProcess: 'Apply through the National Scholarship Portal (scholarships.gov.in). Fill the online form, upload documents, and submit before the deadline.',
    officialLink: 'https://scholarships.gov.in',
    tags: ['merit', 'ug', 'pg', 'central'],
    isActive: true,
  },
  {
    name: 'SC/ST Post Matric Scholarship',
    description: 'Financial assistance to SC/ST students pursuing post-matric education. Covers tuition fees, maintenance allowance and other educational expenses.',
    category: 'SC',
    ministry: 'Ministry of Social Justice and Empowerment',
    amount: '₹5,000–₹20,000/year',
    amountValue: 15000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 0, maxAge: 40, maxAnnualIncome: 250000,
      educationLevels: ['10th Pass', '12th Pass', 'Graduation', 'Post Graduation'],
      categories: ['SC', 'ST'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['Caste Certificate (SC/ST)', 'Income Certificate', 'Admission Letter', 'Bank Passbook', 'Previous Marksheet'],
    applicationProcess: 'Register on NSP portal, select scheme, fill application form and upload required documents.',
    officialLink: 'https://scholarships.gov.in',
    tags: ['sc', 'st', 'post-matric', 'fees'],
    isActive: true,
  },
  {
    name: 'OBC Pre-Matric Scholarship',
    description: 'Support for OBC students enrolled in classes 1–10 from economically weaker sections. Helps reduce dropout rates among OBC students at the school level.',
    category: 'OBC',
    ministry: 'Ministry of Social Justice and Empowerment',
    amount: '₹4,000/year',
    amountValue: 4000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 0, maxAge: 20, maxAnnualIncome: 100000,
      educationLevels: ['Below 10th'],
      categories: ['OBC'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['OBC Certificate', 'Income Certificate', 'School Enrollment Proof', 'Aadhaar Card', 'Bank Details'],
    applicationProcess: 'Apply through the state scholarship portal or National Scholarship Portal before the deadline.',
    officialLink: 'https://scholarships.gov.in',
    tags: ['obc', 'pre-matric', 'school'],
    isActive: true,
  },
  {
    name: 'Central Sector Scholarship for College Students',
    description: 'For students in the top 20 percentile of their 12th board pursuing higher education. One of India\'s most prestigious merit scholarships.',
    category: 'General',
    ministry: 'Ministry of Education',
    amount: '₹10,000–₹20,000/year',
    amountValue: 20000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 17, maxAge: 22, maxAnnualIncome: 450000,
      educationLevels: ['12th Pass', 'Graduation'],
      categories: ['All'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['Board Marksheet (Top 20 percentile proof)', 'Income Certificate', 'College Admission Proof', 'Aadhaar Card', 'Bank Account'],
    applicationProcess: 'Apply on NSP within 6 months of admission. Renewal available each year on academic performance.',
    officialLink: 'https://scholarships.gov.in',
    tags: ['merit', 'top-20-percentile', 'ug', 'prestigious'],
    isActive: true,
  },
  {
    name: 'Minority Pre-Matric Scholarship',
    description: 'Financial assistance to students from minority communities (Muslim, Christian, Sikh, Buddhist, Zoroastrian, Jain) studying in classes 1–10.',
    category: 'Minority',
    ministry: 'Ministry of Minority Affairs',
    amount: '₹1,000–₹10,000/year',
    amountValue: 8000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 0, maxAge: 18, maxAnnualIncome: 100000,
      educationLevels: ['Below 10th'],
      categories: ['Minority'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['Minority Community Certificate', 'Income Certificate', 'School Enrollment Letter', 'Aadhaar Card', 'Bank Passbook'],
    applicationProcess: 'Apply on NSP. Institutional verification required from school principal.',
    officialLink: 'https://scholarships.gov.in',
    tags: ['minority', 'pre-matric', 'school', 'religious-minority'],
    isActive: true,
  },
  {
    name: 'Rajiv Gandhi National Fellowship',
    description: 'Fellowship for SC students pursuing MPhil and PhD programmes at Indian universities and institutions. Covers full research costs.',
    category: 'SC',
    ministry: 'University Grants Commission (UGC)',
    amount: '₹25,000/month',
    amountValue: 300000,
    frequency: 'Monthly',
    eligibilityCriteria: {
      minAge: 21, maxAge: 35, maxAnnualIncome: 500000,
      educationLevels: ['Graduation', 'Post Graduation'],
      categories: ['SC'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['Caste Certificate', 'PhD/MPhil Enrollment Letter', 'Bank Account Details', 'Supervisor Letter', 'Academic Transcripts'],
    applicationProcess: 'Apply on UGC portal. Selection based on merit and availability. Fellowship is for 2 years (JRF) + 3 years (SRF).',
    officialLink: 'https://ugc.ac.in',
    tags: ['sc', 'phd', 'mphil', 'research', 'ugc', 'fellowship'],
    isActive: true,
  },
  {
    name: 'INSPIRE Scholarship for Higher Education',
    description: "DST's flagship scholarship for students pursuing Natural Sciences at UG level. Encourages talented students to pursue careers in science research.",
    category: 'General',
    ministry: 'Department of Science & Technology',
    amount: '₹80,000/year',
    amountValue: 80000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 17, maxAge: 22, maxAnnualIncome: 9999999,
      educationLevels: ['12th Pass', 'Graduation'],
      categories: ['All'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['Board Certificate (Top 1% proof)', 'College Admission Letter (BSc Natural Sciences)', 'Bank Account Details', 'Aadhaar Card'],
    applicationProcess: 'Apply through DST INSPIRE portal. Requires being in top 1% of respective board examination.',
    officialLink: 'https://online-inspire.gov.in',
    tags: ['science', 'dst', 'bsc', 'research', 'merit', 'top-1-percent'],
    isActive: true,
  },
  {
    name: 'Pragati Scholarship for Girl Students',
    description: 'AICTE scholarship exclusively for girl students pursuing technical education (engineering/MBA) to promote gender diversity in STEM.',
    category: 'General',
    ministry: 'All India Council for Technical Education',
    amount: '₹50,000/year',
    amountValue: 50000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 17, maxAge: 30, maxAnnualIncome: 800000,
      educationLevels: ['12th Pass', 'Graduation'],
      categories: ['All'], states: ['All'], genders: ['Female'],
    },
    requiredDocuments: ['Income Certificate', 'AICTE Approved College Admission Letter', 'Aadhaar Card', 'Bank Account', 'Previous Marksheet'],
    applicationProcess: 'Apply on AICTE portal. One girl per family is eligible. Tuition fee waiver + cash incentive.',
    officialLink: 'https://aicte-pragati-saksham-gov.in',
    tags: ['girls', 'stem', 'engineering', 'mba', 'aicte', 'female'],
    isActive: true,
  },
  {
    name: 'National Means-cum-Merit Scholarship',
    description: 'Scholarship for meritorious students of economically weaker sections to arrest their dropout rate at Class VIII and continue until Class XII.',
    category: 'General',
    ministry: 'Ministry of Education',
    amount: '₹12,000/year',
    amountValue: 12000,
    frequency: 'Yearly',
    eligibilityCriteria: {
      minAge: 12, maxAge: 18, maxAnnualIncome: 150000,
      educationLevels: ['Below 10th'],
      categories: ['All'], states: ['All'], genders: ['All'],
    },
    requiredDocuments: ['NMMS Selection Test Score', 'Income Certificate', 'Marksheet Class VII/VIII', 'School Enrollment', 'Aadhaar Card'],
    applicationProcess: 'Students in Class VIII need to appear for the NMMS examination conducted by states/UTs.',
    officialLink: 'https://scholarships.gov.in',
    tags: ['school', 'class-8', 'class-12', 'means-cum-merit', 'dropout-prevention'],
    isActive: true,
  },
  {
    name: 'Ishan Uday Special Scholarship – North East',
    description: 'Special scholarship for students from North East region pursuing general degree courses to promote higher education in the region.',
    category: 'General',
    ministry: 'University Grants Commission (UGC)',
    amount: '₹5,400–₹7,800/month',
    amountValue: 75600,
    frequency: 'Monthly',
    eligibilityCriteria: {
      minAge: 17, maxAge: 30, maxAnnualIncome: 450000,
      educationLevels: ['12th Pass', 'Graduation'],
      categories: ['All'],
      states: ['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'],
      genders: ['All'],
    },
    requiredDocuments: ['North East Domicile Certificate', 'Income Certificate', 'Admission Letter', 'Aadhaar Card', 'Bank Details'],
    applicationProcess: 'Apply on UGC Ishan Uday portal. Preference given to students from rural and remote areas.',
    officialLink: 'https://ugc.ac.in',
    tags: ['north-east', 'regional', 'ugc', 'higher-education'],
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Scheme.deleteMany({});
    console.log('🗑️  Cleared existing schemes');

    // Insert schemes
    const created = await Scheme.insertMany(schemes);
    console.log(`✅ Seeded ${created.length} scholarship schemes`);

    // Create a demo admin user
    await User.deleteMany({ email: 'admin@uss.gov.in' });
    const admin = await User.create({
      name: 'USS Admin',
      email: 'admin@uss.gov.in',
      password: 'admin@123',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`✅ Admin user created: admin@uss.gov.in / admin@123`);

    // Demo student
    await User.deleteMany({ email: 'student@demo.com' });
    const student = await User.create({
      name: 'Priya Sharma',
      email: 'student@demo.com',
      password: 'demo@123',
      role: 'student',
      isEmailVerified: true,
    });
    await Profile.deleteMany({ user: student._id });
    await Profile.create({
      user: student._id,
      fullName: 'Priya Sharma',
      age: 21,
      annualIncome: 180000,
      educationLevel: '12th Pass',
      category: 'General',
      state: 'Maharashtra',
      gender: 'Female',
      disabilityStatus: false,
    });
    console.log(`✅ Demo student created: student@demo.com / demo@123`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────────');
    console.log('Admin:   admin@uss.gov.in  /  admin@123');
    console.log('Student: student@demo.com  /  demo@123');
    console.log('─────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
