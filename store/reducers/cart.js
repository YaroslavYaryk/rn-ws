import { ADD_TO_CART, REMOVE_FROM_CART, READ_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import CartItem from "../../models/CartItem";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case READ_CART:
            return {
                items: action.cartProducts,
                totalAmount: action.countItems,
            };

        case ADD_TO_CART:
            const addedProduct = action.orderData.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                // already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                );
            } else {
                updatedOrNewCartItem = new CartItem(
                    1,
                    prodPrice,
                    prodTitle,
                    prodPrice
                );
            }
            return {
                ...state,
                items: {
                    ...state.items,
                    [addedProduct.id]: updatedOrNewCartItem,
                },
                totalAmount: state.totalAmount + prodPrice,
            };
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items.find(
                (elem) => elem.productId === action.productId
            );
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                // need to reduce it, not erase it

                const newState = state.items;
                for (const key in newState) {
                    if (newState[key].productId === action.productId) {
                        newState[key].quantity -= 1;
                        newState[key].sum -= newState[key].productPrice;
                    }
                }
                updatedCartItems = newState;
            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.productId];
            }

            return {
                // ...state,
                items: updatedCartItems,
                totalAmount: currentQty - 1,
            };
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.productId]) return state;

            const updatedItems = { ...state.items };

            const itemTotal = state.items[action.productId].sum;

            delete updatedItems[action.productId];
            return {
                // ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal,
            };
    }
    return state;
};

export default cartReducer;
