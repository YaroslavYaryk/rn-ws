import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import ProductNavigator from "../navigation/ProductNavigator";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import StartupScreen from "../screens/StartupScreen";
import { ShopNavigator, AuthNavigator } from "./ProductNavigator";

const AppNavigator = (props) => {
    const isAuth = useSelector((state) => !!state.auth.token);
    const didTryAuth = useSelector((state) => state.auth.didTryToLogin);

    return (
        <NavigationContainer>
            {isAuth && <ShopNavigator />}
            {!isAuth && didTryAuth && <AuthNavigator />}
            {!isAuth && !didTryAuth && <StartupScreen />}
        </NavigationContainer>
    );
};

export default AppNavigator;
