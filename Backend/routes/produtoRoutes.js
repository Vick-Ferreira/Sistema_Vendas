const router = require('express').Router()
const produtoController = require('../controller/produtoController')
const Produto = require('../models/produto')

// Rota para criar produtos
router.post('/', produtoController.createProduto);

//Leitura de dados
router.get('/', produtoController.buscarProduto);

router.get('/:id', produtoController.buscarIdProduto);

//rota para ramificar as minhas categorias para suas determinadas paginas
router.get('/categoria/:categoria', produtoController.categorias);

//Atualização  (PUT - COMPLETO , PATCH - PARCIAL)
router.patch('/:id', produtoController.updateProduto);

//Delete
router.delete('/:id', produtoController.deleteProduto);

module.exports = router