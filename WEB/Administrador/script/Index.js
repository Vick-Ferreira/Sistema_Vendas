const main = document.querySelector('#conteudo'); //id pega todo o conteudo que foi desmenbrado do index.html
const conteudoCategoria = document.getElementById('conteudoCategoria');


linkCadastrarProdutos.addEventListener('click', function (e) {
    e.preventDefault();
    carregarCadastrarProdutos();
});

getProdutos();

/*IMPORTANTE LEMBRAS: QUANDO CARREGAMOS PAGINAS DINAMICAS E TRABALHAMOS COM EVENTOS DE CLICK, JS PRECISA AGURDA HTML ESTAR REALMENT NO DOM

-adicionar um ouvinte de eventos diretamente ao formulário 
(meuFormulario), que pode não existir no momento em que o 
script é carregado, você adiciona o ouvinte de eventos ao
 elemento pai (main) que já está presente no DOM.*/

 function carregarCadastrarProdutos() {
    carregarHTML('../WEB/cadastroProduto.html', function () {
        main.addEventListener('submit', function (e) {
            if (e.target && e.target.id === 'formulario_produto') {
                e.preventDefault();

                const nome = document.getElementById('nome').value;
                const preco = document.getElementById('preco').value;
                const categoriasRadio = document.querySelectorAll('[name="categoria"]:checked');
                const categorias = Array.from(categoriasRadio).map(radio => radio.value);

                const produto = {
                    nome: nome,
                    preco: preco,
                    categoria: categorias.join(','), //CORBO BANCO/REQUISIÇÃO
                };

                fetch('http://localhost:3000/produto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(produto),
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Produto adicionado:', data);

                    //LIMPANDO INPUTS
                    const meuFormulario = document.getElementById('formulario_produto');
                    if(meuFormulario){
                        meuFormulario.reset();
                    }else{
                        console.error('Formulário não encontrado!');
                    }
                })
                .catch(error => {
                    console.error('Erro ao adicionar produto:');
                });
            }
        });
    });
}

/*IMPORTANTE LEMBRAS: QUANDO CARREGAMOS PAGINAS DINAMICAS E TRABALHAMOS COM EVENTOS DE CLICK, JS PRECISA AGURDA HTML ESTAR REALMENT NO DOM

Lembrar uso callback - O callback é útil quando você quer executar ações adicionais após o HTML
ser inserido no DOM. Se  houver a necessidade de executar mais código após o carregamento do HTML, 
assim como fiz na requisição de cima, para o carregamento da pagina de cadatro e manipulação
dos eventos do formulario*/

function carregarHTML(url, callback) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            main.innerHTML = html;
            console.log('HTML de Produtos carregado com sucesso!');
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Erro ao carregar HTML:', error);
        });
}



//ADIMIN CADASTRANDO E LISTANDO , EDITANDO E EXCLUINDO VENDEDOR 
linkCadastrarVendedores.addEventListener('click', function (e) {
    e.preventDefault();
    carregarCadastrarVendedores();
});

