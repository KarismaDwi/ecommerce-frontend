"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const searchParams = useSearchParams();

  const [paymentData, setPaymentData] = useState({
    orderCode: searchParams.get("orderCode"), // Ganti id jadi kode pemesanan
    name: searchParams.get("name"),
    price: Number(searchParams.get("price")) || 0, // Pastikan price bertipe angka
    quantity: Number(searchParams.get("quantity")) || 1, // Pastikan quantity bertipe angka
    size: searchParams.get("size"),
    detailAddress: searchParams.get("detailAddress"), // Ganti address jadi detail address
    phone: searchParams.get("phone"),
    notes: searchParams.get("notes"),
    paymentMethod: searchParams.get("paymentMethod"),
    receiver: searchParams.get("receiver"), // Tambahkan siapa penerima
    recipient: searchParams.get("recipient"), // Tambahkan siapa yang akan menerima
    purchaseMethod: searchParams.get("purchaseMethod"), // Tambahkan metode pembelian (delivery/pickup)
  });

  useEffect(() => {
    console.log("Updated paymentData:", paymentData);
  }, [paymentData]);

  useEffect(() => {
    if (!paymentData.orderCode) {
      const storedCheckoutData = JSON.parse(localStorage.getItem("checkoutData"));
      if (storedCheckoutData) {
        setPaymentData(storedCheckoutData);
      }
    }
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.orderCode !== paymentData.orderCode);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }, [paymentData.orderCode]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg pt-32">
      <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold">Detail Order</h2>
        <p>{paymentData.name} (Size: {paymentData.size})</p>
        <p>Qty: {paymentData.quantity}</p>
        <p>Total Price: ${paymentData.price * paymentData.quantity}</p>
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold">Detail Address</h2>
        <p>{paymentData.detailAddress}</p>
        <p>Phone: {paymentData.phone}</p>
        {paymentData.notes && <p>Note: {paymentData.notes}</p>}
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold">Receiver & Recipient</h2>
        <p>Receiver: {paymentData.receiver}</p>
        <p>Recipient: {paymentData.recipient}</p>
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold">Purchase Method</h2>
        <p>{paymentData.purchaseMethod === "delivery" ? "Delivery to Home" : "Pick Up at Store"}</p>
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold">Payment Method</h2>
        <p>{paymentData.paymentMethod === "transfer" ? "Transfer Bank" : "Cash on Delivery (COD)"}</p>
      </div>

      <div className="border p-4 rounded-lg mb-4 bg-gray-100">
        <h2 className="text-lg font-semibold">Order Code</h2>
        <p className="text-2xl font-bold text-red-500">{paymentData.orderCode}</p>
      </div>
    </div>
  );
}
