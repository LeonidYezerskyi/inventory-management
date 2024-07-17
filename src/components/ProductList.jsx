import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
