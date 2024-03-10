const main = document.getElementById('chamada_dinamica');

function carregarHTML(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            main.innerHTML = html;
        });
}
//chamando o html de getprodutos
linkVendedores.addEventListener('click', function (e) {
    e.preventDefault();
    carregarProduto();
});
function carregarProduto(){
    carregarHTML('../WEB/Produtos.html');
    getProdutosVendedor();
}


function getProdutosVendedor() {
    const chamadaDinamica = document.getElementById('categoria');  //pegando chamada dinamica do indexVendedor
    chamadaDinamica.innerHTML = ''; //limpando

    //adicionando no container a lista criada das categorias
    const listaCategoria = criarListaCategoria(); //conteudo categoria é o container no html
    chamadaDinamica.appendChild(listaCategoria);  //recebe criarLista


    fetch('http://localhost:3000/produto', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(data => {
            console.log('produtos', data);
            data.forEach(produto => {
                const card = cardProduto(produto);
                chamadaDinamica.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao listar produtos:', error);
        });
}
//criar uma lista para clicar em um link que chama produtos e lista dinamicamente na mesma pagina
//CRIANDO LISTA DE CATEORIAS
function criarListaCategoria() {
    const DivLista = document.createElement('div');
    DivLista.classList.add('DivLista');

    const ListaCategoria = document.createElement('ul');
    ListaCategoria.classList.add('ul');

    // Adicione os links de categoria dinamicamente
    const categorias = ['Refrigerante', 'Suco', 'Energetico', 'Cha']; // ou você pode buscar dinamicamente do seu backend
    categorias.forEach(categoria => { //loop
        const lista = document.createElement('li');
        lista.classList.add('li');
        const link = document.createElement('a');
        link.classList.add('link');
        link.textContent = categoria;
        link.id = `link${categoria}`;
        lista.appendChild(link);
        ListaCategoria.appendChild(lista);
        //  evento de clique para carregar os produtos da categoria quando o link for clicado
        link.addEventListener('click', function(e) {
            e.preventDefault();
            getProdutosPorCategoria(categoria);
        });
    });

    DivLista.appendChild(ListaCategoria);
    return DivLista;
}

//Minha função para listar produtos e suas categorias
function getProdutosPorCategoria(categoria) {
    const listagemDinamica = document.getElementById('listagemDinamica');
    listagemDinamica.innerHTML = '';

    fetch(`http://localhost:3000/produto/categoria/${categoria}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        console.log(`Produtos da categoria ${categoria} listados:`, data);

        data.forEach(produto => {
            const card = cardProduto(produto);
            listagemDinamica.appendChild(card);
        });
    })
    .catch(error => {
        console.error(`Erro ao listar produtos da categoria ${categoria}:`, error);
    });
}







// Link para o carrinho
linkCarrinho.addEventListener('click', function (e) {
    e.preventDefault();
    carregarGetCarrinho();
});

// Função para carregar a página carrinho.html
function carregarGetCarrinho() {
    carregarHTML('./web/carrinho.html');
    listarAoCarrinho();

}
//card produto vendedor
function cardProduto(produto) {
    const cards = document.createElement('div');
    cards.classList.add('card');

    const nomeProduto = document.createElement('p');
    nomeProduto.classList.add('nomeProduto');
    nomeProduto.innerHTML = produto.nome;

    const precoProduto = document.createElement('p');
    precoProduto.classList.add('precoProduto');
    precoProduto.innerHTML = produto.preco;

    const categoria = document.createElement('p');
    categoria.classList.add('categoria');
    categoria.innerHTML = produto.categoria;

    const btnAdicionar = document.createElement('button');
    btnAdicionar.innerHTML = 'Adicionar ao Carrinho';
    btnAdicionar.onclick = function () {
        carregarGetCarrinho()
        obterDetalhesProduto(produto._id); //IMPORTANTE: NÃO ESQUECER SE NECESSÁRIO RECUPERAR PARA USAR OS DADOS 
    }

    cards.appendChild(nomeProduto);
    cards.appendChild(precoProduto);
    cards.appendChild(categoria);
    cards.appendChild(btnAdicionar);

    return cards;
}

//VENDO DADOS DO CORPO DO PRODUTO
function obterDetalhesProduto(produtoId) {
    fetch(`http://localhost:3000/produto/${produtoId}`, {//VOU ATE PRODUTO E PEGO O ID JUNTO AOS DADOS DO PRODUTO ARMAZENANDO OS DETALHES DO PRODUTOS NO DATA
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        console.log('Detalhes do produto:', data);
        adicionarAoCarrinho(produtoId)//AO CHAMAR ADD CARRINHO  JÁ MANDAMOS O PRODUTO E OS DADOS
    })
    .catch(error => {
        console.error('Erro ao obter detalhes do produto:', error);
    });
}

function adicionarAoCarrinho(id, nome, preco, categoria) {
    const quantidade = 1;

    fetch(`http://localhost:3000/produto/${produtoId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            produtoId: id,
            nome: nome,
            preco: preco,
            categoria: categoria,
        }),
    })
    .then(resposta => {
        if (resposta.ok) {
            console.log('Produto adicionado ao carrinho com sucesso.');
        } else {
            console.error('Erro ao adicionar produto ao carrinho.');
        }
    })
    .catch(erro => {
        console.error('Erro ao adicionar produto ao carrinho:', erro);
    });
}



//LISTANDO PRODUTOS QUE ESTÃO NO CARRINHO
function listarAoCarrinho() {
    const carrinhoLista = document.getElementById('carrinho-lista');

    fetch('http://localhost:3000/carrinho', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        console.log('Dados do carrinho:', data);

        if (data && Array.isArray(data)) {//array de produto dentro do mue opbejto
            console.log('Produtos no carrinho:', data);
            carrinhoLista.innerHTML = ''; // Limpe o conteúdo atual da lista
            data.forEach(carrinho => {
                carrinho.produtos.forEach(produto => {
                    const cards = cardCarrinho(produto);
                    carrinhoLista.appendChild(cards);
                });
            });
        } else {
            console.log('Carrinho vazio ou dados ausentes.');
            carrinhoLista.innerHTML = 'Carrinho vazio';
        }
    })
    .catch(error => {
        console.error('Erro ao listar produtos no carrinho:', error);
    });
}
//O VENDEDOR SÓ PODE EXCLUIR DO CARRINHO OS PRODUTOS E NÃO VAI PODEM EXCLUIR DO SISTEMAS APENAS O ADMIN
function excluirProdutoCarrinho(id){
    
    fetch(`http://localhost:3000/carrinho/${id}`, {
        method: 'DELETE',
    }).then(res => {
        if(res.ok){
            console.log('produto excluido do carrinho')

        }else{
            console.log('erro ao excluir o produto')
        }
    })
    .catch(error => {
        console.error('Erro ao excluir produto:', error);
        // Adicione lógica adicional para tratamento de erro
    });
   

}
//card de listagem dentro do carrinho
function cardCarrinho(produto) {
    const cards = document.createElement('div');
    cards.classList.add('cards');

    const nomeProduto = document.createElement('p');
    nomeProduto.classList.add('nomeProduto');
    nomeProduto.innerHTML = produto.nome;

    const precoProduto = document.createElement('p');
    precoProduto.classList.add('precoProduto');
    precoProduto.innerHTML = produto.preco;

    const categoria = document.createElement('p');
    categoria.classList.add('categoria');
    categoria.innerHTML = produto.categoria;

    //campo de entrada para quantidade do produto no carrinho
    const quantidadeProduto = document.createElement('span');
    quantidadeProduto.classList.add('quantidadeProduto');
    quantidadeProduto.innerHTML = produto.quantidade || 1; // Valor padrão ou a quantidade atual do produto no carrinho

    const btnAumentarQuantidade = document.createElement('button');
    btnAumentarQuantidade.innerHTML = '+';
    btnAumentarQuantidade.onclick = function (e) {
        e.preventDefault();
        const produtoId = produto._id;
       // Obter a quantidade atual do span
       const quantidadeAtual = parseInt(quantidadeProduto.innerHTML, 10); 
       const novaQuantidade = quantidadeAtual + 1;   
        atualizarQuantidadeNoServidor(produtoId, novaQuantidade);
     };

    const btnDiminuirQuantidade = document.createElement('button');
    btnDiminuirQuantidade.innerHTML = '-';
    btnDiminuirQuantidade.onclick = function (e) {
        e.preventDefault();
        const produtoId = produto._id;
        // Obter a quantidade atual do span
        const quantidadeAtual = parseInt(quantidadeProduto.innerHTML, 10); 
        const novaQuantidade = Math.max(quantidadeAtual - 1, 1);
        atualizarQuantidadeNoServidor(produtoId, novaQuantidade);
    };

    const btnExcluir = document.createElement('a');
    btnExcluir.href='';
    btnExcluir.onclick = function(e){
        e.preventDefault();
        const produtoId = produto._id //TEMQUE TER!!!! IMPORTANTE: NÃO ESQUECER SE NECESSÁRIO RECUPERAR PARA USAR OS DADOS 
        excluirProdutoCarrinho(produtoId)
    };
    btnExcluir.innerHTML = 'Excluir do Carrinho';
        

    cards.appendChild(nomeProduto);
    cards.appendChild(precoProduto);
    cards.appendChild(categoria);
    cards.appendChild(quantidadeProduto);
    cards.appendChild(btnAumentarQuantidade);
    cards.appendChild(btnDiminuirQuantidade);
    cards.appendChild(btnExcluir);

    

    return cards;
}

function atualizarQuantidadeNoServidor(produtoId, novaQuantidade) {
    fetch(`http://localhost:3000/carrinho/produtos/${produtoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ novaQuantidade }),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Quantidade do produto atualizada no servidor:', data);
    })
    .catch(error => {
        console.error('Erro ao atualizar a quantidade do produto no servidor:', error);
    });
}





// Chame a função para obter os dados do carrinho e atualizar a quantidade do primeiro produto
obterDadosCarrinho();









linkVendedor.addEventListener('click', function(e){
    e.preventDefault();
    carregarLoginVendedor();
})
function carregarLoginVendedor() {
    carregarHTML('./web/loginVendedor.html', function () {
        main.addEventListener('submit', function (e) {
            // Verifica se é o formulário que queremos
            if (e.target && e.target.id === 'formulario_Loginvendedor') {
                e.preventDefault(); // Evita o comportamento padrão de envio do formulário
        
                // Restante do seu código aqui...
                const cpf = document.getElementById('cpf').value;
                const senha = document.getElementById('senha').value;
        
                // Campos não podem ser vazios
                if (!cpf || !senha) {
                    alert('Por favor, insira CPF e senha');
                    return;
                }
        
                fetch('http://localhost:3000/vendedor', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cpf, senha }),
                })
                .then(res => res.json())
                .then(data => {
                    const vendedorAutenticado = data.find(vendedor => vendedor.cpf === cpf && vendedor.senha === senha);
                    if (vendedorAutenticado) {
                        alert('Autenticação bem-sucedida!');
                    } else {
                        alert('CPF ou senha incorretos. Tente novamente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao autenticar:', error);
                });
            }
        });
        ;
    });
}


