import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Button,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, fetchCartProducts } from "../../store/actions/cart";
import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import { addOrder } from "../../store/actions/orders";

const CartScreen = (props) => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const loadCart = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(fetchCartProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setError, setIsLoading]);

    useEffect(() => {
        loadCart();
    }, [dispatch, loadCart]);

    const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
    const cartItems = useSelector((state) => state.cart.items);

    if (isLoading) {
        return (
            <View style={styles.content}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.content}>
                <Text>An error occured</Text>
                <Button
                    title="Try Again"
                    onPress={loadProducts}
                    color={Colors.primaryColor}
                />
            </View>
        );
    }

    if (!isLoading && cartItems.length === 0) {
        return (
            <View style={styles.content}>
                <Text>There is no any product, please add some!</Text>
            </View>
        );
    }

    if (cartItems.length === 0 || !cartItems || cartTotalAmount === 0) {
        return (
            <View style={styles.content}>
                <Text>Cart is empty, feel free to add some products!</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>{cartTotalAmount}</Text>
                </Text>
                <Button
                    color={Colors.accentColor}
                    title="Order Now"
                    disabled={!cartItems.length}
                    onPress={() => {
                        dispatch(addOrder(cartItems, cartTotalAmount));
                        props.navigation.navigate("My Orders");
                    }}
                />
            </View>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => Math.random()}
                renderItem={(itemData) => (
                    <CartItem
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        onRemove={() => {
                            dispatch(removeFromCart(itemData.item.productId));
                        }}
                    />
                )}
            />
        </View>
    );
};

export const screenOptions = (navData) => {
    return {
        headerTitle: "Your Cart",
    };
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        padding: 10,
        shadowColor: "black",
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: "white",
    },
    summaryText: {
        fontFamily: "open-sans-bold",
        fontSize: 18,
    },
    amount: {
        color: Colors.primaryColor,
    },
});

export default CartScreen;
