# Cardápio Digital com Envio via WhatsApp

Um sistema de cardápio digital front-end simples, permitindo que clientes adicionem produtos ao carrinho, preencham seus dados e enviem o pedido diretamente via WhatsApp. Ideal para restaurantes ou pequenos comércios que querem automatizar pedidos sem backend complexo.

---

## - Funcionalidades

- Adiciona produtos ao carrinho a partir do cardápio
- Envio de pedido via WhatsApp com mensagem pré-formatada
- Mensagem de instabilidade exibida em caso de erro
- Atualização do estado dos produtos e da loja via planilha (simulando banco de dados)
- Utiliza Local Storage para salvar o carrinho e dados referentes a entrega no navegador

---

## - Tecnologias utilizadas

- **HTML5** – estrutura do site
- **CSS3** – estilo visual
- **JavaScript / jQuery** – lógica de interação e manipulação do DOM
- **WhatsApp API (simulada via link)** – envio de pedidos
- **Local Storage** – persistência de carrinho

> Obs: Atualmente é front-end puro. Um rework em React é possível para otimizar componentes e estado.

---

## - Como usar

1. Abra o arquivo `index.html` no navegador
2. A planilha é pré-disponibilizada e o número em que o pedido é enviado é configurado na planilha, então caso você queira personalizar o site é necessário que você personalize a planilha.
3. Navegue pelo cardápio e clique nos produtos para adicioná-los ao carrinho  
4. Clique no carrinho para revisar os produtos e preencher os dados do cliente  
5. Clique em **Enviar Pedido**   
  - Redireciona o cliente para WhatsApp com pedido pré-formatado
  - Clique em enviar mensagem
  - Quem clica em enviar o pedido no WhatsApp é o próprio client. Isso evita envio duplicado de pedido

---

## - Estrutura do projeto
- `index.html`/`style.css` - Responsáveis pela parte visual do site.
- `data.js` - Funções auxiliares responsáveis por manusear dados vindos da planilha.
- `index.js` - Responsável pela lógica do site, isso inclui lógica do carrinho, renderização dinâmica do cardápio, armazenamento dos dados do cliente no local storage, formatação e envio do pedido formatada via api do WhatsApp. 

