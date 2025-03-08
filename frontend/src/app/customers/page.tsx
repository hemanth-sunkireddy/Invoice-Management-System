'use client'
import type { Customers } from "@/types";
import { backendURL_Customers} from "../../../config";
import { useEffect, useState } from "react";
const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customers[]>([]);
  const fetchCustomers = async () =>{
    const server_response = await fetch(backendURL_Customers);
    const data: Customers[] = await server_response.json();
    console.log(data);
    setCustomers(data);
    console.log((server_response).json);
  }
  useEffect(
    () =>{
     fetchCustomers()
    }, []
  )
  return (
    <section className="flex items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <p className="mb-10 pb-10 text-center">Customers Page</p>
      <hr />
      <table className="table-auto relative mt-20 pt-10">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.phoneNumber}>
                <td className="border px-4 py-2">{customer.customerName}</td>
                <td className="border px-4 py-2">{customer.phoneNumber}</td>
                <td className="border px-4 py-2">{customer.totPurchAmnt}</td>
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

export default Customers;
