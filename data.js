const URL_DA_PLANILHA = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGX4HAOxx5qe8JVGz4PGHA5Iq1ZwwkYN9yobWGUERLcaOwdD3Rss6uSbqkAJ6yH71UyBPwWplLNcBG/pub?output=csv';

export async function buscarDadosDoMenu() {
  try {
    console.log("Buscando dados da planilha...");
    // 1. Vai até a URL e pega a resposta
    const resposta = await fetch(URL_DA_PLANILHA);
    
    // 2. Transforma a resposta em um texto puro (o nosso CSV)
    const textoCsv = await resposta.text();
    console.log("Texto CSV recebido. Traduzindo...");

    // 3. Passa o texto para nossa função com Papa Parse
    const produtos = traduzirCsvParaObjetos(textoCsv);
    console.log("Tradução completa! Produtos:", produtos);

    // 4. Retorna o array de objetos prontinho para ser usado
    return produtos;

  } catch (erro) {
    console.error("Ocorreu um erro ao buscar ou processar o cardápio:", erro);
    return []; // Retorna um array vazio para não quebrar o resto do site
  }
}

function traduzirCsvParaObjetos(textoCsv) {
  
  // A função principal do Papa Parse.
  const resultado = Papa.parse(textoCsv, {
    
    // header: true  --> Esta é a opção MAIS IMPORTANTE.
    // Ela diz ao Papa Parse: "Olhe a primeira linha do meu arquivo.
    // Use os nomes das colunas ('id', 'categoria', 'preco', etc.)
    // como as chaves para os objetos que você vai criar."
    header: true,
    
    // dynamicTyping: true  --> Uma grande ajuda.
    // O Papa Parse vai tentar adivinhar o tipo de cada dado.
    // Se ele vir "2.00", ele vai transformar no número 2, em vez de
    // deixar como o texto "2.00". Isso é ótimo para você poder
    // fazer cálculos com os preços no carrinho.
    dynamicTyping: true,

    // skipEmptyLines: true  --> Uma boa prática.
    // Se o seu cliente deixar uma linha em branco no meio da planilha,
    // esta opção ignora essa linha e evita que ela vire um
    // "produto fantasma" (um objeto vazio) no seu cardápio.
    skipEmptyLines: true,
  });

  // O Papa Parse retorna um objeto grande com várias informações.
  // A parte que realmente nos interessa, o nosso array de produtos,
  // está dentro da propriedade .data.
  return resultado.data;
}

function agruparPorCategoria(produtos) {
  // O reduce vai iterar sobre cada 'produto' no array 'produtos'.
  // O 'acc' (acumulador) é o nosso objeto de categorias que estamos construindo.
  // Começamos com um objeto vazio: {}
  return produtos.reduce((acc, produto) => {
    
    // 1. Pega a categoria do produto atual (ex: "Premium").
    // A coluna na sua planilha deve se chamar "classe"
    const categoria = produto.classe; 

    // 2. Verifica se já criamos uma "gaveta" (chave) para esta categoria no nosso objeto.
    if (!acc[categoria]) {
      // Se não existe, cria a gaveta como um array vazio.
      // ex: acc['Premium'] = [];
      acc[categoria] = [];
    }
    
    // 3. Adiciona (push) o produto atual à sua respectiva gaveta.
    acc[categoria].push(produto);
    
    // 4. Retorna o acumulador (o objeto com as gavetas) para a próxima iteração.
    return acc;
    
  }, {}); // O {} no final é o valor inicial do nosso acumulador: um objeto vazio.
}
export async function carregarMenuCompleto() {
  const produtos = await buscarDadosDoMenu();
  return agruparPorCategoria(produtos);
}