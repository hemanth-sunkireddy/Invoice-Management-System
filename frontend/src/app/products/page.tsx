'use client'
import type { Products } from "@/types";
import { backendURL_Products } from "../../../config";
import { useEffect, useState } from "react";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);

  const fetchProducts = async () => {
    try {
      const server_response = await fetch(backendURL_Products);
      if (!server_response.ok) {
        throw new Error(`Error: ${server_response.statusText}`);
      }
      const data: Products[] = await server_response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <div className="text-center mb-10">
        <p className="text-2xl font-bold">Products Page</p>
      </div>
      <div className="w-full max-w-4xl">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Product Name</th>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Quantity</th>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Item Price</th>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Taxable Value</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.product_name} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-800">{product.product_name}</td>
                  <td className="border px-4 py-2 text-gray-800">{product.quantity}</td>
                  <td className="border px-4 py-2 text-gray-800">{product.item_price}</td>
                  <td className="border px-4 py-2 text-gray-800">{product.taxable_value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">Empty Data from server</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Products;
