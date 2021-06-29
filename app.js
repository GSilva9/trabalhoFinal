const express = require('express')
const app = express()

const socioRouter = require('./socioRouter');

// middleware para aceitar dados no formato json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.use('/', socioRouter);

app.listen(3000, () => {

  console.log(`Servidor Node.js em execução...`)

})

// database socio_api
// table socios