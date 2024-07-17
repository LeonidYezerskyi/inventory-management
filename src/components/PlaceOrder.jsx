import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const [order, setOrder] = useState({ customerName: '', orderItems: [], orderDate: '', totalCost: 0, orderNumber: '' });
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const serverURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const storedProducts = localStorage.getItem('selectedProducts');
        if (storedProducts) {
            const parsedProducts = JSON.parse(storedProducts);
            const fetchProductDetails = async () => {
                const promises = parsedProducts.map(async product => {
                    const response = await axios.get(`${serverURL}/getProduct`, {
                        params: { _id: product._id }
                    });
                    return { ...response.data[0], quantity: product.quantity };
                });
                const productDetails = await Promise.all(promises);
                setSelectedProducts(productDetails);
            };
            fetchProductDetails();
        }
    }, [serverURL]);

    useEffect(() => {
        const updatedOrderItems = selectedProducts.map(product => ({
            productId: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity
        }));

        setOrder(prevOrder => ({
            ...prevOrder,
            orderItems: updatedOrderItems
        }));

        const totalPrice = selectedProducts.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
        setTotalPrice(totalPrice);
    }, [selectedProducts]);

    const handleChange = (e) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const generateOrderNumber = () => {
        return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const currentOrder = {
            ...order,
            orderDate: new Date().toISOString(),
            totalCost: totalPrice,
            orderNumber: generateOrderNumber()
        };

        axios.post(`${serverURL}/createOrder`, currentOrder)
            .then(response => {
                console.log('Order placed successfully!', response.data);
                localStorage.removeItem('selectedProducts');
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

            <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Selected Products</h3>
                <ul className="space-y-2">
                    {selectedProducts.map(product => (
                        <li key={product._id} className="p-4 border rounded shadow-sm">
                            <p className="font-semibold">{product.name}</p>
                            <p>Category: {product.category}</p>
                            <p>Price: ${product.price}</p>
                            <p>Quantity: {product.quantity}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <p className="font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
            </div>

            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Place Order</button>
        </form>
    );
};

export default PlaceOrder;
