<div align="right">
  <a href="README.md">
    <img src="https://img.shields.io/badge/Ler_em_Português-Brasil?style=for-the-badge&logo=brazil&logoColor=white">
  </a>
</div>

# 1. Digital Menu (Sending via WhatsApp)

> A simple front-end digital menu system that allows customers to add products to their cart, fill in their information, and send their order directly via WhatsApp.

![Project Status](https://img.shields.io/badge/Status-Functional-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## Overview

The **Digital Menu** was designed for small businesses and restaurants seeking automation without the complexity of a robust backend:
1.  **The Menu:** A responsive web interface where customers view products and manage their cart.
2.  **The "Backend":** Uses a spreadsheet (Google Sheets/Excel) to simulate a database, allowing easy updates of prices and products, along with **Local Storage** to persist data in the customer's browser.

The goal is to streamline service by automating order formatting, which arrives ready for the attendant on WhatsApp.

## Key Features

* **Dynamic Cart:** Real-time addition and removal of products.
* **WhatsApp Integration:** Automatic generation of a pre-formatted message with the order summary and customer information.
* **Simplified Management:** Update product availability and store information via spreadsheet.
* **Data Persistence:** Uses **Local Storage** to save the cart and address, ensuring customers don't lose their order if they close the tab.
* **Visual Feedback:** Error messages and connectivity issues handled in the interface.

## Technologies Used

The project was built using fundamental web technologies (Pure Front-end):

**Front-end:**
* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5** (Structure)
* ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3** (Styling)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript / jQuery** (Logic and DOM Manipulation)

**Integrations:**
* ![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white) **WhatsApp API** (Via Link)
* ![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=flat&logo=google-sheets&logoColor=white) **Spreadsheet** (Database Simulation)

## How to Run the Project Locally

Since the project is pure front-end, there's no need to install server dependencies (Node.js, PHP, etc).

### Prerequisites
* A modern web browser (Chrome, Firefox, Edge).
* A code editor (optional, for editing).

## Step 1: Downloading the Code

### Clone the repository
```bash
git clone https://github.com/YourUsername/Digital-Menu.git
```

### Enter the project folder
```bash
cd Digital-Menu
```

## Step 2: Configuration (Spreadsheet)
The "brain" of the data is the spreadsheet.
1.  The spreadsheet is pre-provided in the project.
2.  To customize (change products, prices, and the **WhatsApp number** that receives the order), edit the spreadsheet cells and export/connect according to the logic in the `data.js` file.

## Step 3: Using
Simply open the `index.html` file directly in your browser.

1.  **Browsing:** Click on desired products to add them to your cart.
2.  **Reviewing:** Click the cart icon to see the summary.
3.  **Finishing:**
    * Fill in your delivery information.
    * Click **"Send Order"**.
    * WhatsApp Web (or App) will open with the message ready. The customer just needs to click send.

> **Note:** The final sending action on WhatsApp depends on the customer, preventing spam or accidental duplicate orders.

---

## File Structure
* `index.html` / `style.css`: Visual and structural layer.
* `data.js`: Helper functions for processing data from the spreadsheet.
* `index.js`: Main logic (Cart, Local Storage, Rendering, and WhatsApp API).

# 2. Contributing and Future Goals

## Contributing

This is an open-source project ideal for beginners! If you want to improve the design or logic:

1.  **Fork** the project.
2.  Create a Branch for your feature (`git checkout -b feature/NewDesign`).
3.  Commit your changes (`git commit -m 'Improve mobile responsiveness'`).
4.  Push to the Branch (`git push origin feature/NewDesign`).
5.  Open a **Pull Request**.

### Found a bug?
Feel free to open an **Issue** reporting problems with message formatting or spreadsheet loading.

### Roadmap / Next Steps
- [ ] Complete migration and refactoring to **React** for better state management.
- [ ] Improvement in the spreadsheet administration interface.
- [ ] Addition of product variation options (size, add-ons).
- [ ] Integration with payment APIs (optional).

### Developed by Tolofi.