function carregarCadastrarVendedores() {
    carregarHTML('./cadastroVendedor.html', function () {
     //carrega o html de cadastroVendedores 
        
        main.addEventListener('submit', function (e) {
            //delegação de evento, necessario para manipular elementos para serem carregador de forma dinamica
            //verifica se o formulário com o ID 'formulario_produto' foi o alvo do evento. Se sim executa
            if (e.target && e.target.id === 'formulario_vendedor') {//IMPORTANTE
                e.preventDefault();

                // RECUPERANDO DADOS
                const nome = document.getElementById('nome').value;
                const cpf = document.getElementById('cpf').value;
                const senha = document.getElementById('senha').value;
                const categoriaCidadesRadio = document.querySelectorAll('[name="categoria"]:checked');
                const categorias = Array.from(categoriaCidadesRadio).map(radio => radio.value);

                const vendedor = {
                    nome: nome,
                    cpf: cpf,
                    senha: senha,
                    categoria: categorias.join(','), //CORBO BANCO/REQUISIÇÃO
                };

                fetch('http://localhost:3000/vendedor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(vendedor),
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Vendedor adicionado:', data);

                    //LIMPANDO INPUTS
                    const meuFormulario = document.getElementById('formulario_vendedor');
                    if(meuFormulario){
                        meuFormulario.reset();
                    }else{
                        console.error('Formulário não encontrado!');
                    }
                })
                .catch(error => {
                    console.error('Erro ao adicionar produto:', error);
                });
            }
        });
    });
}
function editarVendedor(id){
    fetch("../web/editarVendedor.html")
    .then(res => res.text())
    .then(html => {
        main.innerHTML = html  //se resposta OK  renderiza html
    
        //hora de recuperar os dados para a edição 
        fetch('http://localhost:3000/vendedor/' + id)
        .then(res => res.json()  //da para fazer verificação de se if (!res.ok ) = se for diferente que ok (erro ao recuperar dados)
        .then(vendedor => {
            const inputId = document.getElementById('id');
            const inputNome = document.getElementById('nome')
            const inputCpf = document.getElementById('cpf');
            const inputSenha = document.getElementById('senha');
            const categoriaRadio = document.querySelector('[name="categoria"]');

            if(inputId && inputNome && inputSenha) {
                inputId.value = vendedor._id
                inputNome.value = vendedor.nome //aqui pegamos o vamor que recuperam a cima na constante e renderizamos o valor que esta dentro dele
                inputSenha.value = vendedor.senha
                inputCpf.value = vendedor.cpf
                categoriaRadio.checked = true;

                const btnSalvar = document.getElementById('salvarVendedor');
                btnSalvar.onclick = function(e) {
                    e.preventDefault();
                    //evendo click

                    const dadosAtualizados = {
                        "nome": inputNome.value,
                        "senha": inputSenha.value,
                        "cpf": inputCpf.value,
                        "categoria": document.querySelector('input[name="categoria"]:checked').value
                    }

                    //atualização dos dados de fato 
                    //corpo
                    const header = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dadosAtualizados)         
                    };

                     fetch("http://localhost:3000/vendedor/" + id, header)//atualizando vendedor pegando o id, os novos dados e seu header
                     .then(() => {
                        carregarVendedores();
                     })
                     .catch(error => {
                        console.error('erro ao atuaalizar vendedor')
                     })
                }
            }

            const btnCancelar = document.getElementById('cancelarVendedor');
                btnCancelar.onclick = function (e){
                    e.preventDefault();
                    carregarVendedores();
                }
        })
        )
    })
}

function excluirVendedor(id) {
    fetch(`http://localhost:3000/vendedor/${id}` , {
        method: 'DELETE',
    }).then(res => {
        if(res.ok){
            console.log('vendedor excluido')
            getVendedores();
        }else{
            console.log('erro ao excluir vendedor')
        }
    })
    .catch(error => {
        console.error('Erro ao excluir vendedor:', error);
        // Adicione lógica adicional para tratamento de erro
    });
   
}



//CHAMANDO HTML
linkVendedores.addEventListener('click', function (e) {
    e.preventDefault();
   carregarVendedores();
} )

