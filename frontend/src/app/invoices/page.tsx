'use client'
import type { Invoice } from "@/types";
import { backendURL_Invoices } from "../../../config";
import { useEffect, useState } from "react";

const Invoice: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const fetchInvoices = async () =>{
    const server_response = await fetch(backendURL_Invoices);
    const data: Invoice[] = await server_response.json();
    console.log(data);
    setInvoices(data);
    console.log((server_response).json);
  }
  useEffect(
    () =>{
     fetchInvoices()
    }, []
  )
  return (
    <section className="flex items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <p className="mb-10 pb-10 text-center">Invoice Page</p>
      <hr />
      <table className="table-auto relative mt-20 pt-10">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Customer Name</th>
            <th>Invoice Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice.invoice_num}>
                <td className="border px-4 py-2">{invoice.invoice_num}</td>
                <td className="border px-4 py-2">{invoice.customer_name}</td>
                <td className="border px-4 py-2">{invoice.invoice_date}</td>
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

export default Invoice;
