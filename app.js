const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const app = express()
app.use(compression())
app.use(express.static(path.resolve(__dirname, './dist')))
app.get('*', function(req, res) {
  const html = fs.readFileSync(
    path.resolve(__dirname, './dist/index.html'),
    'utf-8'
  )
  res.send(html)
})
app.listen(5310)