function  carregarVendedores() {
    carregarHTML('./Vendedores.html');
    getVendedores();
}
function getVendedores() {

    const listagemDinamica = document.getElementById('listagemDinamica'); //recuperando elemento html
     listagemDinamica.innerHTML = '';


 fetch('http://localhost:3000/vendedor', {
     method: 'GET',
     headers: {
         'Content-Type': 'application/json',
     },
 })
 .then(res => res.json())
 .then(data => {
     console.log('Vendedores listados:', data);
     // criar um card e adicioná-lo à seção
     data.forEach(vendedor => {
         const card = criarCardVendedor(vendedor);
         listagemDinamica.appendChild(card); // Adicione o a cada produto
     });
 })
 .catch(error => {
     console.error('Erro ao listar produtos:', error);
 });
}
 //criando card VENDEDOR
 function  criarCardVendedor(vendedor){ //não esquecer do argumento para recuperar dados de forma dinamica
     
     const card = document.createElement('div');
     card.classList.add('card');

     const nomeVendedor = document.createElement('p');
     nomeVendedor.classList.add('nomeVendedor');
     nomeVendedor.innerHTML = (vendedor.nome);

     const cpfVendedor = document.createElement('p');
     cpfVendedor.classList.add('cpfVendedor');
     cpfVendedor.innerHTML =  (vendedor.cpf);

     const senhaVendedor = document.createElement('p');
     senhaVendedor.classList.add('senhaVendedor');
     senhaVendedor.innerHTML =  (vendedor.senha);


     const Categoria = document.createElement('p');
     Categoria.classList.add('categoria');
     Categoria.innerHTML = (vendedor.categoria);


     const aExcluir = document.createElement('a');
     aExcluir.href='',
     
     aExcluir.onclick = function(e){
         e.preventDefault();
         const vendedorId = vendedor._id;
         excluirVendedor(vendedorId)
     }
     aExcluir.innerHTML = 'Excluir'

     const aEditar = document.createElement('a');
     aEditar.href='',
     aEditar.onclick = function(e){
         e.preventDefault();
         const vendedorId = vendedor._id;
         console.log('ID do produto ao clicar em Editar:', vendedor._id);
         editarVendedor(vendedorId)//carrega o id
     }
     aEditar.innerHTML = 'Editar'


     card.appendChild(nomeVendedor);
     card.appendChild(cpfVendedor);
     card.appendChild(senhaVendedor);
     card.appendChild(Categoria);
     card.appendChild(aExcluir);
     card.appendChild(aEditar);


     return card;

}





//ADIMIN CADASTRANDO LISTANDO EDITANDO E EXLUINDO PRODUTOS
linkProdutos.addEventListener('click', function (e) {
    e.preventDefault();
    carregarProdutos();
  
} )
function carregarProdutos() {
    carregarHTML('../WEB/Produtos.html');
    getProdutos();
}
//CRUD
//chamando aqui para listar as ja existentes no banco assim que abre a pagina
// Função para listar os produtos
function getProdutos() {
 // Limpar a seção antes de adicionar os novos produtos
    const listagemDinamica = document.getElementById('listagemDinamica'); //recuperando elemento html
     listagemDinamica.innerHTML = '';

 // Listar produtos
 fetch('http://localhost:3000/produto', {
     method: 'GET',
     headers: {
         'Content-Type': 'application/json',
     },
 })
 .then(res => res.json())
 .then(data => {
     console.log('Produtos listados:', data);
     // Para cada produto, criar um card e adicioná-lo à seção
     data.forEach(produto => {
         const card = criarCardProjetos(produto);
         listagemDinamica.appendChild(card); // Adicione o a cada produto
     });
 })
 .catch(error => {
     console.error('Erro ao listar produtos:', error);
 });
}
 //criando card
function criarCardProjetos(produto) {
    const card = document.createElement('div');
    card.classList.add('card');

    
    const NomeProduto = document.createElement('p');
    NomeProduto.classList.add('nomeProduto');
    NomeProduto.innerHTML = produto.nome;

    const PrecoProduto = document.createElement('p');
    PrecoProduto.classList.add('precoProduto');
    PrecoProduto.innerHTML = `Preço: R$ ${produto.preco}`;

    const Categoria = document.createElement('p');
    Categoria.classList.add('categoria');
    Categoria.innerHTML = produto.categoria;

    const aExcluir = document.createElement('a');
    aExcluir.href = '';
    aExcluir.onclick = function (e) {
        e.preventDefault();
        const produtoId = produto._id;
        excluirProduto(produtoId);
    };
    aExcluir.innerHTML = 'Excluir';

    const aEditar = document.createElement('a');
    aEditar.href = '';
    aEditar.onclick = function (e) {
        e.preventDefault();
        const produtoId = produto._id;
        console.log('ID do produto ao clicar em Editar:', produto._id);
        editarProduto(produtoId);
    };
    aEditar.innerHTML = 'Editar';

    card.appendChild(NomeProduto);
    card.appendChild(PrecoProduto);
    card.appendChild(Categoria);
    card.appendChild(aExcluir);
    card.appendChild(aEditar);

    return card;
}


