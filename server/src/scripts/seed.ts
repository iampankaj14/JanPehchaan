import { supabase, isSupabaseConfigured } from '../config/supabase';
import { initialFamilies, initialMembers, initialSchemes, initialReviewFlags } from '../data/seedData';

async function seedDatabase() {
  console.log('--- JanPehchaan Database Seeding Script ---');

  if (!isSupabaseConfigured || !supabase) {
    console.log('ℹ️  Supabase credentials not configured in .env.');
    console.log('   The server is using the in-memory store initialized with:');
    console.log(`   - ${initialFamilies.length} Households`);
    console.log(`   - ${initialMembers.length} Family Members`);
    console.log(`   - ${initialSchemes.length} Welfare Schemes`);
    console.log(`   - ${initialReviewFlags.length} Review Queue Flags`);
    console.log('   Everything is ready for local development and live hackathon demos!');
    return;
  }

  console.log('Connecting to Supabase PostgreSQL...');

  try {
    // 1. Seed Families
    console.log('Seeding families...');
    for (const fam of initialFamilies) {
      await supabase.from('families').upsert(fam);
    }

    // 2. Seed Members
    console.log('Seeding family members...');
    for (const mem of initialMembers) {
      await supabase.from('family_members').upsert(mem);
    }

    // 3. Seed Schemes & Rules
    console.log('Seeding welfare schemes...');
    for (const scheme of initialSchemes) {
      const { rules, ...schemeRecord } = scheme;
      await supabase.from('welfare_schemes').upsert(schemeRecord);
      if (rules && rules.length > 0) {
        for (const rule of rules) {
          await supabase.from('scheme_rules').upsert(rule);
        }
      }
    }

    // 4. Seed Review Flags
    console.log('Seeding review flags...');
    for (const flag of initialReviewFlags) {
      await supabase.from('review_flags').upsert(flag);
    }

    console.log('✅ Supabase database seeded successfully!');
  } catch (err) {
    console.error('❌ Error during Supabase seeding:', err);
  }
}

seedDatabase().then(() => {
  console.log('Seeding process finished.');
  process.exit(0);
});
