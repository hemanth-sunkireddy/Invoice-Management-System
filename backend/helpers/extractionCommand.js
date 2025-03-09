const pdfImageExtractionCommand = 
`
  Extract the following fields from the invoice in a structured JSON format:
  - consignee_name: Name of the consignee (if available)
  - consignee_mobile_number: Mobile number of the consignee (if available)
  - consignee_address: Address of the consignee (if available)
  - customer_name: Name of the customer
  - customer_mobile_number: Mobile number of the customer
  - customer_total_purchase_amount: Total purchase amount of the customer
  - invoice_number: Unique identifier for the invoice
  - invoice_date: Date of the invoice in DD-MM-YYYY format
  - total_amount: Total amount of the invoice (including taxes)
  
  - CGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.
  - SGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.
  - IGST: Object containing tax values grouped by GST percentage (e.g., { "2.5%": amount, "6%": amount }). Return '' or an empty object if not present.

  - items: Array of items with the following properties:
    - product_name: Name of the product
    - item_price: Price of the item
    - quantity: Quantity of the item purchased
    - taxable_value: Taxable value of the item
    - gst_percent: GST percentage applied to the item
  
  Ensure all fields are present, even if they have null or empty values. Use consignee details first, then fallback to customer details if missing.

  For CGST, SGST, and IGST:
  - Extract the total CGST, SGST, and IGST values from the invoice summary, grouped by GST percentage.
  - Create separate objects for CGST, SGST, and IGST, each containing tax percentages as keys and the corresponding tax amounts as values.
  - If IGST is not present in the invoice, return an empty object for IGST.
  - If CGST is not present in the invoice, return an empty object for CGST.
  - If SGST is not present in the invoice, return an empty object for SGST.
  - Ensure that each object reflects the correct tax amounts for each applicable percentage (e.g., "2.5%", "6%", etc.).
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