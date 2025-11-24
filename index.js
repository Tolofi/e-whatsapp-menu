import { carregarMenuCompleto } from "./data.js"; 

const frete = 4;

let change = 0;
let precoGeral = 0;
let paymentSelected = "";
let orderResumeMessage = "";
// Inicializa fullOrderObject com as propriedades esperadas
let fullOrderObject = {
  cliente: "",
  pagamento: "",
  endereco: "",
  observacoes: "",
  produtos: [],
};

// Seletores JQuery
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
let $clientName = $("#client-name"); // NOVO: Seletor para o nome do cliente

$(document).ready(async function () {
  // Coloque um carregando se quiser
  console.log("Iniciando app...");
  
  try {
      // Aqui nós chamamos a função e esperamos ela terminar
      const produtosPorCategoria = await carregarMenuCompleto();
      
      fillMenu(produtosPorCategoria);
      loadUserData();
      listeners(); // Mova os listeners para cá para garantir que só rodem com o menu pronto
      
  } catch (error) {
      console.error("Erro fatal ao carregar menu:", error);
      alert("Erro ao carregar o cardápio. Verifique sua conexão.");
  }
});

$(document).ready(async function () {
  try {
      // 2. Carrega os dados e salva na variável GLOBAL
      cardapioGlobal = await carregarMenuCompleto();
      
      // 3. Preenche o menu e inicia os ouvintes
      fillMenu(cardapioGlobal);
      listeners(); 
      loadUserData();
  } catch (error) {
      console.error("Erro:", error);
  }
});

// ========================================================
// FUNÇÕES DE LOCAL STORAGE
// ========================================================

function saveUserData(cliente, endereco) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("cliente", cliente);
    localStorage.setItem("endereco", endereco);
    console.log("Dados do cliente e endereço salvos no localStorage.");
  }
}


function loadUserData() {
  if (typeof Storage !== "undefined") {
    const savedClient = localStorage.getItem("cliente");
    const savedAddress = localStorage.getItem("endereco");

    if (savedClient) {
      $clientName.val(savedClient);
    }
    if (savedAddress) {
      $adress.val(savedAddress);
    }
  }
}

// ========================================================
// INICIALIZAÇÃO E FUNÇÕES BÁSICAS
// ========================================================

$(document).ready(function () {
  fillMenu(produtosPorCategoria);
  loadUserData(); // NOVO: Carrega dados ao iniciar
});

