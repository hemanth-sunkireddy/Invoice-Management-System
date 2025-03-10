'use client'
import type { Invoice } from "@/types";
import { backendURL_Invoices } from "../../../config";
import { useEffect, useState } from "react";
import Link from "next/link";


const Invoice: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [errorText, setErrorText] = useState('');
  console.log(errorText);
  const fetchInvoices = async () =>{
    try {
      const server_response = await fetch(backendURL_Invoices);
      if (!server_response.ok) {
        throw new Error(`Error: ${server_response.statusText}`);
      }
      const data: Invoice[] = await server_response.json();
      setInvoices(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrorText(error.message);
      } else {
        setErrorText('Internal Server Error');
      }
    }
  }

  
  useEffect(
    () =>{
     fetchInvoices()
    }, []
  )

  return (
    <section className="flex items-center justify-center pb-20 pt-32 md:pt-40 px-5">
      <div className="text-center">
        <p className="mb-10 pb-10 text-center font-bold flex">Invoice Records</p>
      </div>
      <hr />
      <table className="table-auto relative mt-20 pt-10">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Invoice Tax</th>
            <th>Total Amount</th>
            <th>Invoice Date</th>
            <th>More Details</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice.invoice_num}>
                <td className="border px-4 py-2">{invoice.invoice_num}</td>
                <td className="border px-4 py-2">{invoice.total_amount}</td>
                <td className="border px-4 py-2">{invoice.invoice_tax}</td>
                <td className="border px-4 py-2">{invoice.invoice_date}</td>
                <td className="border px-4 py-2"><Link href={`/invoice-detail?invoice_id=${invoice.invoice_num}`}>
                    More Details
                  </Link></td>
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
