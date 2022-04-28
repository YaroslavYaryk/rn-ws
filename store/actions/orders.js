import Order from "../../models/Order";

export const ADD_ORDER = "ADD_ORDER";
export const READ_ORDER = "READ_ORDER";
export const DELETE_ORDER = "DELETE_ORDER";

export const fetchOrders = () => {
    try {
        return async (dispatch, getState) => {
            const userId = getState().auth.userId;
            const response = await fetch(
                `https://web-store-app-d2355-default-rtdb.firebaseio.com/orders/${userId}.json`
            );

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const resData = await response.json();
            const loadedOrders = [];
            for (const key in resData) {
                loadedOrders.push(
                    new Order(
                        key,
                        resData[key].cartItems,
                        resData[key].totalAmount,
                        new Date(resData[key].date)
                    )
                );
            }

            dispatch({
                type: READ_ORDER,
                orders: loadedOrders,
            });
        };
    } catch (err) {
        throw err;
    }
};

export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;

        const date = new Date();
        const response = await fetch(
            `https://web-store-app-d2355-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    date: date.toISOString(),
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const response22 = await fetch(
            `https://web-store-app-d2355-default-rtdb.firebaseio.com/cart.json?auth=${token}`,
            {
                method: "DELETE",
            }
        );

        const resData = await response.json();
        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: resData.name,
                items: cartItems,
                amount: totalAmount,
                date: date,
            },
        });
    };
};

export const deleteOrder = (orderId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;

        const response = await fetch(
            `https://web-store-app-d2355-default-rtdb.firebaseio.com/orders/${userId}/${orderId}.json?auth=${token}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        dispatch({
            type: DELETE_ORDER,
            orderId: orderId,
        });
    };
};
