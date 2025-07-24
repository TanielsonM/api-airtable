import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express()
app.use(cors())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5
})

app.get('/verifica-email', async (req, res) => {
  const email = req.query.email
  if (!email) return res.status(400).json({ erro: 'Email obrigatório' })

  try {
    const [rows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email])
    res.json({ existe: rows.length > 0 })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao consultar o banco', detalhe: err.message })
  }
})

app.get('/', (req, res) => {
  res.send('API OK')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`))
