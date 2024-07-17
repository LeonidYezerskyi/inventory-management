import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({ customerName: '', orderItems: [], orderDate: '', totalCost: 0, orderNumber: '' });
    const navigate = useNavigate();
    const serverURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${serverURL}/getOrder`, {
                    params: { _id: id }
                });
                if (response.data.length > 0) {
                    setOrder(response.data[0]);
                } else {
                    console.error('Order not found');
                }
            } catch (error) {
                console.error('There was an error fetching the order!', error);
            }
        };

        fetchOrder();
    }, [id, serverURL]);

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const updatedItems = order.orderItems.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        const updatedOrder = {
            ...order,
            orderItems: updatedItems,
            totalCost: calculateTotalCost(updatedItems)
        };

        setOrder(updatedOrder);
    };

    const handleRemoveProduct = (productId) => {
        const updatedItems = order.orderItems.filter(item => item.productId !== productId);
        setOrder(prevOrder => ({
            ...prevOrder,
            orderItems: updatedItems,
            totalCost: calculateTotalCost(updatedItems)
        }));
    };

    const calculateTotalCost = (items) => {
        return items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${serverURL}/updateOrder`, {
                ...order,
                _id: id
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate('/orders');
        } catch (error) {
            console.error('There was an error updating the order!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Update Order</h2>
            <div className="mb-4">
                <label className="block mb-2">Order Number:</label>
                <p>{order.orderNumber}</p>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Customer Name:</label>
                <input type="text" name="customerName" value={order.customerName} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Order Date:</label>
                <p>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Products:</label>
                <ul>
                    {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map(item => (
                            <li key={item.productId} className="mb-2 p-4 border rounded shadow-sm flex justify-between">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p>Category: {item.category}</p>
                                    <p>Price: ${item.price}</p>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                                        className="mt-2 p-1 border rounded"
                                        min="0"
                                    />
                                </div>
                                <button onClick={() => handleRemoveProduct(item.productId)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                            </li>
                        ))
                    ) : (
                        <li>No items found</li>
                    )}
                </ul>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Total Cost:</label>
                <p>${order.totalCost.toFixed(2)}</p>
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Update Order</button>
        </form>
    );
};

export default UpdateOrder;
