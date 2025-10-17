import { produtosPorCategoria } from "./data.js";

let $buyCart = $(".buy-container");
let $menuContainer = $(".menu-container");
let $alertBox = $(".alert");
let cart = [];

$(document).ready(fillMenu(produtosPorCategoria));
function setUpProductCard(imagem, nome, preco, id) {
  let productCardHtml = `<span class="product">
              <span
                ><img class="product-image" src="${imagem}" alt="${nome}"
              /></span>
              <span class="product-name">${nome}</span>
              <span class="product-price">R$ ${preco
                .toFixed(2)
                .replace(".", ",")}</span>
              <span
                ><button class="addToCart-button" data-id="${id}">
                  Adicionar ao carrinho
                </button></span
              >
            </span>`;

  return $(productCardHtml);
}
// #4BB543 ou #f44336
function showAlert(message, color) {
  $alertBox.text(message);
  $alertBox.css("background-color", color);
  $alertBox.css("display", "block");
  setTimeout(() => {
    $alertBox.css("display", "none");
  }, 2000);
}

function fillMenu(produtosPorCategoria) {
  // 1. Limpa o container principal para garantir que não haja conteúdo antigo.
  $menuContainer.empty();

  // 2. USA O LOOP 'FOR...IN' PARA PERCORRER AS CATEGORIAS (AS CHAVES DO OBJETO)
  for (const nomeDaCategoria in produtosPorCategoria) {
    // =======================================================
    // PASSO A: CRIAR A "CAIXA" DA CATEGORIA
    // =======================================================

    // Cria o container principal para esta categoria (ex: <div class="class-span">)
    const $containerCategoria = $("<div>").addClass("class-span");

    // Cria o título da categoria (ex: <h2>Premium</h2>)
    const $tituloCategoria = $("<span>")
      .addClass("class-title")
      .text(nomeDaCategoria);

    // Cria o grid onde os cards de produto desta categoria entrarão
    const $gridDeProdutos = $("<div>").addClass("product-grid");

    // =======================================================
    // PASSO B: PREENCHER A "CAIXA" COM OS PRODUTOS
    // =======================================================

    // Pega a lista (array) de produtos que está DENTRO da categoria atual
    const produtosDaCategoriaAtual = produtosPorCategoria[nomeDaCategoria];

    // Agora, usamos um loop 'forEach' para percorrer este array de produtos
    produtosDaCategoriaAtual.forEach((produto) => {
      // Para cada produto, cria o seu card HTML
      const $cardProduto = setUpProductCard(
        produto.imagem,
        produto.nome,
        produto.preco,
        produto.id
      );

      // Adiciona (append) o card recém-criado ao grid desta categoria
      $gridDeProdutos.append($cardProduto);
    });

    // =======================================================
    // PASSO C: MONTAR TUDO E COLOCAR NA PÁGINA
    // =======================================================

    // Adiciona o título e o grid (já com os produtos) ao container da categoria
    $containerCategoria.append($tituloCategoria);
    $containerCategoria.append($gridDeProdutos);

    // Adiciona o container da categoria completo ao menu principal
    $menuContainer.append($containerCategoria);
  }
  console.log("produtos adicionados.");
  console.log(produtosPorCategoria);
}

function showCart() {
  $buyCart.css("display", "flex");
  $menuContainer.hide();
}
function showMenu() {
  $menuContainer.css("display", "flex");
  $buyCart.hide();
}

// Cart logic

function listeners() {
  $menuContainer.on("click", ".addToCart-button", function () {
    const idDoProdutoClicado = $(this).data("id");

    for (let categoria in produtosPorCategoria) {
      let categoriaAtual = produtosPorCategoria[categoria];
      let produtoEncontrado = categoriaAtual.find(
        (produto) => produto.id === idDoProdutoClicado
      );

      // Se encontramos o produto no menu...
      if (produtoEncontrado) {
        // Agora, verificamos se ele já está no carrinho.
        const itemExistenteNoCarrinho = cart.find(
          (item) => item.id === idDoProdutoClicado
        );

        if (itemExistenteNoCarrinho) {
          // SE ELE JÁ EXISTE NO CARRINHO:
          // Aumentamos a quantidade do objeto que encontramos DENTRO do carrinho.
          itemExistenteNoCarrinho.qtd += 1;
          showAlert("Quantidade aumentada no carrinho!", "#4BB543");
        } else {
          // SE ELE NÃO EXISTE NO CARRINHO:
          // Adicionamos a propriedade 'qtd' ao produto que encontramos no MENU.
          produtoEncontrado.qtd = 1;
          // E o adicionamos ao carrinho.
          cart.push(produtoEncontrado);
          showAlert("Item adicionado ao carrinho!", "#4BB543");
        }

        console.log(cart);
        return; // Para o loop, pois já encontramos e processamos o produto.
      }
    }
  });
}

function addItemToCart(item) {
    
} 

function removeItem(item) {}

function increaseItem(item) {
  item.data("id");
}

function decreaseItem(Item) {}

listeners();