function setUpProductCard(imagem, nome, preco, id, descricao) {
  console.log(`${id}, nome: ${nome}`);
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
                  Adicionar
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

    for (let categoria in cardapioGlobal) { 
      let categoriaAtual = cardapioGlobal[categoria];
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
    showCart(); // 1. Sempre mostra o container do carrinho

    if (cart.length > 0) {
      // 2. Se houver itens, apenas para a execução, mantendo os itens que já foram adicionados
      // e escondendo a mensagem de "vazio".
      console.log("Carrinho carregado com itens.");

      // **IMPORTANTE**: Garante que o texto de "vazio" seja removido
      // caso o carrinho estivesse vazio, o usuário adicionou itens e agora clica no botão.
      // Se o seu HTML inicial já tem o div `.cart-items` vazio, você pode omitir as duas linhas abaixo
      // se o conteúdo dos itens está sendo gerado de forma correta e limpa.
      if (
        $cartItemsContainer.text() ===
        "O carrinho está vazio. Adicione alguns itens!"
      ) {
        $cartItemsContainer.empty();
      }

      return;
    }

    // 3. Se o carrinho estiver vazio, exibe a mensagem de vazio
    $cartItemsContainer.empty();
    $cartItemsContainer.text("O carrinho está vazio. Adicione alguns itens!");
    console.log("Carrinho vazio.");
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
  $money.on("click", function () {
    cardClicked = false;
    moneyClicked = true;

    // Configura a opacidade
    $money.css("opacity", "1");
    $card.css("opacity", "0.5");
    $pix.css("opacity", "0.5");

    // Abre o modal de troco
    $moneyChangeMessage.css("display", "flex");
    $buyCart.css("filter", "blur(5px)");
    $buyCart.css("pointer-events", "none");
    console.log("Dinheiro clicado. Aguardando troco.");
  });

  $pix.on("click", function () {
    cardClicked = false;
    moneyClicked = false;
    paymentSelected = "Pix";
    // Configura a opacidade
    $money.css("opacity", "0.5");
    $card.css("opacity", "0.5");
    $pix.css("opacity", "1");

    // Abre o modal de troco
  });

  $card.on("click", function () {
    moneyClicked = false;
    cardClicked = true;

    // Configura a opacidade
    $card.css("opacity", "1");
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");

    // Abre o modal de cartão
    $buyCart.css("filter", "blur(5px)");
    $buyCart.css("pointer-events", "none");
    $cardSelect.css("display", "flex");
    console.log("Cartão clicado. Selecionar tipo.");
  });

  $moneyChangeConfirmation.on("click", function () {
    if ($moneyChangeValue.val() == "") {
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
      change = parseFloat($moneyChangeValue.val().trim().replace(",", "."));
      $moneyChangeValue.css("border", "1px solid #ccc");
      $buyCart.css("filter", "none");
      $buyCart.css("pointer-events", "auto");
      $moneyChangeMessage.hide();
      paymentSelected = `Dinheiro (Troco: R$ ${change
        .toFixed(2)
        .replace(".", ",")})`;
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
    $moneyChangeValue.css("border", "1px solid #ccc");
    $moneyChangeValue.attr("placeholder", "");

    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");
    $moneyChangeMessage.hide();

    // $(".change").empty();
    // $(".change").hide();

    console.log(paymentSelected);
  });

  $creditCard.on("click", function () {
    paymentSelected = "Cartão de Crédito";
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $card.css("opacity", "1");

    $moneyChangeValue.val("");
    $cardSelect.hide();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");

    change = 0;
    $(".change").empty().hide();
    console.log(paymentSelected);
  });

  $debitCard.on("click", function () {
    paymentSelected = "Cartão de Débito";
    $money.css("opacity", "0.5");
    $pix.css("opacity", "0.5");
    $card.css("opacity", "1");

    $moneyChangeValue.val("");
    $cardSelect.hide();
    $buyCart.css("filter", "none");
    $buyCart.css("pointer-events", "auto");

    change = 0;
    $(".change").empty().hide();
    console.log(paymentSelected);
  });

  $cartFinishButton.on("click", function () {
    finishOrderObject();
  });
  $("#delivery-price").text(`R$ ${frete.toFixed(2).replace(".", ",")}`);
  $("#final-price-value").text(`R$ ${frete.toFixed(2).replace(".", ",")}`);
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

function finishOrderObject() {
  const nomeCliente = $clientName.val().trim();
  const enderecoEntrega = $adress.val().trim();
  const observacoes = $observacao.val().trim();

  // 1. Validação de Carrinho
  if (cart.length === 0) {
    showAlert("O carrinho está vazio.", "#f44336");
    return;
  }

  // 2. Validação de Pagamento
  if (paymentSelected == "") {
    showAlert("Você deve selecionar um meio de pagamento.", "#f44336");
    return;
  }
  fullOrderObject.pagamento = paymentSelected;

  // 3. Validação de Endereço
  if (enderecoEntrega !== "") {
    fullOrderObject.endereco = enderecoEntrega;
  } else {
    showAlert("Você deve digitar um endereço.", "#f44336");
    return;
  }

  // 4. Validação de Cliente
  if (nomeCliente !== "") {
    fullOrderObject.cliente = nomeCliente;
  } else {
    showAlert("Você deve digitar seu nome.", "#f44336");
    return;
  }

  // 5. Salva os dados no localStorage antes de prosseguir
  saveUserData(nomeCliente, enderecoEntrega);

  // 6. Adiciona as observações e prepara produtos
  fullOrderObject.observacoes = observacoes;
  fullOrderObject.produtos = cart.map((item) => ({
    nome: item.nome,
    qtd: item.qtd,
  }));

  // Se todas as validações passarem, gera a mensagem e redireciona
  makeOrderMessage();
  redirectUser();
}

function makeOrderMessage() {
  // === LÓGICA PARA FORMATAR OS ITENS ===
  const itensFormatados = fullOrderObject.produtos
    .map((item) => {
      return `- (${item.qtd}x) ${item.nome}`;
    })
    .join("\n");

  const valorTroco =
    change > 0
      ? ` (Troco para R$ ${parseFloat(change).toFixed(2).replace(".", ",")})`
      : "";

  const observacoes = fullOrderObject.observacoes
    ? `\nObservações: ${fullOrderObject.observacoes}`
    : "";

  // === MONTAGEM FINAL DA MENSAGEM ===
  const precoTotalFrete = (precoGeral + frete).toFixed(2).replace(".", ",");

  const mensagem = `*-- Resumo do Pedido --*
----------------------------
Cliente: ${fullOrderObject.cliente}

Itens:
${itensFormatados}
${observacoes}

----------------------------
Subtotal: R$ ${precoGeral.toFixed(2).replace(".", ",")}
Frete: R$ ${frete.toFixed(2).replace(".", ",")}
*Total Final:* R$ ${precoTotalFrete}

*Forma de Pagamento:* ${fullOrderObject.pagamento}${valorTroco}
*Endereço:* ${fullOrderObject.endereco}`;

  orderResumeMessage = mensagem;
  console.log(orderResumeMessage);
}

function redirectUser() {
  const numeroTelefone = "5519998964995"; // <-- Troque por seu número!
  const urlBase = "https://api.whatsapp.com/send";

  // Codifica a mensagem para ser usada na URL
  const mensagemEncoded = encodeURIComponent(orderResumeMessage);

  const urlCompleta = `${urlBase}?phone=${numeroTelefone}&text=${mensagemEncoded}`;

  // Abre em uma nova aba (_blank)
  window.open(urlCompleta, "_blank");
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
