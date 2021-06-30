const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const socioRouter = require('./socioRouter');

// middleware para aceitar dados no formato json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.use('/', socioRouter);

app.listen(port, () => {

  console.log(`Servidor Node.js em execução...`)

})

// database socio_api
// table socios
