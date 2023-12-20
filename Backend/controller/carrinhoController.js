const Carrinho = require('../models/carrinho');
const Produto = require('../models/produto')

// Criando produto com Multer
exports.createCarrinho = async (req, res) => {
    const { produtoId } = req.body;

    try {
        const produto = await Produto.findById(produtoId);

        if (!produto) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }

        const carrinho = await Carrinho.findOneAndUpdate(
            {}, // Você pode usar algum identificador do usuário aqui se necessário
            { $push: { produtos: { _id: produto._id, nome: produto.nome, preco: produto.preco, categoria: produto.categoria } } },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso', carrinho });
    } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error);
        res.status(500).json({ error: error });
    }
};
exports.buscarProdutoCarrinho = async (req, res) => {
    try{
        const produto = await Carrinho.find() //await (aguarda banco) (find - comando mongo)
        res.status(200).json(produto)
    }catch(error) {
     res.status(500).json({json: error})
    }
}
exports.deleteProdutoCarrinho = async (req, res) => {
    const id = req.params.id;
    try {
        const carrinho = await Carrinho.findOneAndUpdate({}, { $pull: { produtos: { _id: id } } }, { new: true });
        if (carrinho) {
            res.status(200).json({ message: 'Produto removido' });
        } else {
            res.status(422).json({ message: 'O produto não foi encontrado no carrinho' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
//Carrinho.findOneAndUpdate é usado para remover o produto do array produtos dentro do documento de carrinho
