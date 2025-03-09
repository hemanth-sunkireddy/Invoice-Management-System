export interface Invoice {
    invoice_num: number,
    invoice_date: string,
    invoice_tax: string,
    total_amount: string,
}

export interface Customers {
    customer_name: string,
    phone_number: number,
    totalPurAmnt: number,
}

export interface Products {
    product_name: string,
    quantity: number,
    item_price: number,
    taxable_value: number,
    priceWithTax: number,
    discount: number,
}
export interface FileData {
  fileName: string;
  fileType: string;
  fileSize: number;
  [key: string]: string | number;
}
export interface IMenuItem {
    text: string;
    url: string;
}