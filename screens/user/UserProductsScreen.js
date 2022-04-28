import React, { useState, useEffect, useCallback } from "react";
import {
    FlatList,
    Button,
    Platform,
    Alert,
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import * as productsActions from "../../store/actions/products";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import { deleteProduct } from "../../store/actions/products";

const UserProductsScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setError, setIsLoading]);

    useEffect(() => {
        if (error) {
            Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
        }
    }, [error]);

    useEffect(() => {
        const onFocusSub = props.navigation.addListener(
            "WillFocus",
            loadProducts
        );

        return () => {
            onFocusSub.remove();
        };
    }, [loadProducts]);

    useEffect(() => {
        loadProducts();
    }, [dispatch, loadProducts]);

    const userProducts = useSelector((state) => state.products.userProducts);
    const dispatch = useDispatch();

    const deleteHandler = (id) => {
        try {
            Alert.alert(
                "Are you sure?",
                "Do you really want to delete this item?",
                [
                    { text: "No", style: "default" },
                    {
                        text: "Yes",
                        style: "destructive",
                        onPress: () => {
                            dispatch(deleteProduct(id));
                        },
                    },
                ]
            );
        } catch (err) {
            Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
        }
    };

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

    if (!isLoading && userProducts.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>There is no any product, please add some!</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={userProducts}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        props.navigation.navigate({
                            routeName: "EditProduct",
                            params: {
                                productId: itemData.item.id,
                            },
                        });
                    }}
                >
                    <Button
                        color={Colors.primaryColor}
                        title="Edit"
                        onPress={() => {
                            props.navigation.navigate("EditProduct", {
                                productId: itemData.item.id,
                            });
                        }}
                    />
                    <Button
                        color={Colors.primaryColor}
                        title="Delete"
                        onPress={() => {
                            deleteHandler(itemData.item.id);
                        }}
                    />
                </ProductItem>
            )}
        />
    );
};

export const screenOptions = (navData) => {
    return {
        headerTitle: "Your Products",
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
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Add"
                    iconName={
                        Platform.OS === "android" ? "md-create" : "ios-create"
                    }
                    onPress={() => {
                        navData.navigation.navigate("EditProduct");
                    }}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default UserProductsScreen;
