let buyCart = $(".buy-container");
let menuContainer = $(".menu-container");
let 

function showCart() {
    buyCart.css("display", "flex");
    menuContainer.hide();
}
function showMenu() {
    menuContainer.css("display", "flex");
    buyCart.hide();
}

// Cart logic

function removeItem(item) {

}

function increaseItem(item) {
    item.data('id')
}

function decreaseItem(Item) {

}