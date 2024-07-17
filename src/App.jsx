import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import CategoryList from './components/CategoryList';
import OrderList from './components/OrderList';
import AddEditProduct from './components/AddEditProduct';
import AddEditCategory from './components/AddEditCategory';
import PlaceOrder from './components/PlaceOrder';

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li><a href="/" className="text-blue-500 hover:underline">Products</a></li>
            <li><a href="/categories" className="text-blue-500 hover:underline">Categories</a></li>
            <li><a href="/orders" className="text-blue-500 hover:underline">Orders</a></li>
            <li><a href="/add-edite-product" className="text-blue-500 hover:underline">Add Product</a></li>
            <li><a href="/add-edite-category" className="text-blue-500 hover:underline">Add Category</a></li>
            <li><a href="/place-order" className="text-blue-500 hover:underline">Place Order</a></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={<ProductList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/add-edite-product" element={<AddEditProduct />} />
          <Route path="/add-edite-product/:id" element={<AddEditProduct />} />
          <Route path="/add-edite-category" element={<AddEditCategory />} />
          <Route path="/add-edite-category/:id" element={<AddEditCategory />} />
          <Route path="/place-order" element={<PlaceOrder />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
