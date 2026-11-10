const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.movie.updateMany({ data: { views: 0 } });
  await prisma.series.updateMany({ data: { views: 0 } });
  await prisma.episode.updateMany({ data: { views: 0 } });
  console.log('✅ All movie, series, and episode views reset to 0!');
}

main().finally(() => prisma.$disconnect());
