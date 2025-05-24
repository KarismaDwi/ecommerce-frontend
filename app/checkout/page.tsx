'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios'; // Importing axios for making HTTP requests
import { FaTruck } from 'react-icons/fa'; // Importing the truck icon

const Checkout = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('Delivery to Home');
  const [shippingCost, setShippingCost] = useState(50000);
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payerName, setPayerName] = useState('');
  const [bankTransferMessage, setBankTransferMessage] = useState('');
  const [proofOfTransfer, setProofOfTransfer] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);

    const storedShipping = localStorage.getItem('shippingMethod') || 'Delivery to Home';
    setShippingMethod(storedShipping);
    setShippingCost(storedShipping === 'Pick Up at Store' ? 0 : 50000);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + shippingCost;

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);
    if (method === 'Bank Transfer') {
      setBankTransferMessage('Please transfer the payment to our bank account: 1234567890');
    } else {
      setBankTransferMessage('');
    }
  };

  const handleConfirmOrder = async () => {
    const formData = new FormData();
    formData.append('cartItems', JSON.stringify(cartItems));
    formData.append('receiverName', receiverName);
    formData.append('phone', phone);
    formData.append('paymentMethod', paymentMethod);
    formData.append('payerName', payerName);
    formData.append('deliveryDate', deliveryDate);
    formData.append('deliveryTime', deliveryTime);

    if (proofOfTransfer) {
      formData.append('proofOfTransfer', proofOfTransfer);
    }

    try {
      const response = await axios.post('http://localhost:7000/api/checkout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      router.push('/payment');
    } catch (error) {
      console.error('Error during order confirmation:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-40">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4 text-dusty">Order Info</h2>
        <select
          className="w-full p-3 border rounded-md mb-4"
          value={shippingMethod}
          onChange={(e) => {
            const method = e.target.value;
            setShippingMethod(method);
            setShippingCost(method === 'Pick Up at Store' ? 0 : 50000);
          }}
        >
          <option value="Delivery to Home">Delivery to Home</option>
          <option value="Pick Up at Store">Pick Up at Store</option>
        </select>

        {shippingMethod === 'Delivery to Home' && (
          <>
            <input type="text" placeholder="Country/Region" className="w-full p-3 border rounded-md mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First name" className="p-3 border rounded-md" />
              <input type="text" placeholder="Last name" className="p-3 border rounded-md" />
            </div>
            <input type="text" placeholder="Address" className="w-full p-3 border rounded-md my-4" />
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="City" className="p-3 border rounded-md" />
              <input type="text" placeholder="Province" className="p-3 border rounded-md" />
              <input type="text" placeholder="Postal Code" className="p-3 border rounded-md" />
            </div>
          </>
        )}

        <input
          type="text"
          placeholder="Receiver Name"
          className="w-full p-3 border rounded-md mb-4"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-3 border rounded-md mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <h2 className="text-2xl font-semibold mt-6 mb-4 text-dusty">Delivery/Pick-Up Time</h2>
        <input
          type="date"
          className="w-full p-3 border rounded-md mb-4"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />
        <input
          type="time"
          className="w-full p-3 border rounded-md mb-4"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />

        <h2 className="text-2xl font-semibold mt-6 mb-4 text-dusty">Payment</h2>
        <select
          className="w-full p-3 border rounded-md mb-4"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <option value="">Select Payment Method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="E-Wallet">E-Wallet</option>
        </select>

        <input
          type="text"
          placeholder="Payer Name"
          className="w-full p-3 border rounded-md mb-4"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
        />

        {bankTransferMessage && <p className="text-red-500 font-semibold">{bankTransferMessage}</p>}

        {paymentMethod === 'Bank Transfer' && (
          <input
            type="file"
            className="w-full p-3 border rounded-md mb-4"
            onChange={(e) => setProofOfTransfer(e.target.files[0])}
          />
        )}
      </div>

      <div className="bg-nude p-6 rounded-none">
        {cartItems.map((item, index) => (
          <div key={item.id || index} className="flex items-center space-x-4 mb-4">
            <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md" />
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.variant}</p>
            </div>
            <p className="ml-auto font-semibold">Rp {item.price.toLocaleString()}</p>
          </div>
        ))}

        <div className="mt-6 border-t pt-4">
          <p className="flex justify-between text-lg font-semibold text-dusty">
            <span>Subtotal</span> <span>Rp {subtotal.toLocaleString()}</span>
          </p>
          <p className="flex justify-between text-lg font-semibold text-gray-500">
            <span>Shipping</span> <span>{shippingMethod === 'Pick Up at Store' ? 'Free' : `Rp ${shippingCost.toLocaleString()}`}</span>
          </p>
          <p className="flex justify-between text-2xl font-bold mt-4 text-dusty">
            <span>Total</span> <span>Rp {total.toLocaleString()}</span>
          </p>
          <button
            onClick={handleConfirmOrder}
            className="w-full bg-peach text-white p-3 rounded-md mt-6"
          >
            <FaTruck className="inline-block mr-2" /> <span>Complete Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
