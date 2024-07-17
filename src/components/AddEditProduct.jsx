import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddEditProduct = () => {
    const navigate = useNavigate();

    const [product, setProduct] = useState({ name: '', category: '', price: 0, quantity: 0 });
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const serverURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const response = await axios.get(`${serverURL}/getProduct`, {
                        params: { _id: id }
                    });
                    const productWithCategoryName = {
                        ...response.data[0],
                        category: response.data[0].category.name
                    };
                    setProduct(productWithCategoryName);
                }
            } catch (error) {
                console.error('There was an error fetching the product!', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${serverURL}/getCategories`);
                setCategories(response.data);
            } catch (error) {
                console.error('There was an error fetching the categories!', error);
            }
        };

        fetchProduct();
        fetchCategories();
    }, [id, serverURL]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = id ? 'put' : 'post';
        const url = id ? `${serverURL}/updateProduct` : `${serverURL}/createProduct`;

        try {
            await axios[method](url, {
                ...product,
                _id: id ? id : undefined
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate('/');
        } catch (error) {
            console.error('There was an error saving the product!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Product' : 'Add Product'}</h2>
            <div className="mb-4">
                <label className="block mb-2">Name:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Category:</label>
                <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2">Price:</label>
                <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Quantity:</label>
                <input type="number" name="quantity" value={product.quantity} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Save</button>
        </form>
    );
};

export default AddEditProduct;
