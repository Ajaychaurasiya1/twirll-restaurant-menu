import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { findUserByEmail, emailExists, createUser } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDist = path.join(__dirname, '../client/dist')

const app = express()
const PORT = process.env.PORT || 3001

const TOKEN = 'cd7ea4a8293465160efa9945e896c4e94d26ce1ff2ad022229ccfc358fbddd4f'
const API_BASE = 'https://secureapi.twirll.com/businessinventory'
const LOCATION_ID = '2029'

app.use(cors())
app.use(express.json())

app.get('/api/menu', async (_req, res) => {
  try {
    const response = await fetch(
      `${API_BASE}/get_outlet_menu_items.json?access_token=${TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_location_id: LOCATION_ID,
          businessprofile_id: '1989',
          Output_information_type: 'ProductList',
        }),
      }
    )
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: 'Menu API error' })
    res.json(data.items || [])
  } catch {
    res.status(502).json({ error: 'Failed to fetch menu' })
  }
})

app.get('/api/menu/:productId', async (req, res) => {
  try {
    const response = await fetch(
      `${API_BASE}/${req.params.productId}/public_product_detail.json?access_token=${TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_location_id: LOCATION_ID }),
      }
    )
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: 'Product API error' })
    const product = Array.isArray(data) ? data[0] : data
    res.json(product)
  } catch {
    res.status(502).json({ error: 'Failed to fetch product' })
  }
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const user = findUserByEmail(email)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' })

  if (emailExists(email)) return res.status(409).json({ error: 'Email already registered' })

  const user = createUser(name, email, bcrypt.hashSync(password, 10), 'customer')

  res.status(201).json({
    user: { id: user.id, name, email, role: 'customer' },
  })
})

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
