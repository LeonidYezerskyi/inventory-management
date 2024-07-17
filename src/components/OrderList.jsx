import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    console.log("🚀 ~ OrderList ~ orders:", orders)
    const serverURL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [serverURL]);

    const fetchOrders = () => {
        axios.get(`${serverURL}/getOrders`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });
    };

    const handleDelete = (orderId) => {
        axios.delete(`${serverURL}/deleteOrder`, {
            data: { _id: orderId }
        })
            .then(response => {
                console.log('Order deleted successfully!', response.data);
                fetchOrders(); 
            })
            .catch(error => {
                console.error('There was an error deleting the order!', error);
            });
    };

    const handleUpdate = (orderId) => {
        navigate(`/update-order/${orderId}`,);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Order List</h2>
            <ul className="space-y-2">
                {orders.map(order => (
                    <li key={order._id} className="p-4 border rounded shadow-sm">
                        <p className="font-semibold">Order {order.orderNumber}</p>
                        <p>Customer: {order.customerName}</p>
                        <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p>Total Cost: ${order.totalCost ? order.totalCost.toFixed(2) : 'N/A'}</p>
                        <div className="flex space-x-2 mt-2">
                            <button
                                onClick={() => handleUpdate(order._id)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(order._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
