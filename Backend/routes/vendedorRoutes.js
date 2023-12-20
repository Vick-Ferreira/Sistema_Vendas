const router = require ('express').Router()
const vendedorController = require('../controller/vendedorController');

//Rotas para API - criando dados
router.post('/', vendedorController.createVendedor);

//Leitura dados (Listar todos)
router.get('/', vendedorController.buscarVendedor);

//Listagem com ID
router.get('/:id', vendedorController.buscarIdVendedor);

//Atualização
router.patch('/:id', vendedorController.atualizarVendedor);

//Deletar Vendedor
router.delete('/:id', vendedorController.deleteVendedor);





module.exports = router;
