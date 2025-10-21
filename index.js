import { produtosPorCategoria } from "./data.js";

const frete = 4;
let change = 0;
let precoGeral = 0;
let paymentSelected = "";
let orderResumeMessage = "";

let $buyCart = $(".buy-container");
let $menuContainer = $(".menu-container");
let $alertBox = $(".alert");
let $cartButton = $(".cart-float-button");
let $backCartButton = $(".back-cart-float-button");
let cart = [];
let $inicio = $("#inicio");
let $cartItemsContainer = $(".cart-items");
let $cartFinishButton = $(".cart-finish-button");
let $addMoreitems = $(".add-more-items-btn");
let $removeQty = $(".remove-qty");
let $addQty = $(".add-qty");
let $removeItem = $(".remove-item");
let $money = $("#money");
let $card = $("#card");
let $moneyChangeMessage = $(".money-change-message");
let $moneyChangeConfirmation = $("#money-change-confirm-btn");
let $moneyChangeConfirmationNegative = $("#money-change-confirm-btn-negative");
let $moneyChangeValue = $("#money-change-input");

$(document).ready(fillMenu(produtosPorCategoria));
function setUpProductCard(imagem, nome, preco, id, descricao) {
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
              <span class="product-information" >
              <span class="product-description">${descricao}</span>
              <span class="product-information-btn" data-id="${id}">Mais informações</span>
            </span>
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
        produto.id,
        produto.descricao
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
  $cartButton.hide();
  $backCartButton.css("display", "flex");
}
function showMenu() {
  $menuContainer.css("display", "block");
  $buyCart.hide();
  $cartButton.css("display", "flex");
  $backCartButton.hide();
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
          updateCartPriceState();
          updateCartProductState(itemExistenteNoCarrinho.id);
          showAlert("Quantidade aumentada no carrinho!", "#4BB543");
        } else {
          // SE ELE NÃO EXISTE NO CARRINHO:
          // Adicionamos a propriedade 'qtd' ao produto que encontramos no MENU.
          produtoEncontrado.qtd = 1;
          // E o adicionamos ao carrinho.
          cart.push(produtoEncontrado);
          updateCartPriceState();
          showAlert("Item adicionado ao carrinho!", "#4BB543");
        }

        if (!itemExistenteNoCarrinho) {
          // 1. Calcula o total do item (número)
          const precoTotal = produtoEncontrado.preco * produtoEncontrado.qtd;

          // 2. Formata o resultado para BRL (string)
          const precoFormatado =
            precoTotal.toFixed(2).replace(".", ",") +
            " (x " +
            produtoEncontrado.qtd +
            ")";
          const productLayoutHtml =
            $(`<div class="cart-product-layout" id="productLayout${produtoEncontrado.id}">
          <div class="product-info">
            <span class="cart-product-name">${produtoEncontrado.nome}</span>
            <span class="cart-product-price" id="cartProductPrice${produtoEncontrado.id}">R$ ${precoFormatado}</span>
          </div>

          <div class="product-controls">
            <button class="control-btn remove-qty" data-id="${produtoEncontrado.id}">-</button>
            <span class="cart-product-qty" id="cartProductQty${produtoEncontrado.id}" data-id="${produtoEncontrado.id}">${produtoEncontrado.qtd}</span>
            <button class="control-btn add-qty" data-id="${produtoEncontrado.id}">+</button>
            <button class="control-btn remove-item" data-id="${produtoEncontrado.id}">x</button>
          </div>
        </div>`);

          $cartItemsContainer.append(productLayoutHtml);
          console.log(productLayoutHtml);
        }

        console.log(cart);
        return; // Para o loop, pois já encontramos e processamos o produto.
      }
    }
  });

  $cartButton.on("click", function () {
    showCart();
    if (cart.length > 0) return;
    $cartItemsContainer.empty();
    $cartItemsContainer.text("O carrinho está vazio. Adicione alguns itens!");
    console.log("Carrinho vazio.");
  });

  $inicio.on("click", function () {
    showMenu();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
    $moneyChangeMessage.hide();
  });
  $addMoreitems.on("click", function () {
    showMenu();
  });
  // Evento para AUMENTAR QUANTIDADE (+)
  // Anexamos o evento ao contêiner ($cartItemsContainer) e esperamos cliques no '.add-qty'
  $cartItemsContainer.on("click", ".add-qty", function () {
    const id = $(this).data("id");
    increaseItem(id); // Função para aumentar
    updateCartProductState(id);
    updateCartPriceState();
    console.log("Aumentar QTD - ID:", id);
  });

  // Evento para DIMINUIR QUANTIDADE (-)
  // Observação: a lógica de remover o item se QTD <= 1 está dentro de decreaseItem
  $cartItemsContainer.on("click", ".remove-qty", function () {
    const id = $(this).data("id");
    decreaseItem(id); // Função para diminuir
    // O updateCartProductState e updateCartPriceState estão implícitos dentro de decreaseItem/removeItem
    // Se você quiser garantir a atualização visual, chame-os após a diminuição:
    updateCartProductState(id);
    updateCartPriceState();
    console.log("Diminuir QTD - ID:", id);
  });

  // Evento para REMOVER ITEM (x)
  $cartItemsContainer.on("click", ".remove-item", function () {
    const id = $(this).data("id");
    removeItem(id);
    updateCartPriceState(); // Atualiza o preço total após a remoção
    console.log("Remover Item - ID:", id);
  });
  let clicked = false;
  $menuContainer.on("click", ".product-information-btn", function () {
    clicked = !clicked;
    $(this).prev().toggle();
    $(this).text(clicked ? "Menos informações" : "Mais informações");
    console.log(clicked);
  });

  $backCartButton.on("click", function () {
    showMenu();
  });

  let cardClicked = false;
  let moneyClicked = false;
  let paymentSelected = "";
  $money.on("click", function () {
    cardClicked = false;
    moneyClicked = !moneyClicked;
    if (moneyClicked) {
      $money.css("opacity", "1");
      $card.css("opacity", "0.5");
    }
    paymentSelected = "money";
    console.log(paymentSelected);
    $moneyChangeMessage.css("display", "flex");
    $buyCart.css("filter", "blur(5px)");
    $buyCart.css("pointer-events", "none");
  });

  $card.on("click", function () {
    moneyClicked = false;
    cardClicked = !cardClicked;
    if (cardClicked) {
      $card.css("opacity", "1");
      $money.css("opacity", "0.5");
    }
    paymentSelected = "card";
    console.log(paymentSelected);
  });

  $moneyChangeConfirmation.on("click", function () {
    console.log("a");
    if (
      $moneyChangeValue.val() == "") {
      $moneyChangeValue.css("border", "1px solid red");
      paymentSelected = "";
      $card.css("opacity", "1");
      $money.css("opacity", "1");
    } else if (!precoGeral) {
      $moneyChangeValue.css("border", "1px solid red");
      $moneyChangeValue.val("");
      $moneyChangeValue.attr("placeholder", "Adicione um produto antes.");
      paymentSelected = "";
      $card.css("opacity", "1");
      $money.css("opacity", "1");
    } else if (parseFloat($moneyChangeValue.val()) <= precoGeral) {
      $moneyChangeValue.css("border", "1px solid red");
      $moneyChangeValue.val("");
      $moneyChangeValue.attr(
        "placeholder",
        "O troco deve ser maior que o preço."
      );
      paymentSelected = "";
      $card.css("opacity", "1");
      $money.css("opacity", "1");
    } else {
      change = $moneyChangeValue.val();
      $moneyChangeValue.css("border", "1px solid #ccc");
      $buyCart.css("filter", "none");
      $buyCart.css("pointer-events", "auto");
      $moneyChangeMessage.hide();
      $(".change").text(
        `Troco para R$ ${parseFloat(change).toFixed(2).replace(".", ",")}`
      );
      $(".change").show();
      $card.css("opacity", "0.5");
    }
  });

  $moneyChangeConfirmationNegative.on("click", function () {
    change = 0;
    $moneyChangeValue.val("");
    $moneyChangeValue.css("border", "1px solid #ccc");
    $moneyChangeValue.attr("placeholder", "");
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
    $moneyChangeMessage.hide();
    $(".change").empty();
    $(".change").hide();
  });

  $cartFinishButton.on("click", function () {
    console.log(paymentSelected);
    if (!cart) {
      showAlert("O carrinho está vazio.", "#f44336");
    } else if (!paymentSelected) {
      showAlert("Você deve selecionar um meio de pagamento.", "#f44336");
    }
  });
}

