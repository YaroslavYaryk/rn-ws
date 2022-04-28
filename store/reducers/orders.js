import { ADD_ORDER, READ_ORDER, DELETE_ORDER } from "../actions/orders";
import Order from "../../models/Order";

const initialState = {
    orders: [],
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case READ_ORDER:
            return {
                orders: action.orders,
            };

        case ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder),
            };
        case DELETE_ORDER:
            return {
                ...state,
                orders: state.orders.filter(
                    (order) => order.id !== action.orderId
                ),
            };
    }

    return state;
};

export default orderReducer;
