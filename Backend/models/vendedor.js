const mongoose = require('mongoose')

const Vendedor = mongoose.model('Vendedor', {
    nome: String,
    cpf: Number,
    categoria: String,
    senha: Number
})

module.exports = Vendedor