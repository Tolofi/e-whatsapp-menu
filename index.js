import { carregarMenuCompleto, carregarConfigs } from "./data.js";

// --- VARIÁVEIS GLOBAIS ---
let cardapioGlobal = {}; // IMPORTANTE: Variável global para os listeners verem os produtos
let configsLojaGlobal = [];
let change = 0;
let frete = 0;
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
let $mainContainer = $(".main-container");
let $loader = $(".loader");
let $statusMessage = $(".status-message");
let $statusContainer = $(".status");
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
let $deliveryTime = $(".delivery-time");

// ========================================================
// 1. INICIALIZAÇÃO PRINCIPAL (SÓ PODE TER UMA DESSA)
// ========================================================
$(document).ready(async function () {
  console.log("Iniciando app...");
  try {
    // 1. Busca os dados (espera baixar da planilha)
    const dadosBaixados = await carregarMenuCompleto();
    const configsLoja = await carregarConfigs();

    console.log(configsLoja);
    configsLojaGlobal = configsLoja;
    frete =
      configsLoja[0].frete_em_reais != null
        ? configsLoja[0].frete_em_reais
        : frete;
    frete = parseFloat(frete); // Garante que frete seja um número antes de usar toFixed()
    console.log(frete);
    console.log(configsLojaGlobal[0].status); // Corrigido para acessar o primeiro elemento do array

    $("#delivery-price").text(`R$ ${frete.toFixed(2).replace(".", ",")}`);
    console.log(frete + "/" + $("#delivery-price").text());
    $("#final-price-value").text(`R$ ${frete.toFixed(2).replace(".", ",")}`);

    // 2. Salva na variável global para os botões de adicionar funcionarem depois
    cardapioGlobal = dadosBaixados;

    // 3. Preenche a tela
    fillMenu(cardapioGlobal);

    // 4. Carrega dados do usuário (nome/endereço salvos)
    loadUserData();

    loadCartFromStorage();

    // 5. Ativa os cliques (SÓ AGORA, pois o menu já existe)
    listeners();
    if(configsLojaGlobal[0].status != "Aberto") {
      $statusMessage.text(configsLojaGlobal[0].mensagem_loja_fechada ? configsLojaGlobal[0].mensagem_loja_fechada : "A loja está fechada no momento.");;
      $statusContainer.show();
    }
    $mainContainer.show();
    $loader.hide();
    console.log("App iniciado com sucesso.");
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

  console.log(produtosPorCategoria);
  $menuContainer.empty();

  for (const nomeDaCategoria in produtosPorCategoria) {
    const $containerCategoria = $("<div>").addClass("class-span");
    const $tituloCategoria = $("<span>")
      .addClass("class-title")
      .text(nomeDaCategoria);
    const $gridDeProdutos = $("<div>").addClass("product-grid");

    const produtosDaCategoriaAtual = produtosPorCategoria[nomeDaCategoria];

    produtosDaCategoriaAtual.forEach((produto) => {
      const $cardProduto = setUpProductCard(
        produto.imagem,
        produto.nome,
        produto.preco,
        produto.id,
        produto.descricao,
        produto.disponibilidade
      );
      $gridDeProdutos.append($cardProduto);
    });

    $containerCategoria.append($tituloCategoria);
    $containerCategoria.append($gridDeProdutos);
    $menuContainer.append($containerCategoria);

    $deliveryTime.text(`Tempo de entrega: ${configsLojaGlobal[0].tempo_minimo_de_entrega_em_minutos} - ${configsLojaGlobal[0].tempo_maximo_de_entrega_em_minutos} minutos`);
  }
  console.log("Produtos adicionados visualmente na tela.");
}

function setUpProductCard(imagem, nome, preco, id, descricao, disponibilidade) {
  let disponivel;
  if (disponibilidade == "Disponível") {
    disponivel = true;
  }
  console.log(disponivel);
  let productCardHtml = `<span class="product">
              <span><img class="product-image" src="${imagem}" alt="${nome}"/></span>
              <span class="product-name">${nome}</span>
              <span class="product-price">R$ ${preco
                .toFixed(2)
                .replace(".", ",")}</span>
              <span><button class="addToCart-button" data-id="${id}">Adicionar</button></span>
              <span class="product-information">
                <span class="product-description">${descricao}</span>
                <span class="product-information-btn" data-id="${id}">Mais informações</span>
              </span>
            </span>`;

  let productCardHtmlIndisponivel = `<span class="product">
              <span><img class="product-image" src="${imagem}" alt="${nome}"/></span>
              <span class="product-name">${nome}</span>
              <span class="product-price">R$ ${preco
                .toFixed(2)
                .replace(".", ",")}</span>
              <span><button class="addToCart-button" data-id="${id}" style="color: white; background-color: #777; pointer-events: none;">Indisponível</button></span>
              <span class="product-information">
                <span class="product-description">${descricao}</span>
                <span class="product-information-btn" data-id="${id}">Mais informações</span>
              </span>
              </span> `

                return disponivel ? productCardHtml : productCardHtmlIndisponivel;
            }

// ========================================================
// FUNÇÕES DE LÓGICA E LISTENERS
// ========================================================

function listeners() {
  $menuContainer.on("click", ".addToCart-button", function () {
    const idDoProdutoClicado = $(this).data("id");

    if (configsLojaGlobal[0].status !== "Aberto") {
      showAlert("A loja está fechada no momento.", "#f44336");
      return;
    }

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
          saveCartToStorage();
          showAlert("Quantidade aumentada no carrinho!", "#4BB543");
        } else {
          // Cria um novo objeto para não alterar o original do menu
          let novoItemCarrinho = { ...produtoEncontrado, qtd: 1 };
          cart.push(novoItemCarrinho);

          updateCartPriceState();
          saveCartToStorage();
          showAlert("Item adicionado ao carrinho!", "#4BB543");

          // Renderiza o item no carrinho visualmente
          renderCartItem(novoItemCarrinho);
          console.log("Era pra estar renderizado.");
        }
        return;
      }
    }
  });

  // Outros listeners...
  $cartButton.on("click", function () {
    if (configsLojaGlobal[0].status !== "Aberto") {
      showAlert("A loja está fechada no momento.", "#f44336");
      return;
    }
    showCart();
    if (cart.length > 0) {
      $cartEmptyMsg.empty();
    } else {
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

  $addMoreitems.on("click", function () {
    showMenu();
  });

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
    if (cart.length === 0) {
      $cartEmptyMsg.text("O carrinho está vazio. Adicione alguns itens!");
    }
  });

  let clicked = false;
  $menuContainer.on("click", ".product-information-btn", function () {
    clicked = !clicked;
    $(this).prev().toggle();
    $(this).text(clicked ? "Menos informações" : "Mais informações");
  });

  $backCartButton.on("click", function () {
    showMenu();
  });

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
    $(".change").hide();
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
    if ($moneyChangeValue.val() == "") {
      $moneyChangeValue.css("border", "1px solid red");
      paymentSelected = "";
      $money.css("opacity", "1");
    } else if (!precoGeral) {
      $moneyChangeValue.css("border", "1px solid red");
      $moneyChangeValue.val("");
      $moneyChangeValue.attr("placeholder", "Adicione um produto antes.");
      paymentSelected = "";
      $money.css("opacity", "1");
    } else if (parseFloat($moneyChangeValue.val()) <= precoGeral) {
      $moneyChangeValue.css("border", "1px solid red");
      $moneyChangeValue.val("");
      $moneyChangeValue.attr(
        "placeholder",
        "O troco deve ser maior que o preço."
      );
      paymentSelected = "";
      $money.css("opacity", "1");
    } else {
      change = parseFloat($moneyChangeValue.val().trim().replace(",", "."));
      $moneyChangeValue.css("border", "1px solid #ccc");
      $buyCart.css("filter", "none");
      $buyCart.css("pointer-events", "auto");
      $moneyChangeMessage.hide();
      paymentSelected = Dinheiro(
        `Troco: R$ ${change.toFixed(2).replace(".", ",")}`
      );
      $(".change").text(`Troco para R$ ${change.toFixed(2).replace(".", ",")}`);
      $(".change").show();
      $card.css("opacity", "0.5");
      $pix.css("opacity", "0.5");
      $money.css("opacity", "1");
      console.log(paymentSelected);
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
    console.log(paymentSelected);
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $card.css("opacity", "1");
    $cardSelect.hide();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
    $(".change").text(`Cartão de Crédito.`);
    $(".change").show();
  });

  $debitCard.on("click", function () {
    paymentSelected = "Cartão de Débito";
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $card.css("opacity", "1");
    $cardSelect.hide();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
    $(".change").text(`Cartão de Débito.`);
    $(".change").show();
  });

  $cartFinishButton.on("click", function () {
    finishOrderObject();
  });
}

