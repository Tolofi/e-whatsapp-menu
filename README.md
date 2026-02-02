# 1. Cardápio Digital (Envio via WhatsApp)

> Um sistema de cardápio digital front-end simples, permitindo que clientes adicionem produtos ao carrinho, preencham seus dados e enviem o pedido diretamente via WhatsApp.

![Status do Projeto](https://img.shields.io/badge/Status-Funcional-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## Visão Geral

O **Cardápio Digital** foi projetado para pequenos comércios e restaurantes que buscam automação sem a complexidade de um backend robusto:
1.  **O Cardápio:** Uma interface web responsiva onde o cliente visualiza produtos e gerencia seu carrinho.
2.  **O "Backend":** Utiliza uma planilha (Google Sheets/Excel) para simular um banco de dados, permitindo a atualização fácil de preços e produtos, e o **Local Storage** para persistir dados no navegador do cliente.

O objetivo é agilizar o atendimento automatizando a formatação do pedido, que chega pronto para o atendente no WhatsApp.

## Funcionalidades Principais

* **Carrinho Dinâmico:** Adição e remoção de produtos em tempo real.
* **Integração com WhatsApp:** Geração automática de uma mensagem pré-formatada com o resumo do pedido e dados do cliente.
* **Gestão Simplificada:** Atualização do estado dos produtos e informações da loja via planilha.
* **Persistência de Dados:** Utiliza **Local Storage** para salvar o carrinho e endereço, garantindo que o cliente não perca o pedido se fechar a aba.
* **Feedback Visual:** Mensagens de erro e instabilidade tratadas na interface.

## Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web fundamentais (Front-end Puro):

**Front-end:**
* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5** (Estrutura)
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3** (Estilização)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript / jQuery** (Lógica e Manipulação do DOM)

**Integrações:**
* ![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white) **WhatsApp API** (Via Link)
* ![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=flat&logo=google-sheets&logoColor=white) **Planilha** (Simulação de Banco de Dados)

## Como Rodar o Projeto Localmente

Como o projeto é front-end puro, não é necessário instalar dependências de servidor (Node.js, PHP, etc).

### Pré-requisitos
* Um navegador web moderno (Chrome, Firefox, Edge).
* Um editor de código (opcional, para edições).

## Passo 1: Baixando o Código

### Clone o repositório
```bash
git clone https://github.com/SeuUsuario/Cardapio-Digital.git
```

### Entre na pasta do projeto
```bash
cd Cardapio-Digital
```

## Passo 2: Configuração (Planilha)
O "cérebro" dos dados é a planilha.
1.  A planilha é pré-disponibilizada no projeto.
2.  Para personalizar (mudar produtos, preços e o **número de WhatsApp** que recebe o pedido), edite as células da planilha e exporte/conecte conforme a lógica do arquivo `data.js`.

## Passo 3: Utilizando
Basta abrir o arquivo `index.html` diretamente no seu navegador.

1.  **Navegando:** Clique nos produtos desejados para adicioná-los ao carrinho.
2.  **Revisando:** Clique no ícone do carrinho para ver o resumo.
3.  **Finalizando:**
    * Preencha os dados de entrega.
    * Clique em **"Enviar Pedido"**.
    * O WhatsApp Web (ou App) abrirá com a mensagem pronta. Basta o cliente clicar em enviar.

> **Nota:** A ação de envio final no WhatsApp depende do cliente, evitando spam ou pedidos duplicados acidentais.

---

## Estrutura de Arquivos
* `index.html` / `style.css`: Camada visual e estrutural.
* `data.js`: Funções auxiliares para tratamento dos dados vindos da planilha.
* `index.js`: Lógica principal (Carrinho, Local Storage, Renderização e API do WhatsApp).

# 2. Contribuição e Objetivos Futuros

## Contribuição

Este é um projeto open-source ideal para iniciantes! Se você quer melhorar o design ou a lógica:

1.  Faça um **Fork** do projeto.
2.  Crie uma Branch para sua feature (`git checkout -b feature/NovoDesign`).
3.  Commit suas mudanças (`git commit -m 'Melhora responsividade mobile'`).
4.  Faça o Push para a Branch (`git push origin feature/NovoDesign`).
5.  Abra um **Pull Request**.

### Encontrou um bug?
Sinta-se à vontade para abrir uma **Issue** relatando problemas com a formatação da mensagem ou carregamento da planilha.

### Roadmap / Próximos Passos
- [ ] Migração e refatoração completa para **React** visando melhor gerenciamento de estado.
- [ ] Melhoria na interface de administração da planilha.
- [ ] Adição de opções de variações de produtos (tamanho, adicionais).
- [ ] Integração com APIs de pagamento (opcional).

### Desenvolvido por Tolofi.
