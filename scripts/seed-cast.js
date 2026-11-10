const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding and linking actors...');

  // Actors list
  const actors = [
    {
      nameKurdish: 'تیمۆسی شالامێ',
      nameOriginal: 'Timothée Chalamet',
      slug: 'timothee-chalamet',
      photo: 'https://image.tmdb.org/t/p/w300/BE2sdjpgsa2rNTFa66f7upkaOP.jpg',
      biography: 'ئەکتەری ئەمریکی-فەرەنسی، ناسراو بە ڕۆڵی پۆڵ ئاتریدس لە فیلمی Dune.',
    },
    {
      nameKurdish: 'زێندایا',
      nameOriginal: 'Zendaya',
      slug: 'zendaya',
      photo: 'https://image.tmdb.org/t/p/w300/r3A7evZyTGaaoQoNW9NsMi9xK1c.jpg',
      biography: 'ئەکتەر و گۆرانیبێژی ئەمریکی، براوەی خەڵاتی ئێمی، ناسراو بە ڕۆڵی چانی لە Dune.',
    },
    {
      nameKurdish: 'کیلیان مۆرفی',
      nameOriginal: 'Cillian Murphy',
      slug: 'cillian-murphy',
      photo: 'https://image.tmdb.org/t/p/w300/i8b4z7vU2WpTfT4tE2pM8M0K1K3.jpg',
      biography: 'ئەکتەری ئیرلەندی، براوەی خەڵاتی ئۆسکار بۆ ڕۆڵی ئۆپنهایمەر.',
    },
    {
      nameKurdish: 'ڕۆبەرت داونی جونیۆر',
      nameOriginal: 'Robert Downey Jr.',
      slug: 'robert-downey-jr',
      photo: 'https://image.tmdb.org/t/p/w300/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg',
      biography: 'ئەکتەری بەناوبانگی ئەمریکی، براوەی خەڵاتی ئۆسکار.',
    },
    {
      nameKurdish: 'لیۆناردۆ دی کاپریۆ',
      nameOriginal: 'Leonardo DiCaprio',
      slug: 'leonardo-dicaprio',
      photo: 'https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
      biography: 'ئەکتەری ئەفسانەیی ئەمریکی و براوەی خەڵاتی ئۆسکار.',
    },
    {
      nameKurdish: 'کریستیان بەیڵ',
      nameOriginal: 'Christian Bale',
      slug: 'christian-bale',
      photo: 'https://image.tmdb.org/t/p/w300/qCpZn2e3nW9oq0nmG3vTnmsZohk.jpg',
      biography: 'ئەکتەری بەریتانی، ناسراو بە ڕۆڵی باتمان لە سێینەی شۆڕەسواری تاریکی.',
    },
  ];

  const peopleMap = {};
  for (const a of actors) {
    const person = await prisma.person.upsert({
      where: { slug: a.slug },
      update: { photo: a.photo, nameKurdish: a.nameKurdish, nameOriginal: a.nameOriginal },
      create: a,
    });
    peopleMap[a.slug] = person;
  }

  // Link to Dune 2
  const dune = await prisma.movie.findUnique({ where: { slug: 'dune-part-two-2024' } });
  if (dune) {
    await prisma.credit.deleteMany({ where: { movieId: dune.id } });
    await prisma.credit.createMany({
      data: [
        { movieId: dune.id, personId: peopleMap['timothee-chalamet'].id, role: 'ACTOR', characterName: 'پۆڵ ئاتریدس (Paul Atreides)', order: 1 },
        { movieId: dune.id, personId: peopleMap['zendaya'].id, role: 'ACTOR', characterName: 'چانی (Chani)', order: 2 },
      ],
    });
  }

  // Link to Oppenheimer
  const oppenheimer = await prisma.movie.findUnique({ where: { slug: 'oppenheimer-2023' } });
  if (oppenheimer) {
    await prisma.credit.deleteMany({ where: { movieId: oppenheimer.id } });
    await prisma.credit.createMany({
      data: [
        { movieId: oppenheimer.id, personId: peopleMap['cillian-murphy'].id, role: 'ACTOR', characterName: 'جەی ڕۆبەرت ئۆپنهایمەر', order: 1 },
        { movieId: oppenheimer.id, personId: peopleMap['robert-downey-jr'].id, role: 'ACTOR', characterName: 'لویس ستراوس (Lewis Strauss)', order: 2 },
      ],
    });
  }

  // Link to Inception
  const inception = await prisma.movie.findUnique({ where: { slug: 'inception-2010' } });
  if (inception) {
    await prisma.credit.deleteMany({ where: { movieId: inception.id } });
    await prisma.credit.createMany({
      data: [
        { movieId: inception.id, personId: peopleMap['leonardo-dicaprio'].id, role: 'ACTOR', characterName: 'دۆم کۆب (Dom Cobb)', order: 1 },
        { movieId: inception.id, personId: peopleMap['cillian-murphy'].id, role: 'ACTOR', characterName: 'ڕۆبەرت فیشەر (Robert Fischer)', order: 2 },
      ],
    });
  }

  console.log('✅ Cast linked successfully to movies!');
}

main().finally(() => prisma.$disconnect());
