'use client'
import type { Customers } from "@/types";
import { backendURL_Customers } from "../../../config";
import { useEffect, useState } from "react";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customers[]>([]);

  const fetchCustomers = async () => {
    try {
      const server_response = await fetch(backendURL_Customers);
      if (!server_response.ok) {
        throw new Error(`Error: ${server_response.statusText}`);
      }
      const data: Customers[] = await server_response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <div className="text-center mb-10">
        <p className="text-2xl font-bold">Customers Page</p>
      </div>
      <div className="w-full max-w-4xl">
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer Name</th>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone Number</th>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.phone_number} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-gray-800">{customer.customer_name}</td>
                  <td className="border px-4 py-2 text-gray-800">{customer.phone_number}</td>
                  <td className="border px-4 py-2 text-gray-800">{customer.totalPurAmnt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">Empty Data from server</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Customers;
