require('dotenv').config()
const express = require('express')
const app = express()
const host = process.env.HOST;
const port = process.env.PORT;
const routers = require('./src/routes')
const morgan = require('morgan');
const path = require('path');

app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(morgan('common'));
app.use('/', routers);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));
app.listen(port, host, () => {
  console.log(`app running on http://${host}:${port}`);
});

module.exports = app
