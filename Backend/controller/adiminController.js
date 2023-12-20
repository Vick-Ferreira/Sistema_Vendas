const Adimin = require('../models/adimin');

// Função para criar um administrador
exports.createAdimin = async (req, res) => {

    const { nome, senha } = req.body; //CORPO

    if (!nome) {
        return res.status(422).json({ error: 'O nome do administrador é obrigatório' });
    }

    const adimin = {
        nome,
        senha,
    };

    try {
        await Adimin.create(adimin);
        res.status(201).json({ message: 'Administrador adicionado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Função para listar adimin
exports.buscarAdimin = async (req, res) => {
    try{
        //comando mongopar alistagem
        const adimin = await Adimin.find()
        res.status(200).json(adimin)
    }catch(error) {
        res.status(500).json({json: error})
    }
}

//Função Listar ID unico
exports.buscarIdAdimin =  async ( req, res ) => {
    const id = req.params.id //url

    try{
        const adimin = await Adimin.findOne({_id: id})

        if(!Adimin){
            res.status(422).json({message: 'adimin não foi encontrado'})
            return
        }
        res.status(200).json(adimin) //listagem ("else")
    }catch(error){
        res.status(500).json({error: error})
    }

}

//Função para atualizar o adimin
exports.updateAdimin =  async (req, res) => {
    const id = req.params.id

    const {nome, senha } = req.body

    const adimin = {
        nome,
        senha
    }

    try{
        const updateAdimin = await Adimin.updateOne({_id: id}, adimin)

        if(updateAdimin.matchedCount === 0){
            res.status(422).json({ message: ' o adimin não foi encontrado'})
        }
        res.status(200).json(adimin)
    }catch{
        res.status(500).json({error: error})
    }
}

//Função para deletar adimin
exports.deleteAdimin =  async (req, res) => {
    const id = req.params.id

    if(!Adimin){
        res.status(422).json({message: ' não foi possivel excluir o adimin'})
        return
    }
    try{
        await Adimin.deleteOne({_id: id})
        res.status(200).json({message: 'Adimin excluido'})

    }catch(error){
        res.status(500).json({error:error})
    }
}