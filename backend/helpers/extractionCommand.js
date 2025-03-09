const pdfImageExtractionCommand = `
  Extract the following fields from the invoice in a structured JSON format:
  - consignee_name: Name of the consignee (if available)
  - consignee_mobile_number: Mobile number of the consignee (if available)
  - consignee_address: Address of the consignee (if available)
  - customer_name: Name of the customer
  - customer_mobile_number: Mobile number of the customer
  - customer_total_purchase_amount: Total purchase amount of the customer
  - invoice_number: Unique identifier for the invoice
  - invoice_date: Date of the invoice in YYYY-MM-DD format
  - CGST: Central Goods and Services Tax (if available)
  - SGST: State Goods and Services Tax (if available)
  - IGST: Integrated Goods and Services Tax (if available)
  - items: Array of items with the following properties:
    - product_name: Name of the product
    - item_price: Price of the item
    - quantity: Quantity of the item purchased
    - taxable_value: Taxable value of the item
    - gst_percent: GST percentage applied to the item
  - total_amount: Total amount of the invoice (including taxes)

  Ensure all fields are present, even if they have null or empty values. Use consignee details first, then fallback to customer details if missing.
`;

const xlsxJsonExtractionCommand = `
  Extract and return a structured JSON object with the following fields and also don't give me any note I just need json:
  {
    "consignee_name": null,
    "consignee_mobile_number": null,
    "consignee_address": null,
    "customer_name": null,
    "customer_mobile_number": null,
    "customer_total_purchase_amount": null,
    "invoice_number": null,
    "invoice_date": null,
    "CGST": null,
    "SGST": null,
    "IGST": null,
    "items": [
      {
        "product_name": null,
        "item_price": null,
        "quantity": null,
        "taxable_value": null,
        "gst_percent": null
      }
    ],
    "total_amount": null
  }`;

module.exports = { pdfImageExtractionCommand, xlsxJsonExtractionCommand };