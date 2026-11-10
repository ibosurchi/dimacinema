const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'بەڕێوەبەری سەرەکی';

  if (!email || !password) {
    console.log('بەکارھێنان: node scripts/set-admin.js <ئیمەیڵ> <تێپەڕەوشە> [ناو]');
    console.log('نموونە: node scripts/set-admin.js myemail@gmail.com MyPass123 "ئیبراهیم"');
    process.exit(1);
  }

  const cleanEmail = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  // سڕینەوەی ئەدمینە کۆنەکە ئەگەر ئیمەیڵەکەی جیاواز بێت
  if (cleanEmail !== 'admin@dima.krd') {
    const deleted = await prisma.user.deleteMany({
      where: { email: 'admin@dima.krd' }
    });
    if (deleted.count > 0) {
      console.log('🗑 ئەکاونتە کۆنەکە (admin@dima.krd) بە سەرکەوتوویی لە داتابەیس سڕایەوە.');
    }
  }

  // دروستکردن یان نوێکردنەوەی ئەکاونتی ئەدمینی نوێ
  const user = await prisma.user.upsert({
    where: { email: cleanEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: name
    },
    create: {
      email: cleanEmail,
      password: hashedPassword,
      role: 'ADMIN',
      name: name
    }
  });

  console.log('----------------------------------------------------');
  console.log('🎉 پیرۆزە! ئەکاونتی ئەدمینی نوێ بە سەرکەوتوویی ڕێکخرا:');
  console.log(`👤 ناو: ${user.name}`);
  console.log(`📧 ئیمەیڵ: ${user.email}`);
  console.log(`🔑 تێپەڕەوشە: ${password}`);
  console.log(`🛡 پلە: ${user.role}`);
  console.log('----------------------------------------------------');

  await prisma.$disconnect();
}

setAdmin().catch(async (e) => {
  console.error('هەڵە ڕوویدا:', e);
  await prisma.$disconnect();
  process.exit(1);
});
