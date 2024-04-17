const chalk = require('chalk');
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true })) // 解析键值对
app.use(express.json()); // 解析json
app.use(cors()); // 跨域
require('./models/index');

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/code',require('./api/code'))
app.use('/api/project',require('./api/project'))
app.use('/api/monitor',require('./api/monitor'))

app.listen(port, () => {
  console.log(`服务端口:`,chalk.underline.cyan(`http://localhost:${port}`))
})