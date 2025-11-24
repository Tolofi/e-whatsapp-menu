import { carregarMenuCompleto } from "./data.js"; 

// --- VARIÁVEIS GLOBAIS ---
let cardapioGlobal = {}; // IMPORTANTE: Variável global para os listeners verem os produtos
const frete = 4;
let change = 0;
let precoGeral = 0;
let paymentSelected = "";
let orderResumeMessage = "";

let fullOrderObject = {
  cliente: "",
  pagamento: "",
  endereco: "",
  observacoes: "",
  produtos: [],
};

// --- SELETORES JQUERY ---
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
let $pix = $("#pix");
let $moneyChangeMessage = $(".money-change-message");
let $moneyChangeConfirmation = $("#money-change-confirm-btn");
let $moneyChangeConfirmationNegative = $("#money-change-confirm-btn-negative");
let $moneyChangeValue = $("#money-change-input");
let $cardSelect = $(".card-select");
let $creditCard = $("#credit");
let $debitCard = $("#debit");
let $adress = $("#adress");
let $observacao = $("#obs");
let $clientName = $("#client-name"); 
let $cartEmptyMsg = $(".isCartEmpty"); 


// ========================================================
// 1. INICIALIZAÇÃO PRINCIPAL (SÓ PODE TER UMA DESSA)
// ========================================================
$(document).ready(async function () {
  console.log("Iniciando app...");
  
  try {
      // 1. Busca os dados (espera baixar da planilha)
      const dadosBaixados = await carregarMenuCompleto();
      
      // 2. Salva na variável global para os botões de adicionar funcionarem depois
      cardapioGlobal = dadosBaixados;

      // 3. Preenche a tela
      fillMenu(cardapioGlobal);
      
      // 4. Carrega dados do usuário (nome/endereço salvos)
      loadUserData();
      
      // 5. Ativa os cliques (SÓ AGORA, pois o menu já existe)
      listeners(); 
      
  } catch (error) {
      console.error("Erro fatal ao carregar menu:", error);
      alert("Erro ao carregar o cardápio. Verifique sua conexão.");
  }
});


// ========================================================
// FUNÇÕES DE EXIBIÇÃO
// ========================================================

function fillMenu(produtosPorCategoria) {
  // Segurança: se não tiver dados, para a função para não dar erro
  if (!produtosPorCategoria) return; 

  $menuContainer.empty();

  for (const nomeDaCategoria in produtosPorCategoria) {
    const $containerCategoria = $("<div>").addClass("class-span");
    const $tituloCategoria = $("<span>").addClass("class-title").text(nomeDaCategoria);
    const $gridDeProdutos = $("<div>").addClass("product-grid");

    const produtosDaCategoriaAtual = produtosPorCategoria[nomeDaCategoria];

    produtosDaCategoriaAtual.forEach((produto) => {
      const $cardProduto = setUpProductCard(
        produto.imagem,
        produto.nome,
        produto.preco,
        produto.id,
        produto.descricao
      );
      $gridDeProdutos.append($cardProduto);
      console.log($gridDeProdutos.html());
    });

    $containerCategoria.append($tituloCategoria);
    $containerCategoria.append($gridDeProdutos);
    $menuContainer.append($containerCategoria);
  }
  console.log("Produtos adicionados visualmente na tela.");
}

function setUpProductCard(imagem, nome, preco, id, descricao) {
  let productCardHtml = `<span class="product">
              <span><img class="product-image" src="${imagem}" alt="${nome}"/></span>
              <span class="product-name">${nome}</span>
              <span class="product-price">R$ ${preco.toFixed(2).replace(".", ",")}</span>
              <span><button class="addToCart-button" data-id="${id}">Adicionar</button></span>
              <span class="product-information">
                <span class="product-description">${descricao}</span>
                <span class="product-information-btn" data-id="${id}">Mais informações</span>
              </span>
            </span>`;
  return $(productCardHtml);
}

