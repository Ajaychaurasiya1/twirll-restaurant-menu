import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import { seedUsers } from './seedUsers.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'users.json')

function loadUsers() {
  if (!fs.existsSync(dbPath)) {
    const users = seedUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: bcrypt.hashSync(u.password, 10),
      role: u.role,
    }))
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2))
    console.log(`Seeded ${users.length} users`)
    return users
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'))
}

function saveUsers(users) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2))
}

let users = loadUsers()

export function findUserByEmail(email) {
  return users.find((u) => u.email === email) || null
}

export function emailExists(email) {
  return users.some((u) => u.email === email)
}

export function createUser(name, email, passwordHash, role = 'customer') {
  const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1
  const user = { id, name, email, password: passwordHash, role }
  users.push(user)
  saveUsers(users)
  return user
}
