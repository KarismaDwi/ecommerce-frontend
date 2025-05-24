"use client";

import React from 'react';

const AdminPage = () => {
  // Event handler untuk tombol
  const handleAddProduct = () => {
    console.log('Add New Product Clicked');
    // Logic untuk menambah produk
  };

  const handleEditProduct = (id) => {
    console.log(`Edit Product ${id}`);
    // Logic untuk edit produk
  };

  const handleDeleteProduct = (id) => {
    console.log(`Delete Product ${id}`);
    // Logic untuk delete produk
  };

  const handleAddCategory = () => {
    console.log('Add New Category Clicked');
    // Logic untuk menambah kategori
  };

  const handleEditCategory = (id) => {
    console.log(`Edit Category ${id}`);
    // Logic untuk edit kategori
  };

  const handleDeleteCategory = (id) => {
    console.log(`Delete Category ${id}`);
    // Logic untuk delete kategori
  };

  const handleViewOrder = (orderId) => {
    console.log(`View Order ${orderId}`);
    // Logic untuk melihat detail order
  };

  const handleMarkOrderCompleted = (orderId) => {
    console.log(`Mark Order ${orderId} as Completed`);
    // Logic untuk menandai order selesai
  };

  const handleCancelOrder = (orderId) => {
    console.log(`Cancel Order ${orderId}`);
    // Logic untuk cancel order
  };

  const handleEditUser = (userId) => {
    console.log(`Edit User ${userId}`);
    // Logic untuk edit user
  };

  const handleDeleteUser = (userId) => {
    console.log(`Delete User ${userId}`);
    // Logic untuk delete user
  };

  return (
    <div className="min-h-screen bg-nude pt-32">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-full bg-dusty text-white p-6 fixed">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          <ul>
            <li className="mb-4"><a href="#products" className="text-lg">Products</a></li>
            <li className="mb-4"><a href="#categories" className="text-lg">Categories</a></li>
            <li className="mb-4"><a href="#orders" className="text-lg">Orders</a></li>
            <li className="mb-4"><a href="#users" className="text-lg">Users</a></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-5 flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-dusty">Admin Dashboard</h1>

          {/* Products Section */}
          <div id="products" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-dusty">Manage Products</h2>
            <button onClick={handleAddProduct} className="bg-peach text-white px-4 py-2 rounded mb-4">Add New Product</button>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">1</td>
                  <td className="py-2 px-4 border-b">Product A</td>
                  <td className="py-2 px-4 border-b">$100</td>
                  <td className="py-2 px-4 border-b">Category 1</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEditProduct(1)} className="bg-peach text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDeleteProduct(1)} className="bg-aduh text-white px-4 py-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">2</td>
                  <td className="py-2 px-4 border-b">Product B</td>
                  <td className="py-2 px-4 border-b">$200</td>
                  <td className="py-2 px-4 border-b">Category 2</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEditProduct(2)} className="bg-peach text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDeleteProduct(2)} className="bg-aduh text-white px-4 py-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Categories Section */}
          <div id="categories" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-dusty">Manage Categories</h2>
            <button onClick={handleAddCategory} className="bg-peach text-white px-4 py-2 rounded mb-4">Add New Category</button>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">1</td>
                  <td className="py-2 px-4 border-b">Category 1</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEditCategory(1)} className="bg-peach text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDeleteCategory(1)} className="bg-aduh text-white px-4 py-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">2</td>
                  <td className="py-2 px-4 border-b">Category 2</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEditCategory(2)} className="bg-peach text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDeleteCategory(2)} className="bg-aduh text-white px-4 py-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Orders Section */}
          <div id="orders" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-dusty">Manage Orders</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Order ID</th>
                  <th className="py-2 px-4 border-b">Customer</th>
                  <th className="py-2 px-4 border-b">Total</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">#123</td>
                  <td className="py-2 px-4 border-b">John Doe</td>
                  <td className="py-2 px-4 border-b">$250</td>
                  <td className="py-2 px-4 border-b">Pending</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleViewOrder('#123')} className="bg-peach text-white px-4 py-2 rounded">View</button>
                    <button onClick={() => handleMarkOrderCompleted('#123')} className="bg-aduh text-white px-4 py-2 rounded ml-2">Mark as Completed</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">#124</td>
                  <td className="py-2 px-4 border-b">Jane Smith</td>
                  <td className="py-2 px-4 border-b">$300</td>
                  <td className="py-2 px-4 border-b">Completed</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleViewOrder('#124')} className="bg-peach text-white px-4 py-2 rounded">View</button>
                    <button onClick={() => handleCancelOrder('#124')} className="bg-aduh text-white px-4 py-2 rounded ml-2">Cancel</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Users Section */}
          <div id="users" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-dusty">Manage Users</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">User ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">1</td>
                  <td className="py-2 px-4 border-b">John Doe</td>
                  <td className="py-2 px-4 border-b">johndoe@example.com</td>
                  <td className="py-2 px-4 border-b">Admin</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEditUser(1)} className="bg-peach text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDeleteUser(1)} className="bg-aduh text-white px-4 py-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">2</td>
                  <td className="py-2 px-4 border-b">Jane Smith</td>
                  <td className="py-2 px-4 border-b">janesmith@example.com</td>
                  <td className="py-2 px-4 border-b">User</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEditUser(2)} className="bg-peach text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDeleteUser(2)} className="bg-aduh text-white px-4 py-2 rounded ml-2">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
