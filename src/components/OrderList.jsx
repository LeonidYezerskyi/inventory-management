// src/components/OrderList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Order List</h2>
            <ul className="space-y-2">
                {orders.map(order => (
                    <li key={order._id} className="p-4 border rounded shadow-sm">
                        <p className="font-semibold">Order #{order.orderNumber}</p>
                        <p>Customer: {order.customerName}</p>
                        <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p>Total Cost: ${order.totalCost}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