// ========================================================
// FUNÇÕES DE LÓGICA E LISTENERS
// ========================================================

function listeners() {
  // ADICIONAR AO CARRINHO
  $menuContainer.on("click", ".addToCart-button", function () {
    const idDoProdutoClicado = $(this).data("id");

    // Usa a variável GLOBAL cardapioGlobal
    for (let categoria in cardapioGlobal) { 
      let categoriaAtual = cardapioGlobal[categoria];
      
      // Usa == para evitar erro de string "1" vs numero 1
      let produtoEncontrado = categoriaAtual.find(
        (produto) => produto.id == idDoProdutoClicado
      );

      if (produtoEncontrado) {
        const itemExistenteNoCarrinho = cart.find(
          (item) => item.id == idDoProdutoClicado
        );

        if (itemExistenteNoCarrinho) {
          itemExistenteNoCarrinho.qtd += 1;
          updateCartPriceState();
          updateCartProductState(itemExistenteNoCarrinho.id);
          showAlert("Quantidade aumentada no carrinho!", "#4BB543");
        } else {
          // Cria um novo objeto para não alterar o original do menu
          let novoItemCarrinho = { ...produtoEncontrado, qtd: 1 };
          cart.push(novoItemCarrinho);
          
          updateCartPriceState();
          showAlert("Item adicionado ao carrinho!", "#4BB543");

          // Renderiza o item no carrinho visualmente
          renderCartItem(novoItemCarrinho);
          console.log("Era pra estar renderizado.")
        }
        return; 
      }
    }
  });

  // Outros listeners...
  $cartButton.on("click", function () {
    showCart();
    if (cart.length > 0) {
      $cartEmptyMsg.empty();
    }  else {
      $cartEmptyMsg.text("O carrinho está vazio. Adicione alguns itens!");
    }
  });

  $inicio.on("click", function () {
    showMenu();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
    $moneyChangeMessage.hide();
    $cardSelect.hide();
  });

  $addMoreitems.on("click", function () { showMenu(); });
  
  $cartItemsContainer.on("click", ".add-qty", function () {
    const id = $(this).data("id");
    increaseItem(id);
  });

  $cartItemsContainer.on("click", ".remove-qty", function () {
    const id = $(this).data("id");
    decreaseItem(id);
  });

  $cartItemsContainer.on("click", ".remove-item", function () {
    const id = $(this).data("id");
    removeItem(id);
  });

  let clicked = false;
  $menuContainer.on("click", ".product-information-btn", function () {
    clicked = !clicked;
    $(this).prev().toggle();
    $(this).text(clicked ? "Menos informações" : "Mais informações");
  });

  $backCartButton.on("click", function () { showMenu(); });

  // Lógica de Pagamento (Dinheiro, Cartão, Pix) - Mantida igual
  let cardClicked = false;
  let moneyClicked = false;
  
  $money.on("click", function () {
    cardClicked = false;
    moneyClicked = true;
    $money.css("opacity", "1");
    $card.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $moneyChangeMessage.css("display", "flex");
    $buyCart.css("filter", "blur(5px)");
    $buyCart.css("pointer-events", "none");
  });

  $pix.on("click", function () {
    cardClicked = false;
    moneyClicked = false;
    paymentSelected = "Pix";
    $money.css("opacity", "0.5");
    $card.css("opacity", "0.5");
    $pix.css("opacity", "1");
  });

  $card.on("click", function () {
    moneyClicked = false;
    cardClicked = true;
    $card.css("opacity", "1");
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $buyCart.css("filter", "blur(5px)");
    $buyCart.css("pointer-events", "none");
    $cardSelect.css("display", "flex");
  });

  $moneyChangeConfirmation.on("click", function () {
    // Validações de troco mantidas...
    if ($moneyChangeValue.val() == "" || !precoGeral || parseFloat($moneyChangeValue.val()) <= precoGeral) {
        $moneyChangeValue.css("border", "1px solid red");
        // lógica de erro simplificada aqui para brevidade
    } else {
      change = parseFloat($moneyChangeValue.val().trim().replace(",", "."));
      $moneyChangeValue.css("border", "1px solid #ccc");
      $buyCart.css("filter", "none");
      $buyCart.css("pointer-events", "auto");
      $moneyChangeMessage.hide();
      paymentSelected = `Dinheiro (Troco: R$ ${change.toFixed(2).replace(".", ",")})`;
      $(".change").text(`Troco para R$ ${change.toFixed(2).replace(".", ",")}`);
      $(".change").show();
      $card.css("opacity", "0.5");
      $pix.css("opacity", "0.5");
      $money.css("opacity", "1");
    }
  });

  $moneyChangeConfirmationNegative.on("click", function () {
    change = 0;
    $(".change").text(`Sem troco.`);
    $(".change").show(); 
    paymentSelected = "Dinheiro (Sem troco)";
    $money.css("opacity", "1");
    $card.css("opacity", "0.5");
    $moneyChangeValue.val("");
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
    $moneyChangeMessage.hide();
  });

  $creditCard.on("click", function () {
    paymentSelected = "Cartão de Crédito";
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $card.css("opacity", "1");
    $cardSelect.hide();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
  });

  $debitCard.on("click", function () {
    paymentSelected = "Cartão de Débito";
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $card.css("opacity", "1");
    $cardSelect.hide();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
  });

  $cartFinishButton.on("click", function () { finishOrderObject(); });
  
  $("#delivery-price").text(`R$ ${frete.toFixed(2).replace(".", ",")}`);
  $("#final-price-value").text(`R$ ${frete.toFixed(2).replace(".", ",")}`);
}

