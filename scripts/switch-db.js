const fs = require('fs');
const path = require('path');

const target = process.argv[2]; // 'postgres' or 'sqlite'
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const pgSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.postgresql.prisma');

if (target === 'postgres') {
  if (fs.existsSync(pgSchemaPath)) {
    fs.copyFileSync(pgSchemaPath, schemaPath);
    console.log('Switched Prisma schema to PostgreSQL! Please ensure DATABASE_URL in .env points to your Postgres database.');
  }
} else if (target === 'sqlite') {
  let content = fs.readFileSync(schemaPath, 'utf8');
  content = content.replace('provider = "postgresql"', 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('Switched Prisma schema to SQLite (file:./dev.db)!');
} else {
  console.log('Usage: node scripts/switch-db.js [postgres|sqlite]');
}
