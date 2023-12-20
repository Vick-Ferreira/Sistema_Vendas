const Vendedor = require('../models/vendedor')

exports.createVendedor =  async (req, res) => {

    //req.body
    const {nome , cpf, categoria,  senha } = req.body //corpo do meu objeto

    const vendedor = {
        nome,
        cpf,
        categoria,
        senha
    }

    //criação de USER no mongo
    try{
        await Vendedor.create(vendedor)
        res.status(201).json({message: 'Usuário cadastrado'})

    }catch(error) {
      res.status(500).json({json: error})
    }
}
exports.buscarVendedor =  async (req, res) => {
    try{
     const vendedor = await Vendedor.find() 
     res.status(200).json(vendedor)
    }catch(error){
        res.status(500).json({json: error})
    }
}
exports.buscarIdVendedor = async (req, res) => {
    const id = req.params.id  

    try{
        const vendedor = await Vendedor.findOne({_id: id})//_id mongo
      //verificação de campo
      if(!Vendedor){
        res.status(422).json({message: 'Vendedor não encontrado'})
        return
      }
      res.status(200).json(vendedor) //IMPORTANTE :  CHAMA ID ESPECIFICO DANDO TUDO OK
    }catch(error){
      res.status(500).json({error: error})
    }
}
exports.atualizarVendedor = async (req, res) => {
    const id = req.params.id
    const {nome, cpf, categoria, senha} = req.body //corpo

    const vendedor = {
        nome,
        cpf,
        categoria,
        senha
    }

    try{ //atualizando e mandando atualização salva
        const updateVendedor = await Vendedor.updateOne({ _id: id}, vendedor)

        //verificação
        if(updateVendedor.matchedCount === 0){ //se não houver o que atualizar
            res.status(422).json({message: 'o vendedor não foi encontrado'})
        }
        res.status(200).json(vendedor) //se não atualiza

    }catch(error){
        res.status(500).json({error:error})
    }
}
exports.deleteVendedor = async (req, res ) => {
    const id = req.params.id //pegando id que veio na URL

    //verificação
    if(!Vendedor){
        res.status(422).json({ message: 'O vendedor não foi encontrado'})
    return
    }
    try{
        await Vendedor.deleteOne({_id: id})
        res.status(200).json({message: 'Vendedor removido'})
    }catch(error){
        res.status(500).json({error : error})
    }


}