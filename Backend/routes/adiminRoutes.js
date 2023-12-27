const router = require('express').Router()
const Adimin = require('../models/adimin')
const adiminController = require('../controller/adiminController');


//Rotas API - criação de dados, buscam no controller os metodos

router.post('/', adiminController.createAdimin);

// (Listagem)
router.get('/', adiminController.buscarAdimin);

//(AUTENTICA O USE QUE ESTA FAZENDO LOGIN)
router.get('/', adiminController.autenticar);

//Listagem + id
router.get('/:id',  adiminController.buscarIdAdimin);

//atualização de elemento
router.patch('/:id', adiminController.updateAdimin);

//delete
router.delete('/:id', adiminController.deleteAdimin);

module.exports = router;