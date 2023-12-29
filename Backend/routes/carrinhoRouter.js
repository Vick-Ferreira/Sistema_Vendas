const router = require('express').Router()
const carrinhoController = require('../controller/carrinhoController');
const Carrinho = require('../models/carrinho')

router.post('/', carrinhoController.createCarrinho);

router.get('/', carrinhoController.buscarProdutoCarrinho);


//quero usar o id do produto que é um array dentro do doc carrinho que por sua vez também tem um id
router.patch('/:carrinhoId/:produtoId', carrinhoController.updateQuantidadeProduto);

router.delete('/:id', carrinhoController.deleteProdutoCarrinho);



module.exports = router;