function updateCartProductState(domId) {
  const currentProduct = cart.find((item) => item.id === domId);
  const precoTotal = currentProduct.preco * currentProduct.qtd;
  const precoFormatado = precoTotal.toFixed(2).replace(".", ",");
  $("#cartProductQty" + domId).text(currentProduct.qtd);
  $("#cartProductPrice" + domId).text(
    `R$ ${precoFormatado} (x${currentProduct.qtd})`
  );
}

function updateCartPriceState() {
  let precoTotal = 0;
  cart.forEach((item) => {
    precoTotal += item.preco * item.qtd;
  });
  const precoTotalFrete = precoTotal + frete;
  const precoFormatado = precoTotal.toFixed(2).replace(".", ",");
  const precoFormatadoFrete = precoTotalFrete.toFixed(2).replace(".", ",");
  $("#subtotal-price-value").text("R$ " + precoFormatado);
  $("#final-price-value").text("R$ " + precoFormatadoFrete);
  console.log("preço:" + precoFormatado);
  precoGeral = precoTotal;
}

function removeItem(id) {
  const currentProduct = cart.find((item) => item.id === id);
  const indice = cart.indexOf(currentProduct);
  if (indice > -1) {
    cart.splice(indice, 1);
  }
  console.log("Item removido do carrinho.");
  $("#productLayout" + id).remove();
  paymentSelected = "";
  $card.css("opacity", "1");
  $money.css("opacity", "1");
  $moneyChangeValue.text("");
  $moneyChangeValue.hide();
  updateCartPriceState();
}

function increaseItem(id) {
  const currentProduct = cart.find((item) => item.id === id);
  if (!currentProduct.qtd) {
    currentProduct.qtd = 1;
  } else {
    currentProduct.qtd++;
  }
  updateCartProductState(currentProduct.id);
  updateCartPriceState();
  console.log("chegou na função increase");
}

function decreaseItem(id) {
  const currentProduct = cart.find((item) => item.id === id);
  if (currentProduct.qtd > 1) {
    currentProduct.qtd--;
  } else {
    removeItem(id);
  }
  updateCartProductState(currentProduct.id);
  updateCartPriceState();
}

listeners();
