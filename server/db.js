import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { seedUsers } from './seedUsers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'users.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer'
  )
`)

const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c
if (count === 0) {
  const insert = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)')
  const tx = db.transaction((users) => {
    for (const u of users) {
      insert.run(u.id, u.name, u.email, bcrypt.hashSync(u.password, 10), u.role)
    }
  })
  tx(seedUsers)
  console.log(`Seeded ${seedUsers.length} users`)
}

export default db
