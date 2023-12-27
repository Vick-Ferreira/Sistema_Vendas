const router = require('express').Router()
const carrinhoController = require('../controller/carrinhoController');
const Carrinho = require('../models/carrinho')

router.post('/', carrinhoController.createCarrinho);

router.get('/', carrinhoController.buscarProdutoCarrinho);

router.patch('/:id', carrinhoController.updateCarrinho);

router.delete('/:id', carrinhoController.deleteProdutoCarrinho);



module.exports = router;