// Helper para desenhar o item no carrinho (extraída do código original para organização)
function renderCartItem(item) {
  const precoTotal = item.preco * item.qtd;
  const precoFormatado = precoTotal.toFixed(2).replace(".", ",") + " (x " + item.qtd + ")";
  
  const productLayoutHtml = $(`
    <div class="cart-product-layout" id="productLayout${item.id}">
      <div class="product-info">
        <span class="cart-product-name">${item.nome}</span>
        <span class="cart-product-price" id="cartProductPrice${item.id}">R$ ${precoFormatado}</span>
      </div>
      <div class="product-controls">
        <button class="control-btn remove-qty" data-id="${item.id}">-</button>
        <span class="cart-product-qty" id="cartProductQty${item.id}" data-id="${item.id}">${item.qtd}</span>
        <button class="control-btn add-qty" data-id="${item.id}">+</button>
        <button class="control-btn remove-item" data-id="${item.id}">x</button>
      </div>
    </div>`);

    console.log(productLayoutHtml.html());
    try {
      $cartItemsContainer.append(productLayoutHtml);
      console.log("Tentando adicionar item ao carrinho visualmente...");
    } catch (error) {
      console.error("Erro ao tentar adicionar item ao carrinho visualmente:", error);
    }
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

function saveUserData(cliente, endereco) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("cliente", cliente);
    localStorage.setItem("endereco", endereco);
  }
}

function loadUserData() {
  if (typeof Storage !== "undefined") {
    const savedClient = localStorage.getItem("cliente");
    const savedAddress = localStorage.getItem("endereco");
    if (savedClient) $clientName.val(savedClient);
    if (savedAddress) $adress.val(savedAddress);
  }
}

function updateCartProductState(domId) {
  // OBS: Aqui também usamos == para segurança
  const currentProduct = cart.find((item) => item.id == domId);
  if (!currentProduct) return;
  
  const precoTotal = currentProduct.preco * currentProduct.qtd;
  const precoFormatado = precoTotal.toFixed(2).replace(".", ",");
  $("#cartProductQty" + domId).text(currentProduct.qtd);
  $("#cartProductPrice" + domId).text(`R$ ${precoFormatado} (x${currentProduct.qtd})`);
}