// Helper para desenhar o item no carrinho (extraída do código original para organização)
function renderCartItem(item) {
  const precoTotal = item.preco * item.qtd;
  const precoFormatado =
    precoTotal.toFixed(2).replace(".", ",") + " (x " + item.qtd + ")";

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
    console.error(
      "Erro ao tentar adicionar item ao carrinho visualmente:",
      error
    );
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
  $("#subtotal-price-value").text(
    "R$ " + precoTotal.toFixed(2).replace(".", ",")
  );
  $("#final-price-value").text(
    "R$ " + precoTotalFrete.toFixed(2).replace(".", ",")
  );
  precoGeral = precoTotal;
}

function increaseItem(id) {
  const currentProduct = cart.find((item) => item.id == id);
  if (currentProduct) {
    currentProduct.qtd++;
    updateCartProductState(id);
    updateCartPriceState();
    saveCartToStorage();
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
    saveCartToStorage();
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
  saveCartToStorage();
}

function showAlert(message, color) {
  $alertBox.text(message);
  $alertBox.css("background-color", color);
  $alertBox.css("display", "block");
  setTimeout(() => {
    $alertBox.css("display", "none");
  }, 2000);
}

function finishOrderObject() {
  const nomeCliente = $clientName.val().trim();
  const enderecoEntrega = $adress.val().trim();
  const observacoes = $observacao.val().trim();

  if (cart.length === 0) return showAlert("O carrinho está vazio.", "#f44336");
  if (paymentSelected == "")
    return showAlert("Selecione um meio de pagamento.", "#f44336");
  if (enderecoEntrega == "")
    return showAlert("Digite seu endereço.", "#f44336");
  if (nomeCliente == "") return showAlert("Digite seu nome.", "#f44336");

  fullOrderObject.cliente = nomeCliente;
  fullOrderObject.endereco = enderecoEntrega;
  fullOrderObject.pagamento = paymentSelected;
  fullOrderObject.observacoes = observacoes;
  fullOrderObject.produtos = cart.map((item) => ({
    nome: item.nome,
    qtd: item.qtd,
  }));

  saveUserData(nomeCliente, enderecoEntrega);
  makeOrderMessage();
  redirectUser();
}

function makeOrderMessage() {
  const itensFormatados = fullOrderObject.produtos
    .map((item) => `- (${item.qtd}x) ${item.nome}`)
    .join("\n");
  const valorTroco =
    change > 0
      ? ` (Troco para R$ ${parseFloat(change).toFixed(2).replace(".", ",")})`
      : "";
  const obs = fullOrderObject.observacoes
    ? `\nObservações: ${fullOrderObject.observacoes}`
    : "";
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
  const numeroTelefone = `55${configsLojaGlobal[0].numero_de_whatsapp}`;
  const urlBase = "https://api.whatsapp.com/send";
  const urlCompleta = `${urlBase}?phone=${numeroTelefone}&text=${encodeURIComponent(
    orderResumeMessage
  )}`;
  window.open(urlCompleta, "_blank");
  clearCartStorage();
  location.reload();
}

function saveCartToStorage() {
  // Salva o estado atual do carrinho no navegador
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("shoppingCart");
  
  if (savedCart) {
    // 1. Converte texto de volta para Objeto
    const parsedCart = JSON.parse(savedCart);
    
    // 2. Se tiver itens, restaura
    if (parsedCart.length > 0) {
      cart = parsedCart; // Atualiza a variável global
      
      // 3. Renderiza visualmente cada item recuperado
      cart.forEach(item => {
        renderCartItem(item); // Essa função já existe no seu código e cria o HTML
        updateCartProductState(item.id); // Atualiza os textos de qtd e preço
      });

      // 4. Atualiza totais e esconde msg de vazio
      updateCartPriceState();
      $cartEmptyMsg.empty(); // Remove msg de "carrinho vazio"
      
      console.log("Carrinho restaurado com sucesso:", cart);
    }
  }
}

function clearCartStorage() {
  // Chamaremos isso APENAS quando for pro WhatsApp
  localStorage.removeItem("shoppingCart");
  // Opcional: Limpar a variável local também se quiser resetar a tela sem reload
  // cart = []; 
}
