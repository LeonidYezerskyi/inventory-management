import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddEditCategory = () => {
    const [category, setCategory] = useState({ name: '' });
    const navigate = useNavigate();
    const { id } = useParams();
    const serverURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                if (id) {
                    const response = await axios.get(`${serverURL}/getCategory`, {
                        params: { _id: id }
                    });
                    setCategory(response.data[0]);
                }
            } catch (error) {
                console.error('There was an error fetching the category!', error);
            }
        };

        fetchCategory();
    }, [id]);

    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = id ? 'put' : 'post';
        const url = id ? `${serverURL}/updateCategory` : `${serverURL}/createCategory`;

        try {
            await axios[method](url, {
                ...category,
                _id: id ? id : undefined
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            navigate('/categories');
        } catch (error) {
            console.error('There was an error saving the category!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Category' : 'Add Category'}</h2>
            <div className="mb-4">
                <label className="block mb-2">Name:</label>
                <input type="text" name="name" value={category.name} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Save</button>
        </form>
    );
};

export default AddEditCategory;