function updateCartPriceState() {
  let precoTotal = 0;
  cart.forEach((item) => { precoTotal += item.preco * item.qtd; });
  const precoTotalFrete = precoTotal + frete;
  $("#subtotal-price-value").text("R$ " + precoTotal.toFixed(2).replace(".", ","));
  $("#final-price-value").text("R$ " + precoTotalFrete.toFixed(2).replace(".", ","));
  precoGeral = precoTotal;
}

function increaseItem(id) {
  const currentProduct = cart.find((item) => item.id == id);
  if (currentProduct) {
      currentProduct.qtd++;
      updateCartProductState(id);
      updateCartPriceState();
  }
}

function decreaseItem(id) {
  const currentProduct = cart.find((item) => item.id == id);
  if (currentProduct) {
    if (currentProduct.qtd > 1) {
      currentProduct.qtd--;
    } else {
      removeItem(id);
    }
    updateCartProductState(id);
    updateCartPriceState();
  }
}

function removeItem(id) {
  const currentProduct = cart.find((item) => item.id == id);
  const indice = cart.indexOf(currentProduct);
  if (indice > -1) {
    cart.splice(indice, 1);
  }
  $("#productLayout" + id).remove();
  paymentSelected = "";
  $card.css("opacity", "1");
  $money.css("opacity", "1");
  $moneyChangeValue.val("").hide();
  updateCartPriceState();
}

function showAlert(message, color) {
  $alertBox.text(message);
  $alertBox.css("background-color", color);
  $alertBox.css("display", "block");
  setTimeout(() => { $alertBox.css("display", "none"); }, 2000);
}

function finishOrderObject() {
  const nomeCliente = $clientName.val().trim();
  const enderecoEntrega = $adress.val().trim();
  const observacoes = $observacao.val().trim();

  if (cart.length === 0) return showAlert("O carrinho está vazio.", "#f44336");
  if (paymentSelected == "") return showAlert("Selecione um meio de pagamento.", "#f44336");
  if (enderecoEntrega == "") return showAlert("Digite seu endereço.", "#f44336");
  if (nomeCliente == "") return showAlert("Digite seu nome.", "#f44336");

  fullOrderObject.cliente = nomeCliente;
  fullOrderObject.endereco = enderecoEntrega;
  fullOrderObject.pagamento = paymentSelected;
  fullOrderObject.observacoes = observacoes;
  fullOrderObject.produtos = cart.map((item) => ({ nome: item.nome, qtd: item.qtd }));

  saveUserData(nomeCliente, enderecoEntrega);
  makeOrderMessage();
  redirectUser();
}

function makeOrderMessage() {
  const itensFormatados = fullOrderObject.produtos.map((item) => `- (${item.qtd}x) ${item.nome}`).join("\n");
  const valorTroco = change > 0 ? ` (Troco para R$ ${parseFloat(change).toFixed(2).replace(".", ",")})` : "";
  const obs = fullOrderObject.observacoes ? `\nObservações: ${fullOrderObject.observacoes}` : "";
  const total = (precoGeral + frete).toFixed(2).replace(".", ",");

  orderResumeMessage = `*-- Resumo do Pedido --*
----------------------------
Cliente: ${fullOrderObject.cliente}

Itens:
${itensFormatados}
${obs}

----------------------------
Subtotal: R$ ${precoGeral.toFixed(2).replace(".", ",")}
Frete: R$ ${frete.toFixed(2).replace(".", ",")}
*Total Final:* R$ ${total}

*Forma de Pagamento:* ${fullOrderObject.pagamento}${valorTroco}
*Endereço:* ${fullOrderObject.endereco}`;
}

function redirectUser() {
  const numeroTelefone = "5519998964995"; 
  const urlBase = "https://api.whatsapp.com/send";
  const urlCompleta = `${urlBase}?phone=${numeroTelefone}&text=${encodeURIComponent(orderResumeMessage)}`;
  window.open(urlCompleta, "_blank");
}