class CartItem {
    constructor(id, productId, quantity, productPrice, productTitle, sum) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.productPrice = productPrice;
        this.productTitle = productTitle;
        this.sum = sum;
    }
}

export default CartItem;
