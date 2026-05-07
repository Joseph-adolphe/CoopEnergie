const { getAllCooperatives } = require('./services/supabaseService.ts');

async function test() {
  try {
    console.log('🔄 Récupération des coopératives...');
    const data = await getAllCooperatives();
    console.log('✅ Coopératives :', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Erreur :', error.message);
  }
}

test();
