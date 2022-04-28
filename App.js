import React, { useState } from "react";
import { combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import AppNavigator from "./navigation/AppNavigator";
import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import orderReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const rootReducer = combineReducers({
    products: productsReducer,
    cart: cartReducer,
    orders: orderReducer,
    auth: authReducer,
});

const store = configureStore(
    {
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                immutableCheck: false,
                serializableCheck: false,
            }),
    },
    applyMiddleware(ReduxThunk)
);

const fontsFetch = () => {
    return Font.loadAsync({
        "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
        "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    });
};

export default function App() {
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!dataLoaded) {
        return (
            <AppLoading
                startAsync={fontsFetch}
                onFinish={() => {
                    setDataLoaded(true);
                }}
                onError={console.warn}
            />
        );
    }

    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    );
}
