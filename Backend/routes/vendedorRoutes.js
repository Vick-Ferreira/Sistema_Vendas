const router = require ('express').Router()
const vendedorController = require('../controller/vendedorController');
const vendedor = require('../models/vendedor')

//Rotas para API - criando dados
router.post('/', vendedorController.createVendedor);

//Leitura dados (Listar todos)
router.get('/', vendedorController.buscarVendedor);

//(AUTENTICA O USE QUE ESTA FAZENDO LOGIN)
router.get('/', vendedorController.autenticar);

//Listagem com ID
router.get('/:id', vendedorController.buscarIdVendedor);

//Atualização
router.patch('/:id', vendedorController.atualizarVendedor);

//Deletar Vendedor
router.delete('/:id', vendedorController.deleteVendedor);





module.exports = router;
