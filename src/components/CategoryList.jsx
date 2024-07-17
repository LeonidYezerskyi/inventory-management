import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/getCategories`)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []);

    const handleDelete = (categoryId) => {
        axios.delete(`${apiUrl}/deleteCategory`, {
            data: { _id: categoryId }
        })
            .then(() => {
                setCategories(categories.filter(category => category._id !== categoryId));
            })
            .catch(error => {
                console.error('Error deleting category:', error);
            });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Category List</h2>
            <ul className="space-y-2">
                {categories.map(category => (
                    <li key={category._id} className="p-4 border rounded shadow-sm">
                        <p className="font-semibold">{category.name}</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleDelete(category._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Видалити
                            </button>
                            <Link to={`/add-edite-category/${category._id}`} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                                Редагувати
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
