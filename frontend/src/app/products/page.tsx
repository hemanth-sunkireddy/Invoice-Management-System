'use client'
import type { Products } from "@/types";
import { backendURL_Products } from "../../../config";
import { useEffect, useState } from "react";
const Products: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const fetchProducts = async () =>{
    const server_response = await fetch(backendURL_Products);
    const data: Products[] = await server_response.json();
    console.log(data);
    setProducts(data);
    console.log((server_response).json);
  }
  useEffect(
    () =>{
     fetchProducts()
    }, []
  )
  return (
    <section className="flex items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <p className="mb-10 pb-10 text-center">Products Page</p>
      <hr />
      <table className="table-auto relative mt-20 pt-10">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>quantity</th>
            <th> unitPrice</th>
            <th> tax</th>
            <th> priceWithTax</th>
            <th> discount</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.productName}>
                <td className="border px-4 py-2">{product.productName}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">{product.unitPrice}</td>
                <td className="border px-4 py-2">{product.tax}</td>
                <td className="border px-4 py-2">{product.priceWithTax}</td>
                <td className="border px-4 py-2">{product.discount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">Empty Data from server</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default Products;
