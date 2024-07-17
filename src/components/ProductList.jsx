import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantityInputs, setQuantityInputs] = useState({});
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const storedProducts = localStorage.getItem('selectedProducts');
        if (storedProducts) {
            setSelectedProducts(JSON.parse(storedProducts));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    useEffect(() => {
        axios.get(`${apiUrl}/getProducts`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    const handleDelete = (productId) => {
        axios.delete(`${apiUrl}/deleteProduct`, {
            data: { _id: productId }
        })
            .then(() => {
                setProducts(products.filter(product => product._id !== productId));
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    };

    const addToSelectedProducts = (productId) => {
        const productToAdd = products.find(product => product._id === productId);

        if (selectedProducts.some(product => product._id === productId)) {
            alert('Цей продукт вже доданий до замовлення!');
            return;
        }

        setSelectedProducts([...selectedProducts, { ...productToAdd, quantity: 1 }]);
        setQuantityInputs({ ...quantityInputs, [productId]: 1 });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantityInputs({ ...quantityInputs, [productId]: newQuantity });
        const updatedSelectedProducts = selectedProducts.map(product => {
            if (product._id === productId) {
                return { ...product, quantity: newQuantity };
            }
            return product;
        });
        setSelectedProducts(updatedSelectedProducts);
    };

    const handlePlaceOrder = () => {
        navigate('/place-order');
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Product List</h2>
            <ul className="space-y-2">
                {products.map(product => (
                    <li key={product._id} className="p-4 border rounded shadow-sm">
                        <p className="font-semibold">{product.name}</p>
                        <p>Category: {product.category}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Видалити
                            </button>
                            <Link to={`/add-edite-product/${product._id}`} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                                Редагувати
                            </Link>
                            <button
                                onClick={() => addToSelectedProducts(product._id)}
                                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Додати в замовлення
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Selected Products</h3>
                <ul className="space-y-2">
                    {selectedProducts.map(product => (
                        <li key={product._id} className="p-4 border rounded shadow-sm">
                            <p className="font-semibold">{product.name}</p>
                            <p>Category: {product.category}</p>
                            <p>Price: ${product.price}</p>
                            <div className="flex items-center">
                                <label className="block mr-2">Quantity:</label>
                                <input
                                    type="number"
                                    value={quantityInputs[product._id] || 1}
                                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                    className="w-20 p-2 border rounded"
                                    min="1"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
                {selectedProducts.length > 0 && (
                    <div className="mt-4">
                        <button onClick={handlePlaceOrder} className="w-full p-2 bg-blue-500 text-white rounded">Place Order</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
