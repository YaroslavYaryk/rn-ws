import React from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    Button,
    StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../store/actions/cart";

import Colors from "../../constants/Colors";

const ProductDetailScreen = (props) => {
    const productId = props.route.params.productId;
    const selectedProduct = useSelector((state) =>
        state.products.availableProducts.find((prod) => prod.id === productId)
    );

    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image
                style={styles.image}
                source={{ uri: selectedProduct.imageUrl }}
            />
            <View style={styles.actions}>
                <Button
                    color={Colors.primaryColor}
                    title="Add to Cart"
                    onPress={() => {
                        dispatch(addToCart(selectedProduct));
                        alert("Successfully added item to the Cart!");
                    }}
                />
            </View>
            <Text style={styles.price}>
                ${selectedProduct.price.toFixed(2)}
            </Text>
            <Text style={styles.description}>
                {selectedProduct.description}
            </Text>
        </ScrollView>
    );
};

export const screenOptions = (navData) => {
    return {
        headerTitle: navData.route.params.productTitle,
    };
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 300,
    },
    actions: {
        marginVertical: 10,
        alignItems: "center",
    },
    price: {
        fontSize: 20,
        color: "#888",
        textAlign: "center",
        marginVertical: 20,
    },
    description: {
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 20,
    },
});

export default ProductDetailScreen;
