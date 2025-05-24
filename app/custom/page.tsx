'use client';

import { useState } from 'react';
import { FaRegFileAlt, FaCreditCard, FaTruck } from 'react-icons/fa'; // Import icons

const CustomOrder = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [customizations, setCustomizations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState('Delivery to Home');
  const [shippingCost, setShippingCost] = useState(50000);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleShippingMethodChange = (e) => {
    const method = e.target.value;
    setShippingMethod(method);
    setShippingCost(method === 'Pick Up at Store' ? 0 : 50000);
  };

  const handleAddCustomization = () => {
    setCustomizations([...customizations, '']);
  };

  const handleCustomizationChange = (index, value) => {
    const newCustomizations = [...customizations];
    newCustomizations[index] = value;
    setCustomizations(newCustomizations);
  };

  const handleOrder = () => {
    // Handle order submission logic here
    alert('Order submitted!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-40">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-dusty">Custom Order</h2>
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-3 border rounded-md mb-4 bg-aduh text-nero"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <textarea
          placeholder="Product Description"
          className="w-full p-3 border rounded-md mb-4 bg-aduh text-nero"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />
        
        <h3 className="text-xl font-semibold text-dusty mb-4">Customizations</h3>
        {customizations.map((customization, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder={`Customization ${index + 1}`}
              className="w-full p-3 border rounded-md mb-2 bg-aduh text-nero"
              value={customization}
              onChange={(e) => handleCustomizationChange(index, e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={handleAddCustomization}
          className="bg-peach text-white p-3 rounded-md mb-4"
        >
          Add Customization
        </button>

        <h3 className="text-xl font-semibold text-dusty mb-4">Quantity</h3>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-3 border rounded-md mb-4 bg-aduh text-nero"
        />
        
        <h3 className="text-xl font-semibold text-dusty mb-4">Receiver Information</h3>
        <input
          type="text"
          placeholder="Receiver Name"
          className="w-full p-3 border rounded-md mb-4 bg-aduh text-nero"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-3 border rounded-md mb-4 bg-aduh text-nero"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        
        <h3 className="text-xl font-semibold text-dusty mb-4">Shipping Method</h3>
        <select
          className="w-full p-3 border rounded-md mb-4 bg-aduh text-nero"
          value={shippingMethod}
          onChange={handleShippingMethodChange}
        >
          <option value="Delivery to Home">Delivery to Home</option>
          <option value="Pick Up at Store">Pick Up at Store</option>
        </select>

        <h3 className="text-xl font-semibold text-dusty mb-4">Payment Method</h3>
        <select
          className="w-full p-3 border rounded-md mb-4 bg-aduh text-nero"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Select Payment Method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="E-Wallet">E-Wallet</option>
        </select>

        <button
          onClick={handleOrder}
          className="w-full bg-peach text-white p-3 rounded-md mt-6"
        >
          <FaTruck className="inline-block mr-2" /> Submit Order
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded-md">
        <h2 className="text-2xl font-semibold text-dusty mb-4">Order Summary</h2>
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-nero">Product Name</span>
          <span className="text-nero">{productName}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-nero">Description</span>
          <span className="text-nero">{productDescription}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-nero">Quantity</span>
          <span className="text-nero">{quantity}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-nero">Shipping Method</span>
          <span className="text-nero">{shippingMethod}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-nero">Shipping Cost</span>
          <span className="text-nero">Rp {shippingCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-nero">Total</span>
          <span className="text-nero">Rp {(quantity * 100000 + shippingCost).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
