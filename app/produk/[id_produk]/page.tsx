'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { AiFillStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

interface Product {
  id_produk: number;
  name: string;
  harga: number;
  deskripsi: string;
  stok: number;
  gambar: string;
  ukuran: string;
  warna: string;
  kategori: string;
}

const sizes = [
  { label: 'Spray', desc: '± 10 cm' },
  { label: 'Standard bloom', desc: '± 20 cm' },
  { label: 'Full bloom', desc: '± 30 cm' },
  { label: 'Bud', desc: '± 8 cm' },
  { label: 'Mini bouquet', desc: '± 15 cm' },
  { label: 'Grand bouquet', desc: '± 50 cm' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const id_produk = params?.id_produk;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<{label: string, desc: string} | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [sizeError, setSizeError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const numericId = Number(id_produk);
        if (isNaN(numericId)) {
          throw new Error('Invalid product ID');
        }

        const res = await axios.get(
          `http://localhost:7000/api/produk/${numericId}`
        );

        if (!res.data) {
          throw new Error('Product not found');
        }

        setProduct(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch product');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id_produk) {
      fetchProduct();
    }
  }, [id_produk]);

  const handleSizeSelect = (sizeLabel: string) => {
    const size = sizes.find(s => s.label === sizeLabel);
    if (size) {
      setSelectedSize(size);
      setSizeError('');
    }
  };

  const validateSelection = () => {
    if (!selectedSize) {
      setSizeError('Please select a size first');
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!validateSelection()) return;
    if (!product) return;

    setCartLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:7000/api/cart',
        { 
          product_id: product.id_produk, 
          quantity,
          ukuran: selectedSize!.label // Changed from 'size' to 'ukuran'
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );
      
      alert(response.data.message || 'Added to cart successfully!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          alert(err.response?.data?.error || 'Failed to add to cart');
        }
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = () => {
  router.push({
    pathname: '/checkout',
    query: {
      id_produk: product.id_produk,
      name: product.name,
      harga: product.harga,
      gambar: product.gambar,
      ukuran: selectedUkuran,
      quantity: 1,
    },
  });
};

  const handleQuantityChange = (newQty: number) => {
    if (product && newQty > 0 && newQty <= product.stok && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  const isSizeAvailable = (sizeLabel: string) => {
    if (!product?.ukuran) return false;
    const availableSizes = product.ukuran.split(',').map(s => s.trim());
    return availableSizes.includes(sizeLabel);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={`http://localhost:7000/upload/${product.gambar}`}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
            >
              {isFavorite ? (
                <AiFillHeart size={24} className="text-red-500" />
              ) : (
                <AiOutlineHeart size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2">
            <AiFillStar className="text-yellow-500 mr-1" />
            <span>4.5</span>
          </div>
          <p className="text-gray-700 mt-4">{product.deskripsi}</p>

          <div className="mt-6">
            <h2 className="text-xl font-bold">
              Rp {product.harga.toLocaleString('id-ID')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Stock: {product.stok} available
            </p>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">SELECT SIZE *</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => handleSizeSelect(size.label)}
                  disabled={!isSizeAvailable(size.label)}
                  className={`px-4 py-2 border rounded-full text-sm transition-all ${
                    selectedSize?.label === size.label
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300 hover:border-black'
                  } ${
                    !isSizeAvailable(size.label)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-gray-50'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
            {selectedSize ? (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedSize.label} ({selectedSize.desc})
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-500">{sizeError}</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">QUANTITY</h3>
            <div className="flex items-center gap-4">
              <div className="flex border rounded-md">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={quantity >= Math.min(10, product.stok)}
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Max. {Math.min(10, product.stok)} per order
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBuyNow}
              disabled={cartLoading || product.stok === 0}
              className={`bg-black text-white py-3 px-6 rounded-md transition-colors ${
                !selectedSize ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {cartLoading ? 'Processing...' : 'Buy Now'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || product.stok === 0}
              className={`border py-3 px-6 rounded-md transition-colors ${
                !selectedSize 
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                  : 'border-black hover:bg-gray-50'
              }`}
            >
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
          {!selectedSize && (
            <p className="mt-2 text-sm text-red-500">
              Please select a size before proceeding
            </p>
          )}
        </div>
      </div>
    </div>
  );
}