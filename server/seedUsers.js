const firstNames = [
  'Priya', 'Rahul', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Kavya', 'Rohan',
  'Meera', 'Aditya', 'Isha', 'Karan', 'Divya', 'Nikhil', 'Pooja', 'Sanjay',
  'Neha', 'Amit', 'Riya', 'Suresh', 'Lakshmi', 'Deepak', 'Anjali', 'Manish',
  'Shreya', 'Rajesh', 'Tanvi', 'Gaurav', 'Nisha', 'Vivek', 'Swati', 'Harish',
  'Preeti', 'Ashok', 'Simran', 'Varun', 'Kritika', 'Pradeep', 'Aarti', 'Sunil',
  'Bhavna', 'Mohit', 'Jyoti', 'Rakesh', 'Sonal', 'Anil', 'Rekha', 'Pankaj',
  'Usha', 'Dinesh',
]

const lastNames = [
  'Sharma', 'Mehta', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Joshi',
  'Nair', 'Iyer', 'Desai', 'Verma', 'Agarwal', 'Malhotra', 'Kapoor', 'Chopra',
  'Bose', 'Das', 'Rao', 'Pillai', 'Menon', 'Saxena', 'Tiwari', 'Mishra',
  'Pandey', 'Shah', 'Jain', 'Banerjee', 'Ghosh', 'Mukherjee', 'Kulkarni',
  'Naik', 'Shetty', 'Fernandes', 'D\'Souza', 'Thomas', 'George', 'Mathew',
  'Philip', 'Joseph', 'Anthony', 'Rodrigues', 'Pereira', 'Costa', 'Lobo',
  'D\'Cruz', 'Mendes', 'Almeida', 'Pinto', 'Gomes',
]

function randomPassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let pwd = ''
  for (let i = 0; i < 10; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
  return pwd
}

export const seedUsers = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1
  if (id === 1) {
    return { id: 1, name: 'Priya Sharma', email: 'priya@demo.com', password: 'Hgyfgyt67', role: 'customer' }
  }
  if (id === 2) {
    return { id: 2, name: 'Rahul Mehta', email: 'rahul@demo.com', password: 'kgtfrdyt67', role: 'customer' }
  }
  const name = `${firstNames[i]} ${lastNames[i]}`
  const email = `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}${id}@demo.com`
  return { id, name, email, password: randomPassword(), role: 'customer' }
})
