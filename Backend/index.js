//arquivo principal
//config inicial chamando os pacotes instalador
const express = require('express') //importando arquivos do node_modules
const mongoose = require('mongoose')
const cors = require('cors');


const app = express() //inicializando,executa o express como uma função 
app.use(cors());

//forma de ler JSON  - middlewares = recursos executados entre as requisições respostas
//agora ele consegue ler as respostar em json

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())




//ROTAS
const produtoRouter = require('./routes/produtoRoutes');
const adiminRouter = require('./routes/adiminRoutes');
const vendedorRouter = require('./routes/vendedorRoutes');
const carrinhoRouter = require('./routes/carrinhoRouter');

app.use('/produto', produtoRouter);
app.use('/adimin', adiminRouter);
app.use('/vendedor', vendedorRouter);
app.use('/carrinho', carrinhoRouter);

//express + metodo desejdo
app.get('/', (req, res) => {
    //consigo extrair os dados e enviar a resposta
    //requisição
    res.json({message: 'Oi express'})//a resposta para a minha  rota / vai ser json e vou enviar algo, json = objeto javascript , paramentro message
})//em react é necessario eu tratar  as respostas, verificar se veio parametro message e exibir a mensagem na tela  = CONECTAR AMBOS

