const express = require('express');
const router = express.Router();

const cors = require('cors');
router.use(cors())

const knex = require('./dbConfig');

// Tentando fazer o jwt funcionar
const jwt = require('jsonwebtoken');
const SECRET = 'socioapi123';
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  
    try {
      const socio = await knex('socio').orderBy('id_socio','desc')
      res.status(200).json(socio);
    } catch (error) {
      res.status(400).json({ msg: error.message});
    }
})

router.get('/socio', async (req, res) => {
  
    try {
      const socio = await knex('socio').orderBy('id_socio','desc')
      res.status(200).json(socio);
    } catch (error) {
      res.status(400).json({ msg: error.message});
    }
})

router.post('/socio', async (req, res) => {
    const { nome, cpf, email, senha, administrador } = req.body;
  
    if(!nome || !cpf || !email || !senha){
      res.status(400).json({msg: `Informe os dados corretamente` });
      return;
    }

    try {
      const dados = await knex('socio').where({ email })
      if (dados.length){
        res.status(203).json({ erro: 'E-mail já cadastrado'})
      }
    } catch (error) {
      res.status(203).json({ msg: error.message })
    }

    const hash = bcrypt.hashSync(senha, 10)

    try {
      const novo = await knex('socio').insert({ nome, cpf, email, senha: hash, administrador});
      res.status(201).json({ id: novo[0], nome: req.body['nome'], admin: req.body['administrador'] });
    } catch (error) {
      res.status(203).json({ msg: error.message });
    }
})

// DELETE
router.delete('/socio/:id_socio', async (req, res) => {     // para exclusão do registro com id informado
    const id_socio = req.params.id_socio                      // ou: const { id_socio } = req.params
    try {
      await knex('socio').del().where({ id_socio })      // ou: .where('id', id)
      res.status(200).json();
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
})

// UPDATE
router.put('/socio/:id_socio', async (req, res) => {        // para alteração do registro com id informado
    const id_socio = req.params.id_socio                     // ou: const { id_socio} = req.params
    const { nome } = req.body
    
    try {
      await knex('socio').update({ nome }).where({ id_socio })      // ou: .where('id', id)
      res.status(200).json();
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
})

// LOGIN COM TOKEN
router.post('/login', async (req, res) =>{
    const { email, senha } = req.body;
    if (!email || !senha){
      res.status(400).json({ erro: "Login ou senha incorretos." });
      return;
    }

    try {
      const dados = await knex('socio').where({ email });
      if (dados.length == 0){
        res.status(400).json({ erro: "Login ou senha incorretos." });
        return;
      }
      
      if (bcrypt.compareSync(senha, dados[0].senha)){
        const id = dados[0].id_socio;
        const token = jwt.sign( { id }, SECRET, { expiresIn: 3600} );
        const nome = dados[0].nome;
        res.status(201).json({ msg: "Login efetuado com sucesso", token, socio: dados[0] })
      } else {
        res.status(200).json({ msg: "Login ou senha incorretos." });
      }
    } catch (error){
      res.status(400).json({ erro: error.message });
    }
})

// Página dos planos
router.get('/planos', async (req, res) => { 
  try {
    const planos = await knex('plano').orderBy('id_plano','asc')
    res.status(200).json(planos);
  } catch (error) {
    res.status(400).json({ msg: error.message});
  }
})

router.post('/planos', async(req,res) => {
    const {id_plano, valor, descricao, nome, url_plano} = req.body
    try{
      const novoPlano = await knex('plano').insert({id_plano, valor, descricao, nome, url_plano})
      res.status(201).json({ novoPlano });

    }catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
)

// Pagamentos
router.get('/planos/pagamentos', async (req, res) => { 
  try {
    const pagamentos = await knex('pagamento').orderBy('id_socio','asc')
    res.status(200).json(pagamentos);
  } catch (error) {
    res.status(203).json({ msg: error.message});
  }
})

router.post('/planos/pagamentos', async (req, res) => {
  const { id_socio, id_plano, data_pagamento, status_pagamento } = req.body;
  try{
    const pagamento = await knex('pagamento').insert({id_socio, id_plano, data_pagamento, status_pagamento})
    res.status(201).json({ pagamento });

  }catch (error) {
    res.status(203).json({ msg: error.message });
  }
})

router.put('/planos/pagamentos', async (req, res) => {
  const { id_socio, id_plano, status_pagamento, data_pagamento } = req.body;
  try {
    await knex('pagamento').update({status_pagamento}).where({ id_socio, id_plano, data_pagamento })      
    res.status(201).json()
  } catch (error) {
    res.status(203).json({ msg: error.message })    
  }
})


router.get('/estatisticas', async (req, res) => {

  const planos =await knex ("pagamento")

  .select("pagamento.data_pagamento")
  .count("socio.id_socio as num")
  .leftOuterJoin("socio", "pagamento.id", "socio.id_socio")
  .groupBy("pagamento.data_pagamento")
  .having("num", ">", 0)

  res.status(200).json(planos);
})

module.exports = router;
