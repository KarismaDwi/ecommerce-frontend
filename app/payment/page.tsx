"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface PaymentData {
  id: number;
  user_id: number;
  product_id: number;
  receiver_name: string;
  phone: string;
  address: string;
  payment_method: string;
  payer_name: string;
  delivery_date: string;
  delivery_time: string;
  shipping_method: string;
  shipping_cost: number;
  total_amount: number;
  proof_of_transfer: string | null;
  status: string;
  created_at: string;
  payment?: {
    id: number;
    status: string;
    method: string;
    amount: number;
    proof_url: string | null;
    transaction_id: string | null;
    created_at: string;
  };
  product?: {
    name: string;
    harga: number;
    gambar: string;
  };
}

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch combined checkout and payment data
        const response = await axios.get(
          `http://localhost:7000/api/checkout/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          const checkoutData = response.data.data;
          
          // Fetch product data separately
          const productResponse = await axios.get(
            `http://localhost:7000/api/produk/${checkoutData.product_id}`
          );

          setPaymentData({
            ...checkoutData,
            product: productResponse.data.data,
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch order data");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          router.push("/login");
        } else {
          setError(
            axios.isAxiosError(error)
              ? error.response?.data?.message || "Failed to fetch order data"
              : "An unexpected error occurred"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    } else {
      setError("No order ID provided");
      setIsLoading(false);
    }
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg pt-32">
        <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg pt-32">
        <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>
        <div className="text-red-500 mb-4">{error}</div>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg pt-32">
        <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>
        <p>No order data found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg pt-32">
      <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Order Details</h2>
        {paymentData.product && (
          <div className="flex items-start gap-4 mb-3">
            <div className="w-16 h-16 relative">
              <Image
                src={`http://localhost:7000/upload/${paymentData.product.gambar}`}
                alt={paymentData.product.name}
                fill
                className="object-cover rounded"
                priority
              />
            </div>
            <div>
              <h3 className="font-medium">{paymentData.product.name}</h3>
              <p>Price: Rp {paymentData.product.harga?.toLocaleString("id-ID")}</p>
              <p className="font-bold">
                Subtotal: Rp {paymentData.total_amount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Receiver</p>
            <p>{paymentData.receiver_name}</p>
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <p>{paymentData.phone}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="font-medium">Address</p>
          <p>{paymentData.address}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <p className="font-medium">Delivery Date</p>
            <p>{new Date(paymentData.delivery_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium">Delivery Time</p>
            <p>{paymentData.delivery_time}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="font-medium">Shipping Method</p>
          <p>
            {paymentData.shipping_method} (Rp {paymentData.shipping_cost.toLocaleString("id-ID")})
          </p>
        </div>
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Payment Method</p>
            <p>{paymentData.payment_method}</p>
          </div>
          <div>
            <p className="font-medium">Payment Status</p>
            <p className="capitalize">{paymentData.payment?.status || paymentData.status}</p>
          </div>
          <div>
            <p className="font-medium">Amount Paid</p>
            <p>Rp {paymentData.total_amount.toLocaleString("id-ID")}</p>
          </div>
          {paymentData.payment?.transaction_id && (
            <div>
              <p className="font-medium">Transaction ID</p>
              <p>{paymentData.payment.transaction_id}</p>
            </div>
          )}
        </div>
        
        {(paymentData.proof_of_transfer || paymentData.payment?.proof_url) && (
          <div className="mt-4">
            <p className="font-medium">Proof of Payment</p>
            <div className="mt-2 border rounded overflow-hidden max-w-xs">
              <Image
                src={`http://localhost:7000${paymentData.payment?.proof_url || paymentData.proof_of_transfer}`}
                alt="Proof of Payment"
                width={400}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border p-4 rounded-lg mb-4 bg-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <p>
              Status:{" "}
              <span className="font-medium capitalize">{paymentData.status}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              Shipping Cost: Rp {paymentData.shipping_cost.toLocaleString("id-ID")}
            </p>
            <p className="text-xl font-bold">
              Total: Rp {paymentData.total_amount.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      <div className="border p-4 rounded-lg bg-gray-100">
        <h2 className="text-lg font-semibold">Order Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <p className="font-medium">Order ID</p>
            <p className="text-xl font-bold text-red-500">{paymentData.id}</p>
          </div>
          {paymentData.payment?.id && (
            <div>
              <p className="font-medium">Payment ID</p>
              <p className="text-xl font-bold text-red-500">{paymentData.payment.id}</p>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Ordered on: {new Date(paymentData.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;