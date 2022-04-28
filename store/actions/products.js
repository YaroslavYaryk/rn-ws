import Product from "../../models/Product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const READ_PRODUCT = "READ_PRODUCT";

export const fetchProducts = () => {
    try {
        return async (dispatch, getState) => {
            const userId = getState().auth.userId;

            const response = await fetch(
                "https://web-store-app-d2355-default-rtdb.firebaseio.com/products.json"
            );

            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const resData = await response.json();
            const loadedProducts = [];
            for (const key in resData) {
                loadedProducts.push(
                    new Product(
                        key,
                        resData[key].ownerId,
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price
                    )
                );
            }

            dispatch({
                type: READ_PRODUCT,
                products: loadedProducts,
                userProducts: loadedProducts.filter(
                    (elem) => elem.ownerId === userId
                ),
            });
        };
    } catch (err) {
        throw err;
    }
};

export const deleteProduct = (productId) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        const response = await fetch(
            `https://web-store-app-d2355-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        dispatch({
            type: DELETE_PRODUCT,
            productId: productId,
        });
    };
};

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;

        // any async code
        const response = await fetch(
            `https://web-store-app-d2355-default-rtdb.firebaseio.com/products.json?auth=${token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId,
                }),
            }
        );
        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const resData = await response.json();

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId,
            },
        });
    };
};

export const updateProduct = (
    productId,
    title,
    description,
    imageUrl,
    price
) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        const response = await fetch(
            `https://web-store-app-d2355-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl,
                }),
            }
        );
        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        dispatch({
            type: UPDATE_PRODUCT,
            productId,
            productData: {
                title,
                description,
                imageUrl,
                price,
            },
        });
    };
};
