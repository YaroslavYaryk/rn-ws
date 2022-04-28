import React, { useEffect, useState, useCallback } from "react";
import {
    FlatList,
    Text,
    Platform,
    View,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import OrderItem from "../../components/shop/OrderItem";
import HeaderButton from "../../components/UI/HeaderButton";
import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(orderActions.fetchOrders());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setError, setIsLoading]);

    useEffect(() => {
        loadOrders();
    }, [dispatch, loadOrders]);

    if (orders.length === 0 || !orders) {
        return (
            <View style={styles.content}>
                <Text>You don't have any order, please get some!</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occured</Text>
                <Button
                    title="Try Again"
                    onPress={loadProducts}
                    color={Colors.primaryColor}
                />
            </View>
        );
    }

    if (!isLoading && orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>There is no any order, please add some!</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => Math.random()}
            renderItem={(itemData) => (
                <OrderItem
                    item={itemData.item}
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
                    onDelete={() => {
                        dispatch(orderActions.deleteOrder(itemData.item.id));
                    }}
                />
            )}
        />
    );
};

export const screenOptions = (navData) => {
    return {
        headerTitle: "Your Orders",
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName={
                        Platform.OS === "android" ? "md-menu" : "ios-menu"
                    }
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default OrdersScreen;
