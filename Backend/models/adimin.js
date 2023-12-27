const mongoose = require('mongoose')

const Adimin = mongoose.model('Adimin', {
    nome: String,
    senha: String,
})

module.exports = Adimin