const mongoose = require('mongoose')

const Carrinho = mongoose.model('Carrinho', {
    produtos: [{
        prodtudoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
        nome: String,
        preco: String,
        categoria: String,
        quantidade: Number // propriedade quantidade
    }]
});

module.exports = Carrinho;