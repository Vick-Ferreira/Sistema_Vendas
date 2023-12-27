const mongoose = require('mongoose')

const Carrinho = mongoose.model('Carrinho', {
    produtos: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
        nome: String,
        preco: String,
        categoria: String,
        quantidade: String // propriedade quantidade
    }]
});

module.exports = Carrinho;