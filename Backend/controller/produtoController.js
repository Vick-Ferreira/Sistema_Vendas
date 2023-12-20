const Produto = require ('../models/produto'); //modal onde tem os tipos de dados que seram enviados e recebidos

//filtrando categorias
exports.categorias = async (req, res) => {
    const categoria = req.params.categoria;

    try {
        // Encontrar todos os produtos que têm a categoria desejada
        const produtos = await Produto.find({ categoria: categoria });

        // Enviar os produtos encontrados como resposta
        res.json(produtos);
    } catch (error) {
        // Lidar com erros
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
};

// Criando produto com Multer
exports.createProduto =  async (req, res) => {
    // req.body
    const { nome, preco, categoria } = req.body;

    if (!nome) {
        res.status(422).json({ error: 'O nome é obrigatório' });
        return;
    }

    const produto = {
        nome,
        preco,
        categoria,
    };

    //create do mongoose, use try-catch para erros
    try {
        //criando dados (objeto do produto)
        await Produto.create(produto); //salva dados
        res.status(201).json({ message: 'Produto inserido com sucesso' });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: error });
    }
}

//listagem
exports.buscarProduto = async (req, res) => {
    try{
        const produto = await Produto.find() //await (aguarda banco) (find - comando mongo)
        res.status(200).json(produto)
    }catch(error) {
     res.status(500).json({json: error})
    }
}

//listagem + id
exports.buscarIdProduto =  async (req, res) => {
    const id = req.params.id
    try{
        const produto = await Produto.findOne({_id: id}) //encontrar o _id = id que vem da requisição
        
    if(!Produto){
        res.status(422).json({ message: 'o produto não foi encontrado'})
        return
    }
     res.status(200).json(produto)
    }catch(error){
        res.status(500).json({error : error})
    }
}
//atualização
exports.updateProduto = async (req , res) => {
    const id = req.params.id //id vem com a url
    const {nome, preco, categoria } = req.body //junto ao corpo do elemento

    const produto = {
        nome,
        preco,
        categoria
    }
    try { //atualiza, salva, e retorna dado atualizado
        const updateProduto = await Produto.updateOne({ _id : id} , produto) //dado atualizado

        if (updateProduto.matchedCount === 0 ){
            res.status(422).json({ message: 'o produto não foi encontrado'})
        }

        res.status(200).json(produto)
    }catch(error) {
        res.status(500).json({error : error})
    }
}

//delete
exports.deleteProduto = async (req, res) => {
    const id = req.params.id//a requisição tras o id

    if(!Produto){
        res.status(422).json({ message: 'o produto não foi encontrado'})
        return
    }

    try{
        await Produto.deleteOne({_id: id})
        res.status(200).json({ message: 'Usuario removido'})
    }catch(error){
        res.status(500).json({error : error})
    }
}
