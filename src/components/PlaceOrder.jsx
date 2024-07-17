// src/components/PlaceOrder.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState({ customerName: '', orderItems: [] });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleProductChange = (index, e) => {
        const newOrderItems = [...order.orderItems];
        newOrderItems[index][e.target.name] = e.target.value;
        setOrder({ ...order, orderItems: newOrderItems });
    };

    const addOrderItem = () => {
        setOrder({ ...order, orderItems: [...order.orderItems, { productId: '', quantity: 0 }] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/orders', order)
            .then(() => {
                navigate('/orders');
            })
            .catch(error => {
                console.error('There was an error placing the order!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Place Order</h2>
            <div className="mb-4">
                <label className="block mb-2">Customer Name:</label>
                <input type="text" name="customerName" value={order.customerName} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            {order.orderItems.map((item, index) => (
                <div key={index} className="mb-4">
                    <label className="block mb-2">Product:</label>
                    <select name="productId" value={item.productId} onChange={(e) => handleProductChange(index, e)} className="w-full p-2 border rounded">
                        <option value="">Select a product</option>
                        {products.map(product => (
                            <option key={product._id} value={product._id}>{product.name}</option>
                        ))}
                    </select>
                    <label className="block mb-2">Quantity:</label>
                    <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleProductChange(index, e)} className="w-full p-2 border rounded" />
                </div>
            ))}
            <button type="button" onClick={addOrderItem} className="w-full p-2 bg-blue-500 text-white rounded mb-4">Add Item</button>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Place Order</button>
        </form>
    );
};

export default PlaceOrder;
