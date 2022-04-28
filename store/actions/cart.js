import CartItem from "../../models/CartItem";

export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const READ_CART = "READ_CART";

export const fetchCartProducts = () => {
    try {
        return async (dispatch) => {
            const response = await fetch(
                "https://web-store-app-d2355-default-rtdb.firebaseio.com/cart.json"
            );

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const resData = await response.json();
            const loadedCartProducts = [];
            let countItems = 0;
            for (const key in resData) {
                countItems += resData[key].quantity;
                loadedCartProducts.push(
                    new CartItem(
                        key,
                        resData[key].product.id,
                        resData[key].quantity,
                        resData[key].product.price,
                        resData[key].product.title,
                        resData[key].product.price * resData[key].quantity
                    )
                );
            }
            dispatch({
                type: READ_CART,
                cartProducts: loadedCartProducts,
                countItems: countItems,
            });
        };
    } catch (err) {
        throw err;
    }
};

export const addToCart = (product) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        const response1 = await fetch(
            "https://web-store-app-d2355-default-rtdb.firebaseio.com/cart.json"
        );
        const resData1 = await response1.json();
        let previousuantity = 0;
        let cartId;
        for (const key in resData1) {
            if (resData1[key].product.id == product.id) {
                previousuantity = resData1[key].quantity;
                cartId = key;
            }
        }
        let response;
        if (previousuantity) {
            response = await fetch(
                `https://web-store-app-d2355-default-rtdb.firebaseio.com/cart/${cartId}.json?auth=${token}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: previousuantity + 1,
                    }),
                }
            );
        } else {
            response = await fetch(
                `https://web-store-app-d2355-default-rtdb.firebaseio.com/cart.json?auth=${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        product: product,
                        quantity: 1,
                    }),
                }
            );
        }

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const resData = await response.json();
        dispatch({
            type: ADD_TO_CART,
            orderData: {
                id: resData.name,
                product: product,
            },
        });
    };
};

export const removeFromCart = (productId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        const response1 = await fetch(
            `https://web-store-app-d2355-default-rtdb.firebaseio.com/cart.json`
        );
        const resData1 = await response1.json();
        let previousuantity = 0;
        let cartId;
        for (const key in resData1) {
            if (resData1[key].product.id == productId) {
                previousuantity = resData1[key].quantity;
                cartId = key;
            }
        }
        let response;
        if (previousuantity > 1) {
            response = await fetch(
                `https://web-store-app-d2355-default-rtdb.firebaseio.com/cart/${cartId}.json?auth=${token}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: previousuantity - 1,
                    }),
                }
            );
        } else {
            response = await fetch(
                `https://web-store-app-d2355-default-rtdb.firebaseio.com/cart/${cartId}.json?auth=${token}`,
                {
                    method: "DELETE",
                }
            );
        }

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        dispatch({
            type: REMOVE_FROM_CART,
            productId: productId,
        });
    };
};
