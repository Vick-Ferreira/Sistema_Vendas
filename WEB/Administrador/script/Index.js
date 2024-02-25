const main = document.querySelector('#conteudo'); //id pega todo o conteudo que foi desmenbrado do index.html
const conteudoCategoria = document.getElementById('conteudoCategoria');

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
carregarLogin();

function carregarLogin() {
    carregarHTML('./telaLogin.html', function() {
        main.addEventListener('submit', function(e) {
            // Verifica se é o formulário que estamos procurando
            if (e.target && e.target.id === 'formulario_Loginadimin') {
                e.preventDefault();

                const nome = document.getElementById('nome').value;
                const senha = document.getElementById('senha').value;

                // Certifica-se de que os campos não estejam vazios
                if (!nome || !senha) {
                    alert('Por favor, insira nome e senha.');
                    return;
                }
                // Faz a solicitação ao servidor para obter todos os administradores
                fetch('http://localhost:3000/adimin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(res => res.json())
                .then(data => {//aqui volta a lista toda dos administradores
                    // usando o find vemos se a lista que veio do servidor tem o nome e a senha que o usuario colocou
                    const adminAutenticado = data.find(admin => admin.nome === nome && admin.senha === senha);
                    if (adminAutenticado) {
                        alert('Autenticação bem-sucedida!');
                        carregarProdutos();
                    } else {
                        alert('Nome ou senha incorretos. Tente novamente.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao autenticar:', error);
                });
            }
        });
    });
}



/*IMPORTANTE LEMBRAS: QUANDO CARREGAMOS PAGINAS DINAMICAS E TRABALHAMOS COM EVENTOS DE CLICK, JS PRECISA AGURDA HTML ESTAR REALMENT NO DOM
Lembrar uso callback - O callback é útil quando você quer executar ações adicionais após o HTML
ser inserido no DOM. Se  houver a necessidade de executar mais código após o carregamento do HTML, 
assim como fiz na requisição de cima, para o carregamento da pagina de cadatro e manipulação
dos eventos do formulario

-adicionar um ouvinte de eventos diretamente ao formulário 
(meuFormulario), que pode não existir no momento em que o 
script é carregado, você adiciona o ouvinte de eventos ao
 elemento pai (main) que já está presente no DOM.*/


 
 linkCadastrarProdutos.addEventListener('click', function (e) {
    e.preventDefault();
    carregarCadastrarProdutos();
});


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
                    alert('Produto Adicionado!')
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


//ADIMIN CADASTRANDO LISTANDO EDITANDO E EXLUINDO PRODUTOS
linkProdutos.addEventListener('click', function (e) {
    e.preventDefault();
    carregarProdutos();
  
} )
function carregarProdutos() {
    carregarHTML('../WEB/Produtos.html');
    getProdutos();
    criarListaCategoria
   
}
//CRUD
//chamando aqui para listar as ja existentes no banco assim que abre a pagina
// Função para listar os produtos
function getProdutos() {
    //html
    const conteudoCategoria = document.getElementById('categoria');
    conteudoCategoria.innerHTML = ''; //limpando

    //adicionando no container a lista criada das categorias
    const listaCategoria = criarListaCategoria(); //conteudo categoria é o container no html
    conteudoCategoria.appendChild(listaCategoria);  //recebe criarLista

 // Listar produtos
 fetch('http://localhost:3000/produto', {
     method: 'GET',
     headers: {
         'Content-Type': 'application/json',
     }
 })
 .then(res => res.json())
 .then(data => {
     console.log('Produtos listados:', data);
     // Para cada produto, criar um card e adicioná-lo à seção
     data.forEach(produto => {
         const card = criarCardProduto(produto);
         listagemDinamica.appendChild(card); // Adicione o card a cada produto e lista
     });
 })
 .catch(error => {
     console.error('Erro ao listar produtos:', error);
 });
}
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

 //criando card adminin
function criarCardProduto(produto) {
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

//IMPORTANTE LEMBRAS: QUANDO CARREGAMOS PAGINAS DINAMICAS E TRABALHAMOS COM EVENTOS DE CLICK, JS PRECISA AGURDA HTML ESTAR REALMENT NO DOM
cadastroAdimin.addEventListener('click', function(e) {
    e.preventDefault();
    carregarcadastroAdimin();
})

function carregarcadastroAdimin(){
    carregarHTML('../WEB/cadastroAdimin.html', function(){
        main.addEventListener('submit', function(e) {
            //verificando se é o formulario que quero
            if(e.target && e.target.id === 'formulario_adimin'){
                e.preventDefault(e);

                //recuperar dados que foi colocado no formulario 
                const nome  = document.getElementById('nome').value;
                const senha = document.getElementById('senha').value;

                const adimin = {
                    nome: nome,
                    senha: senha
                };

                fetch('http://localhost:3000/adimin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        }, body: JSON.stringify(adimin),
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert('Adiministrador Adicionado!')
                        console.log('adicionado: ', data);
                          //LIMPANDO INPUTS
                    const meuFormulario = document.getElementById('formulario_adimin');
                    if(meuFormulario){
                        meuFormulario.reset();
                    }else{
                        console.error('Formulário não encontrado!');
                    }
                    })
                .catch(error => console.error('Erro ao autenticar: ', error));
            }
        });
    });
}

adiministradores.addEventListener('click', function(e) {
    e.preventDefault(e);
    listarAdministradores();
})
function listarAdministradores(){
     // Limpar a seção antes de adicionar os novos produtos
     const listagemDinamica = document.getElementById('listagemDinamica'); //recuperando elemento html
     listagemDinamica.innerHTML = '';

     fetch('http://localhost:3000/adimin', {
        method: 'GET',
        headers: {
            'Content-Type' : 'apllication/json',
        },
     })
     .then(res => res.json())
     .then( data => {
        //para cada adimin
        data.forEach(adimin => {
            const card = cardAdimin(adimin);
            listagemDinamica.appendChild(card)
        });
     })
     .catch(error => {
        console.error('Erro ao listar produtos:', error);
    });

}
function cardAdimin(adimin){
    const card = document.createElement('div');
    card.classList.add('card');

    
    const nome = document.createElement('p');
    nome.classList.add('nome');
    nome.innerHTML = adimin.nome;

    const senha = document.createElement('p');
    senha.classList.add('senha');
    senha.innerHTML = adimin.senha;

    const btnEditar = document.createElement('a');
    btnEditar.href=''
    btnEditar.onclick = function(e){
        e.preventDefault();
        const  adiminId = adimin._id
        console.log(adiminId);
        editarAdimin(adiminId)
    }
    btnEditar.innerHTML = "editar"

    const btnExcluir = document.createElement('a');
    btnExcluir.href='';
    btnExcluir.onclick = function(e){
        e.preventDefault();
        const adiminId = adimin._id
        excluirAdimin(adiminId)
        
        
    }
    btnExcluir.innerHTML = "excluir"



    card.appendChild(nome);
    card.appendChild(senha);
    card.appendChild(btnEditar)
    card.appendChild(btnExcluir)

    return card;
}
function editarAdimin(adiminId){
    fetch("../web/editarAdimin.html")
    .then(res => res.text())
    .then(html => {
        main.innerHTML = html  //chamando meu arquivo estatico

        //requisiçao
        fetch(`http://localhost:3000/adimin/${adiminId}`)
        .then(res => res.json())
        .then(adimin => {
            const inputNome = document.getElementById('nome');
            const inputSenha = document.getElementById('senha');
           
            if(inputNome && inputSenha){
                inputNome.value = adimin.nome
                inputSenha.value = adimin.senha


                const btnSalvar = document.getElementById('salvarAdimin')
                btnSalvar.onclick = function(e){
                    e.preventDefault();

                    const atualizarDados = {
                        "nome": inputNome.value,
                        "senha": inputSenha.value
                    }

                    const header = {
                        method: 'PATCH',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        //mandando no corpo da requisição , transforma tudo em string
                        body:JSON.stringify(atualizarDados)
                    };
                    fetch(`http://localhost:3000/adimin/${adiminId}`, header)
                    .then(()=> {
                        listarAdministradores();
                    })
                    .catch(erorr => {
                        console.error('erros ao atualizar Adimin')
                    })
                }
            }

        })
    })
}
function excluirAdimin(adiminId){
    fetch(`http://localhost:3000/adimin/${adiminId}`, {
        method: 'DELETE',
    }).then(res => {
        if(res.ok){
            console.log('adimin excluido')
            listarAdministradores()
    }else{
        console.log('erro ao excluir admim')
    }})
.catch(error => {
    console.error('erro', error)
})
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
                    alert('Vendedor adicionado com sucesso!')
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
        // tratamento de erro
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










//redirecionando por categoria e renderizando por ordem os html
function carregarRefrigerante() {
    carregarHTML('../categorias/refrigerante.html');
    getProdutosPorCategoria('Refrigerante'); // Passa a categoria desejada como argumento
}
//suco
function carregarSuco() {
    carregarHTML('../categorias/suco.html');
    getProdutosPorCategoria('Suco');
}
//energetico
function carregarEnergetico() {
    carregarHTML('../categorias/energetico.html');
    getProdutosPorCategoria('Energetico');
}
//chas
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
            const card = criarCardProduto(produto);
            listagemDinamica.appendChild(card);
        });
    })
    .catch(error => {
        console.error(`Erro ao listar produtos da categoria ${categoria}:`, error);
    });
}

