const express = require('express')
const cors = require('cors')
const apiRoutes = require('./routes/apiRoutes')
const rentalsRoutes = require('./routes/rentalsRoutes')
const inquiriesRoutes = require('./routes/inquiriesRoutes')

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.json({
    message: 'Rental Scout API is running',
  })
})

app.use('/api', apiRoutes)
app.use('/api/rentals', rentalsRoutes)
app.use('/api/inquiries', inquiriesRoutes)

app.listen(PORT, () => {
  console.log(`Rental Scout API running at http://localhost:${PORT}`)
})
