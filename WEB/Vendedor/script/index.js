const main = document.getElementById('chamada');

function carregarHTML(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            main.innerHTML = html;
        });
}

linkVendedores.addEventListener('click', function (e) {
    e.preventDefault();
    carregarGetProdutos();
});

function carregarGetProdutos() {
    carregarHTML('./web/getProdutos.html');
    getProdutosVendedor();
}

function getProdutosVendedor() {
    const chamadaDinamica = document.getElementById('chamada_dinamica');
    if (!chamadaDinamica) {
        console.error('Elemento chamada_dinamica não encontrado.');
        return;
    }
    chamadaDinamica.innerHTML = '';

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
                const cards = cardProduto(produto);
                chamadaDinamica.appendChild(cards);
            });
        })
        .catch(error => {
            console.error('Erro ao listar produtos:', error);
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

function cardProduto(produto) {
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
//ADICIONANDO PRODUTO NA COLLECTION CARRINHO
function adicionarAoCarrinho(produtoId) {
    fetch('http://localhost:3000/carrinho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ produtoId }),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Produto adicionado ao carrinho:', data);
        listarAoCarrinho();
    })
    .catch(error => {
        console.error('Erro ao adicionar produto ao carrinho:', error);
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
        atualizarQuantidadeCarrinho(produtoId, 1, quantidadeProduto);
    };

    const btnDiminuirQuantidade = document.createElement('button');
    btnDiminuirQuantidade.innerHTML = '-';
    btnDiminuirQuantidade.onclick = function (e) {
        e.preventDefault();
        const produtoId = produto._id;
        atualizarQuantidadeCarrinho(produtoId, -1, quantidadeProduto);
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


function atualizarQuantidadeCarrinho(produtoId) {
    console.log('Produto ID:', produtoId);
        fetch(`http://localhost:3000/carrinho/${produtoId}`)
        .then(res => res.json())
        .then(data => {
            const inputId = document.getElementById('id');
            
        })

        const btnSalvar = document.getElementById('finalizar_compra');
        btnSalvar.onclick = function(e){
            e.preventDefault();

            const atualizarDados = {
                "nome": inputNome.value,
                "senha": inputSenha.value
            }
        }
        const header ={
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(atualizarDados)
    };

    fetch(`http://localhost:3000/carrinho/${produtoId}`, header)
    .then(() => {
        carregarGetCarrinho
    })
    .catch(error => {
        console.error('error ao atualizar')
    })
}


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


