//arquivo principal
//config inicial chamando os pacotes instalador
const express = require('express') //importando arquivos do node_modules
const mongoose = require('mongoose')
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;//Heroku

// Configuração do middleware express.static para servir arquivos estáticos
const frontendPath = path.join(__dirname, '../Frontend');
app.use(express.static(frontendPath));


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

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


//conexão com o mongo
//mongodb+srv://vitoriaferreirap06:123456@cluster0.6puyj2y.mongodb.net/bancodaapi?retryWrites=true&w=majority
//ENTREGA UMA PORTA
//não quero iniciar a aplicação antes de se conectar com o banco de dados - conectando ao banco
const db_user = 'vitoria';
const db_password = encodeURIComponent('Romeu20');

mongoose
  .connect(`mongodb+srv://${db_user}:${db_password}@api.fajqg6b.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Conectou ao MongoDB");

  })
  .catch((err) => console.error(err));

