const mongoose = require('mongoose')

const Produto = mongoose.model('Produto', {
    nome: String,
    preco: String,
    categoria: String
  
});//criando tabela e dados que o banco ira receber


module.exports = Produto