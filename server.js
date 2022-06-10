const express = require('express')
const morgan = require('morgan')

const app = express()

// morgan HTTP request 기록해주는 미들웨어
app.use(morgan('dev'))

const PORT = process.env.PORT || 3333
app.listen(PORT)