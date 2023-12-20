const mongoose = require('mongoose')

const Adimin = mongoose.model('Adimin', {
    nome: String,
    senha: Number
})

module.exports = Adimin