function editarProduto(id) {
    fetch("../web/editarProduto.html")
    .then(res => res.text())
    .then(html => {
        main.innerHTML = html

        fetch('http://localhost:3000/produto/'+ id)
        .then(res => res.json()
        .then(produto => {
            const inputId = document.getElementById('id');
            const inputNome = document.getElementById('nome');
            const inputPreco = document.getElementById('preco');
            const categoriaRadio = document.querySelector('[name="categoria"]');

            if(inputNome && inputId && inputPreco){
                inputId.value = produto._id
                inputNome.value = produto.nome
                inputPreco.value = produto.preco
                categoriaRadio.checked = true;

                const btnSalvar = document.getElementById('salvarProdutos');
                btnSalvar.onclick = function (e){
                    e.preventDefault();

                    //atualização - corpo da requisição para atualizar
                    const dadosAtualizados = {
                        "nome": inputNome.value,
                        "preco": inputPreco.value,
                        "categoria": document.querySelector('input[name="categoria"]:checked').value
                    }
                        const header = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dadosAtualizados)
                    };
                    fetch("http://localhost:3000/produto/" + id, header)
                    .then(() => {
                        carregarProdutos();
                    })
                    .catch(error => {
                        console.error('erro ao atualizar produto')
                    })
                }
            }
            const btnCancelar = document.getElementById('cancelarProduto')
            btnCancelar.onclick = function (e){
                e.preventDefault();
                carregarProdutos();
            }
        }))
    })
}

function excluirProduto(id) {
 fetch(`http://localhost:3000/produto/${id}` , {
     method: 'DELETE',
 }).then(res => {
     if(res.ok){
         console.log('produto excluido')
         getProdutos();
     }else{
         console.log('erro ao excluir porduto')
     }
 })
 .catch(error => {
     console.error('Erro ao excluir produto:', error);
     // Adicione lógica adicional para tratamento de erro
 });

}











//redirecionando por categoria e renderizando por ordem os html

//refri
linkRefrigerante.addEventListener('click', function (e) {
    e.preventDefault(); // Evita que o link recarregue a página
    carregarRefrigerante();
});
function carregarRefrigerante() {
    carregarHTML('../categorias/refrigerante.html');
    getProdutosPorCategoria('Refrigerante'); // Passa a categoria desejada como argumento
}
//suco
linkSuco.addEventListener('click', function (e) {
    e.preventDefault();
    carregarSuco();
});
function carregarSuco() {
    carregarHTML('../categorias/suco.html');
    getProdutosPorCategoria('Suco');
}
//energetico
linkEnergetico.addEventListener('click', function (e) {
    e.preventDefault();
    carregarEnergetico();
});
function carregarEnergetico() {
    carregarHTML('../categorias/energetico.html');
    getProdutosPorCategoria('Energetico');
}
//chas
linkCha.addEventListener('click', function (e) {
    e.preventDefault();
    carregarCha();
});
function carregarCha() {
    carregarHTML('../categorias/cha.html');
    getProdutosPorCategoria('Cha');
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
            const card = criarCardProjetos(produto);
            listagemDinamica.appendChild(card);
        });
    })
    .catch(error => {
        console.error(`Erro ao listar produtos da categoria ${categoria}:`, error);
    });
}

