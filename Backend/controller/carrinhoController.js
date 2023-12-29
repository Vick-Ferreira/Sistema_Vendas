const Carrinho = require('../models/carrinho');
const Produto = require('../models/produto')

// Criando produto com Multer
exports.createCarrinho = async (req, res) => {
    const { produtoId, nome, preco, categoria } = req.body;

    try {
        const carrinho = await Carrinho.findOne({ 'produtos.produtoId': produtoId });

        if (carrinho) {
            // Se o produto já estiver no carrinho, atualize a quantidade
            await Carrinho.updateOne(
                { 'produtos.produtoId': produtoId },
                { $inc: { 'produtos.$.quantidade': 1 } }
            );
        } else {
            // Se o produto não estiver no carrinho, insira um novo documento
            await Carrinho.create({ produtos: [{ produtoId, nome, preco, categoria, quantidade: 1 }] });
        }

        res.status(200).send('Produto adicionado ao carrinho com sucesso.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao adicionar produto ao carrinho.');
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
exports.updateQuantidadeProduto = async (req, res) => {
    const carrinhoId = req.params.id;
    const produtoId = req.params.produtoId;
    const novaQuantidade = req.body.novaQuantidade;

    try {
        console.log('Tentando encontrar o carrinho com o ID:', carrinhoId);
        const carrinho = await Carrinho.findById(carrinhoId);

        if (!carrinho) {
            console.error('Carrinho não encontrado. ID do Carrinho:', carrinhoId);
            return res.status(404).json({ message: 'Carrinho não encontrado.' });
        }

        console.log('Carrinho encontrado. ID do Carrinho:', carrinhoId);

        // Encontrar o produto pelo _id
        console.log('Tentando encontrar o produto no carrinho com o ID:', produtoId);
        const produtoParaAtualizar = carrinho.produtos.find(produto => produto._id.toString() === produtoId);

        if (!produtoParaAtualizar) {
            console.error('Produto não encontrado no carrinho. ID do Produto:', produtoId);
            return res.status(404).json({ message: 'Produto não encontrado no carrinho.' });
        }

        console.log('Produto encontrado no carrinho. ID do Produto:', produtoId);

        // Restante do código...

    } catch (error) {
        console.error('Erro ao atualizar a quantidade do produto:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar a quantidade do produto.' });
    }
};



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
