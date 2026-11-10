const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DIMA Cinema database seed...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dima.krd' },
    update: {},
    create: {
      name: 'بەڕێوەبەری دیما سینەما',
      email: 'admin@dima.krd',
      password: adminPassword,
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });
  console.log(`✅ Admin user ready: ${admin.email}`);

  // 2. Genres
  const genresData = [
    { nameKurdish: 'ئەکشن', nameOriginal: 'Action', slug: 'action', order: 1 },
    { nameKurdish: 'دراما', nameOriginal: 'Drama', slug: 'drama', order: 2 },
    { nameKurdish: 'خەیاڵی زانستی', nameOriginal: 'Sci-Fi', slug: 'sci-fi', order: 3 },
    { nameKurdish: 'کۆمیدی', nameOriginal: 'Comedy', slug: 'comedy', order: 4 },
    { nameKurdish: 'ترسناک', nameOriginal: 'Horror', slug: 'horror', order: 5 },
    { nameKurdish: 'ئەنیمەیشن', nameOriginal: 'Animation', slug: 'animation', order: 6 },
    { nameKurdish: 'تاوانکاری', nameOriginal: 'Crime', slug: 'crime', order: 7 },
    { nameKurdish: 'سەرکێشی', nameOriginal: 'Adventure', slug: 'adventure', order: 8 },
    { nameKurdish: 'ڕۆمانسی', nameOriginal: 'Romance', slug: 'romance', order: 9 },
    { nameKurdish: 'بەڵگەنامەیی', nameOriginal: 'Documentary', slug: 'documentary', order: 10 },
  ];

  const genres = {};
  for (const g of genresData) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genres[g.slug] = genre;
  }
  console.log('✅ Genres created.');

  // 3. Countries
  const countriesData = [
    { nameKurdish: 'ئەمریکا', nameOriginal: 'United States', code: 'US' },
    { nameKurdish: 'بەریتانیا', nameOriginal: 'United Kingdom', code: 'GB' },
    { nameKurdish: 'کۆریای باشوور', nameOriginal: 'South Korea', code: 'KR' },
    { nameKurdish: 'کوردستان', nameOriginal: 'Kurdistan', code: 'KRD' },
    { nameKurdish: 'تورکیا', nameOriginal: 'Turkey', code: 'TR' },
    { nameKurdish: 'فەرەنسا', nameOriginal: 'France', code: 'FR' },
  ];

  const countries = {};
  for (const c of countriesData) {
    const country = await prisma.country.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
    countries[c.code] = country;
  }
  console.log('✅ Countries created.');

  // 4. Sample Cast/Crew
  const peopleData = [
    { nameKurdish: 'کریستۆفەر نۆلان', nameOriginal: 'Christopher Nolan', slug: 'christopher-nolan', photo: 'https://image.tmdb.org/t/p/w300/xuAIHGKoVu5GFbtEPUu098qYqS5.jpg' },
    { nameKurdish: 'کیلیان مۆرفی', nameOriginal: 'Cillian Murphy', slug: 'cillian-murphy', photo: 'https://image.tmdb.org/t/p/w300/i8b4z7vU2WpTfT4tE2pM8M0K1K3.jpg' },
    { nameKurdish: 'لیۆناردۆ دی کاپریۆ', nameOriginal: 'Leonardo DiCaprio', slug: 'leonardo-dicaprio', photo: 'https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
    { nameKurdish: 'ڕۆبەرت داونی جونیۆر', nameOriginal: 'Robert Downey Jr.', slug: 'robert-downey-jr', photo: 'https://image.tmdb.org/t/p/w300/im9SAqJPZKEbVZGmjXuLI4O7RvM.jpg' },
    { nameKurdish: 'زێندایا', nameOriginal: 'Zendaya', slug: 'zendaya', photo: 'https://image.tmdb.org/t/p/w300/r3A7evZyTGaaoQoNW9NsMi9xK1c.jpg' },
    { nameKurdish: 'تیمۆسی شالامێ', nameOriginal: 'Timothée Chalamet', slug: 'timothee-chalamet', photo: 'https://image.tmdb.org/t/p/w300/BE2sdjpgsa2rNTFa66f7upkaOP.jpg' },
  ];

  const people = {};
  for (const p of peopleData) {
    const person = await prisma.person.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
    people[p.slug] = person;
  }
  console.log('✅ People created.');

  // 5. Seed Movies (8 movies)
  const moviesData = [
    {
      titleKurdish: 'ئۆپنهایمەر',
      titleOriginal: 'Oppenheimer',
      slug: 'oppenheimer-2023',
      year: 2023,
      duration: 180,
      rating: 8.9,
      quality: '4K Ultra HD',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'چیرۆکی ژیانی زانای ئەمریکی جەی ڕۆبەرت ئۆپنهایمەر و ڕۆڵی لە پەرەپێدانی بۆمبی ئەتۆمی لە پڕۆژەی مانهاتن لە کاتی جەنگی جیهانی دووەمدا.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
      featured: true,
      views: 34200,
      genres: ['drama', 'action'],
      servers: [
        { label: 'سێرڤەر ١ - خێرا (Vidmoly)', provider: 'vidmoly', url: 'https://vidmoly.to/embed-xyz123.html', quality: '4K', subtitleNote: 'ژێرنووسی کوردی تایبەت' },
        { label: 'سێرڤەر ٢ - گووگڵ درایڤ (Google Drive)', provider: 'gdrive', url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
        { label: 'سێرڤەر ٣ - شەیرڤیدز (Sharevids)', provider: 'sharevids', url: 'https://sharevids.com/embed/oppenheimer', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
        { label: 'سێرڤەری یەدەگ (تایبەت)', provider: 'youtube', url: 'https://www.youtube.com/embed/uYPbbksJxIg', quality: 'HD', subtitleNote: 'تەماشاکردنی تڕەیلەر' },
      ],
      downloadLinks: [
        { label: 'داگرتن بە کوالیتی 4K Ultra HD (قەبارە: 7.2 GB)', url: 'https://example.com/download/4k', quality: '4K', fileSize: '7.2 GB' },
        { label: 'داگرتن بە کوالیتی 1080p FHD (قەبارە: 2.4 GB)', url: 'https://example.com/download/1080p', quality: '1080p', fileSize: '2.4 GB' },
        { label: 'داگرتن بە کوالیتی 720p HD (قەبارە: 1.1 GB)', url: 'https://example.com/download/720p', quality: '720p', fileSize: '1.1 GB' },
      ],
    },
    {
      titleKurdish: 'دیوون: بەشی دووەم',
      titleOriginal: 'Dune: Part Two',
      slug: 'dune-part-two-2024',
      year: 2024,
      duration: 166,
      rating: 8.6,
      quality: '4K Ultra HD',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'پۆڵ ئاتریدس یەکدەگرێت لەگەڵ چانی و فریمنەکان بۆ تۆڵەسەندنەوە لە پیلانگێڕەکان کە خێزانەکەیان لەناوبرد، هاوکات هەوڵدەدات پێشبینی ئایندەیەکی تۆقێنەر بکات.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      featured: true,
      views: 52100,
      genres: ['sci-fi', 'action', 'adventure'],
      servers: [
        { label: 'سێرڤەر ١ - خێرا (Vidmoly)', provider: 'vidmoly', url: 'https://vidmoly.to/embed-dune2.html', quality: '4K', subtitleNote: 'ژێرنووسی فەرمی دیما' },
        { label: 'سێرڤەر ٢ - گووگڵ درایڤ (Drive VIP)', provider: 'gdrive', url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
      ],
      downloadLinks: [
        { label: 'داگرتنی 1080p 60fps بە ژێرنووسی چەسپاو', url: 'https://example.com/dune2', quality: '1080p', fileSize: '2.8 GB' },
      ],
    },
    {
      titleKurdish: 'ئینتەرستێلار (نێوان ئەستێرەکان)',
      titleOriginal: 'Interstellar',
      slug: 'interstellar-2014',
      year: 2014,
      duration: 169,
      rating: 8.7,
      quality: '1080p BluRay',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'کاتێک زەوی بەرەو لەناوچوون دەچێت، تیمێک لە گەڕیدەکان ڕێگایەکی نادیار دەگرنەبەر لە بۆشایی ئاسمان بۆ دۆزینەوەی هەسارەیەکی نوێ بۆ مانەوەی مرۆڤایەتی.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      featured: true,
      views: 78900,
      genres: ['sci-fi', 'drama', 'adventure'],
      servers: [
        { label: 'سێرڤەر ١ (Vidmoly)', provider: 'vidmoly', url: 'https://vidmoly.to/embed-interstellar.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی بێ کەموکوڕی' },
      ],
    },
    {
      titleKurdish: 'دارک نایت (شۆڕەسواری تاریکی)',
      titleOriginal: 'The Dark Knight',
      slug: 'the-dark-knight-2008',
      year: 2008,
      duration: 152,
      rating: 9.0,
      quality: '4K Ultra HD',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'باتمان بە هاوکاری جەیمس گۆردۆن و هارڤی دێنت ڕووبەڕووی جۆکەر دەبنەوە، کە کەسێکی شێت و تیرۆریستە دەیەوێت شاری گۆثەم بخاتە ناو فەوزا و تاریکی.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
      featured: false,
      views: 94100,
      genres: ['action', 'crime', 'drama'],
      servers: [
        { label: 'سێرڤەر ١ - سەرەکی (Vidmoly)', provider: 'vidmoly', url: 'https://vidmoly.to/embed-tdk.html', quality: '4K', subtitleNote: 'ژێرنووسی کوردی' },
      ],
    },
    {
      titleKurdish: 'ئینسیپشن (دەستپێک)',
      titleOriginal: 'Inception',
      slug: 'inception-2010',
      year: 2010,
      duration: 148,
      rating: 8.8,
      quality: '1080p BluRay',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'دزێک کە نهێنییە کۆمپانیاکان دەدزێت لە ڕێگەی تەکنەلۆژیای بەشداریکردنی خەونەوە، ئەرکێکی پێچەوانەی پێدەسپێردرێت: چاندنی بیرۆکەیەک لە ناو مێشکی کەسێکدا.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      featured: false,
      views: 65400,
      genres: ['action', 'sci-fi', 'adventure'],
      servers: [
        { label: 'سێرڤەر ١ - خێرا', provider: 'vidmoly', url: 'https://vidmoly.to/embed-inception.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
      ],
    },
    {
      titleKurdish: 'سپایدەرمان: بەناو گەردوونی جاڵجاڵۆکەدا',
      titleOriginal: 'Spider-Man: Across the Spider-Verse',
      slug: 'spider-man-across-the-spider-verse-2023',
      year: 2023,
      duration: 140,
      rating: 8.7,
      quality: '4K Ultra HD',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'مایڵز مۆرالیس بەرەو گەردوونە فرەچەشنەکان دەچێت و لەوێ ڕووبەڕووی تاقمێک لە پیاوانی جاڵجاڵۆکە دەبێتەوە کە ئەرکی پاراستنی ڕاستینەیان پێ سپێردراوە.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
      featured: true,
      views: 48900,
      genres: ['animation', 'action', 'adventure'],
      servers: [
        { label: 'سێرڤەر ١ - خێرا (Vidmoly)', provider: 'vidmoly', url: 'https://vidmoly.to/embed-spiderman.html', quality: '4K', subtitleNote: 'ژێرنووسی کوردی' },
      ],
    },
    {
      titleKurdish: 'پاراتسایت (مشەخۆر)',
      titleOriginal: 'Parasite',
      slug: 'parasite-2019',
      year: 2019,
      duration: 132,
      rating: 8.5,
      quality: '1080p BluRay',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['KR'].id,
      synopsis: 'خێزانێکی هەژار بە فێڵ و پلان خۆیان لەناو ماڵی خێزانێکی زۆر دەوڵەمەند جێگیر دەکەن، بەڵام ڕووداوێکی چاوەڕواننەکراو هەموو شتێک تێکدەدات.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/hiKmpnnOpfv3IjYrYs88L07kdZ1.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=5xH0RzeSojI',
      featured: false,
      views: 41200,
      genres: ['drama', 'comedy', 'crime'],
      servers: [
        { label: 'سێرڤەر ١', provider: 'vidmoly', url: 'https://vidmoly.to/embed-parasite.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
      ],
    },
    {
      titleKurdish: 'گۆدفازەر (باوکی ڕۆحی)',
      titleOriginal: 'The Godfather',
      slug: 'the-godfather-1972',
      year: 1972,
      duration: 175,
      rating: 9.2,
      quality: '4K Remastered',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'سەرکردەی بەساڵاچووی بنەماڵەیەکی مافیایی دەسەڵاتەکەی دەداتە دەست کوڕە بچووکەکەی کە سەرەتا نەیویستووە بەشێک بێت لە بازرگانی خێزانەکەی.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=sY1S34973zA',
      featured: false,
      views: 89000,
      genres: ['crime', 'drama'],
      servers: [
        { label: 'سێرڤەر ١ - سەرەکی', provider: 'vidmoly', url: 'https://vidmoly.to/embed-godfather.html', quality: '4K', subtitleNote: 'ژێرنووسی کوردی تایبەت' },
      ],
    },
  ];

  for (const m of moviesData) {
    const movie = await prisma.movie.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        titleKurdish: m.titleKurdish,
        titleOriginal: m.titleOriginal,
        slug: m.slug,
        year: m.year,
        duration: m.duration,
        rating: m.rating,
        quality: m.quality,
        language: m.language,
        countryId: m.countryId,
        synopsis: m.synopsis,
        poster: m.poster,
        backdrop: m.backdrop,
        trailerUrl: m.trailerUrl,
        featured: m.featured,
        views: 0,
        status: 'PUBLISHED',
      },
    });

    // Link Genres
    for (const gSlug of m.genres) {
      if (genres[gSlug]) {
        await prisma.movieGenre.upsert({
          where: {
            movieId_genreId: { movieId: movie.id, genreId: genres[gSlug].id },
          },
          update: {},
          create: { movieId: movie.id, genreId: genres[gSlug].id },
        });
      }
    }

    // Add Servers
    if (m.servers) {
      for (let i = 0; i < m.servers.length; i++) {
        const s = m.servers[i];
        await prisma.server.create({
          data: {
            movieId: movie.id,
            label: s.label,
            provider: s.provider,
            url: s.url,
            quality: s.quality,
            subtitleNote: s.subtitleNote,
            order: i + 1,
            active: true,
          },
        });
      }
    }

    // Add Download links
    if (m.downloadLinks) {
      for (const dl of m.downloadLinks) {
        await prisma.downloadLink.create({
          data: {
            movieId: movie.id,
            label: dl.label,
            url: dl.url,
            quality: dl.quality,
            fileSize: dl.fileSize,
          },
        });
      }
    }
  }
  console.log('✅ Movies created with servers and download links.');

  // 6. Seed Series (4 series with seasons and episodes)
  const seriesData = [
    {
      titleKurdish: 'برەیکینگ باد (تێکچوونی خراپ)',
      titleOriginal: 'Breaking Bad',
      slug: 'breaking-bad',
      year: 2008,
      rating: 9.5,
      quality: '4K Ultra HD',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'مامۆستایەکی کیمیای ئامادەیی دوای ئەوەی دەزانێت تووشی شێرپەنجەی سییەکان بووە، دەست دەکات بە دروستکردنی ماددەی هۆشبەر بۆ دابینکردنی داهاتووی دارایی خێزانەکەی.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
      featured: true,
      views: 120400,
      genres: ['crime', 'drama'],
      seasons: [
        {
          number: 1,
          titleKurdish: 'وەرزی یەکەم',
          episodes: [
            {
              number: 1,
              titleKurdish: 'ئەڵقەی ١: سەرەتا',
              duration: 58,
              thumbnail: 'https://image.tmdb.org/t/p/w500/ydlY3iPxeZu4AZxsIHI4OH9nwWC.jpg',
              servers: [
                { label: 'سێرڤەر ١ - خێرا', provider: 'vidmoly', url: 'https://vidmoly.to/embed-bb-s1e1.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
                { label: 'سێرڤەر ٢ - درایڤ', provider: 'gdrive', url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
              ],
            },
            {
              number: 2,
              titleKurdish: 'ئەڵقەی ٢: پشیلەکە لەناو کیسەدایە',
              duration: 48,
              thumbnail: 'https://image.tmdb.org/t/p/w500/uU8cQZ0hZ8CfxN6f8t1QnLd3ZgV.jpg',
              servers: [
                { label: 'سێرڤەر ١', provider: 'vidmoly', url: 'https://vidmoly.to/embed-bb-s1e2.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
              ],
            },
            {
              number: 3,
              titleKurdish: 'ئەڵقەی ٣: بڕیار لە تاریکیدا',
              duration: 49,
              thumbnail: 'https://image.tmdb.org/t/p/w500/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
              servers: [
                { label: 'سێرڤەر ١', provider: 'vidmoly', url: 'https://vidmoly.to/embed-bb-s1e3.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
              ],
            },
          ],
        },
      ],
    },
    {
      titleKurdish: 'یاری تەختە پاشایەتییەکان',
      titleOriginal: 'Game of Thrones',
      slug: 'game-of-thrones',
      year: 2011,
      rating: 9.3,
      quality: '4K Ultra HD',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'نۆ بنەماڵەی ناودار و ئەشرافی شەڕ دەکەن بۆ کۆنتڕۆڵکردنی زەوییەکانی وێستێرۆس، هاوکات دوژمنێکی کۆن لە دوای هەزاران ساڵ لە باکوورەوە دەگەڕێتەوە.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=KPLWWIOCOOQ',
      featured: true,
      views: 185000,
      genres: ['action', 'drama', 'adventure'],
      seasons: [
        {
          number: 1,
          titleKurdish: 'وەرزی یەکەم',
          episodes: [
            {
              number: 1,
              titleKurdish: 'ئەڵقەی ١: زستان بەڕێوەیە',
              duration: 62,
              thumbnail: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
              servers: [
                { label: 'سێرڤەر ١ - Vidmoly', provider: 'vidmoly', url: 'https://vidmoly.to/embed-got-s1e1.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
              ],
            },
            {
              number: 2,
              titleKurdish: 'ئەڵقەی ٢: ڕێگای پاشاکان',
              duration: 56,
              thumbnail: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
              servers: [
                { label: 'سێرڤەر ١ - Vidmoly', provider: 'vidmoly', url: 'https://vidmoly.to/embed-got-s1e2.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
              ],
            },
          ],
        },
      ],
    },
    {
      titleKurdish: 'سترەینجەر تینگز (شتە نامۆکان)',
      titleOriginal: 'Stranger Things',
      slug: 'stranger-things',
      year: 2016,
      rating: 8.7,
      quality: '4K Dolby Vision',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'لە شارۆچکەیەکی بچووکدا کاتێک کوڕێکی گەنج ون دەبێت، هاوڕێکانی و دایکی و پۆلیسی شارەکە ڕووبەڕووی هێزی سەروو سروشتی و نهێنییەکانی حکومەت دەبنەوە.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
      featured: false,
      views: 74200,
      genres: ['sci-fi', 'horror', 'drama'],
      seasons: [
        {
          number: 1,
          titleKurdish: 'وەرزی یەکەم',
          episodes: [
            {
              number: 1,
              titleKurdish: 'ئەڵقەی ١: ونبوونی ویڵ بایەرز',
              duration: 48,
              thumbnail: 'https://image.tmdb.org/t/p/w500/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
              servers: [
                { label: 'سێرڤەر ١', provider: 'vidmoly', url: 'https://vidmoly.to/embed-st-s1e1.html', quality: '1080p', subtitleNote: 'ژێرنووسی کوردی' },
              ],
            },
          ],
        },
      ],
    },
    {
      titleKurdish: 'کۆتا کەس لە ئێمە (زە لاست ئۆف ئەس)',
      titleOriginal: 'The Last of Us',
      slug: 'the-last-of-us',
      year: 2023,
      rating: 8.8,
      quality: '4K HDR',
      language: 'کوردی (ژێرنووس)',
      countryId: countries['US'].id,
      synopsis: 'بیست ساڵ دوای ئەوەی کەڕوویەکی کوشندە مرۆڤایەتی لەناودەبات، جۆڵ ڕاسپێردراوە ئیلی کچێکی تەمەن ١٤ ساڵ بە نهێنی لە ناوچەی کەرەنتینە دەرببات.',
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/uKvVjHNqB5VmOrdxqAt2V7JMrHG.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=uLtkt8BonwM',
      featured: true,
      views: 93500,
      genres: ['action', 'adventure', 'drama'],
      seasons: [
        {
          number: 1,
          titleKurdish: 'وەرزی یەکەم',
          episodes: [
            {
              number: 1,
              titleKurdish: 'ئەڵقەی ١: کاتێک لە تاریکیدا ون دەبیت',
              duration: 81,
              thumbnail: 'https://image.tmdb.org/t/p/w500/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
              servers: [
                { label: 'سێرڤەر ١', provider: 'vidmoly', url: 'https://vidmoly.to/embed-tlou-s1e1.html', quality: '4K', subtitleNote: 'ژێرنووسی کوردی' },
              ],
            },
          ],
        },
      ],
    },
  ];

  for (const s of seriesData) {
    const series = await prisma.series.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        titleKurdish: s.titleKurdish,
        titleOriginal: s.titleOriginal,
        slug: s.slug,
        year: s.year,
        rating: s.rating,
        quality: s.quality,
        language: s.language,
        countryId: s.countryId,
        synopsis: s.synopsis,
        poster: s.poster,
        backdrop: s.backdrop,
        trailerUrl: s.trailerUrl,
        featured: s.featured,
        views: 0,
        status: 'PUBLISHED',
      },
    });

    for (const gSlug of s.genres) {
      if (genres[gSlug]) {
        await prisma.seriesGenre.upsert({
          where: {
            seriesId_genreId: { seriesId: series.id, genreId: genres[gSlug].id },
          },
          update: {},
          create: { seriesId: series.id, genreId: genres[gSlug].id },
        });
      }
    }

    for (const sea of s.seasons) {
      const season = await prisma.season.upsert({
        where: {
          seriesId_number: { seriesId: series.id, number: sea.number },
        },
        update: {},
        create: {
          seriesId: series.id,
          number: sea.number,
          titleKurdish: sea.titleKurdish,
        },
      });

      for (const ep of sea.episodes) {
        const episode = await prisma.episode.upsert({
          where: {
            seasonId_number: { seasonId: season.id, number: ep.number },
          },
          update: {},
          create: {
            seasonId: season.id,
            seriesId: series.id,
            number: ep.number,
            titleKurdish: ep.titleKurdish,
            duration: ep.duration,
            thumbnail: ep.thumbnail,
          },
        });

        if (ep.servers) {
          for (let i = 0; i < ep.servers.length; i++) {
            const srv = ep.servers[i];
            await prisma.server.create({
              data: {
                episodeId: episode.id,
                label: srv.label,
                provider: srv.provider,
                url: srv.url,
                quality: srv.quality,
                subtitleNote: srv.subtitleNote,
                order: i + 1,
                active: true,
              },
            });
          }
        }
      }
    }
  }
  console.log('✅ Series created with seasons, episodes, and stream servers.');

  // 7. Homepage Rows Config
  const rows = [
    { titleKurdish: 'تازەترین فیلمەکان', rule: 'LATEST', type: 'MOVIE', order: 1 },
    { titleKurdish: 'زنجیرەی ئەم هەفتەیە', rule: 'LATEST', type: 'SERIES', order: 2 },
    { titleKurdish: 'زۆرترین بینراو لە دیما سینەما', rule: 'MOST_VIEWED', type: 'MIXED', order: 3 },
    { titleKurdish: 'فیلمە ئەکشنە سەرنجڕاکێشەکان', rule: 'GENRE', genreId: genres['action']?.id, type: 'MOVIE', order: 4 },
    { titleKurdish: 'خەیاڵی زانستی و نادیار', rule: 'GENRE', genreId: genres['sci-fi']?.id, type: 'MOVIE', order: 5 },
    { titleKurdish: 'جیهانی ئەنیمەیشن و کارتۆن', rule: 'GENRE', genreId: genres['animation']?.id, type: 'MOVIE', order: 6 },
  ];

  for (const r of rows) {
    await prisma.homeRow.create({
      data: {
        titleKurdish: r.titleKurdish,
        rule: r.rule,
        type: r.type,
        genreId: r.genreId,
        order: r.order,
        active: true,
      },
    });
  }
  console.log('✅ Home rows configured.');

  // 8. Site Settings
  const settings = [
    { key: 'site_name', value: 'دیما سینەما - DIMA Cinema' },
    { key: 'site_description', value: 'سەکۆی ژمارە یەکی سەیرکردنی فیلم و زنجیرە جیهانییەکان بە ژێرنووسی کوردی سۆرانی' },
    { key: 'announcement', value: 'بەخێربێن بۆ دیما سینەما! بەرزترین کوالیتی سەیرکردن بە ژێرنووسی کوردی بۆ یەکەمین جار بە شێوازی سینەمایی نوێ.' },
    { key: 'telegram_url', value: 'https://t.me/dimacinema' },
    { key: 'instagram_url', value: 'https://instagram.com/dimacinema' },
    { key: 'contact_email', value: 'contact@dima.krd' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ Site settings saved.');

  console.log('\n🎉 DIMA Cinema Database Seed Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Admin Login:');
  console.log('Email: admin@dima.krd');
  console.log('Password: Admin@123456');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
