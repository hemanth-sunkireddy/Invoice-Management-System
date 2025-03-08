const extractInvoice = async (model, fileBuffer, mimeType) => {
  try {
    // Improved and clearer extraction command
    const extractionCommand = `
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

      Ensure that the following conditions are met:
      1. If consignee details (name, mobile number, and address) are available in the document, use them.
      2. If consignee details are not available, use customer details (name, mobile number, and address) as fallback.
      3. All fields must be present in the output, even if some of them have null or empty values.
      4. The output must be a valid JSON object with the predefined fields, regardless of missing data.

      The extracted data should be as accurate as possible and conform to the structure described above.
    `;
    
    // Generate content with the model
    const result = await model.generateContent([
      {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: mimeType,
        },
      },
      extractionCommand
    ]);

    // Parse and clean the result
    let summary = result.response.text();
    summary = summary.replace(/^```json\s*\n/, '').trim().replace(/\n?```$/, '').trim();
    const parsedResult = JSON.parse(summary);

    let invoice_tax = 0;
    if (parsedResult.CGST) invoice_tax += parsedResult.CGST;
    if (parsedResult.SGST) invoice_tax += parsedResult.SGST;
    if (parsedResult.IGST) invoice_tax += parsedResult.IGST;

    parsedResult.invoice_tax = invoice_tax;

    if (!parsedResult.consignee_name) {
      parsedResult.consignee_name = parsedResult.customer_name;
    }
    if (!parsedResult.consignee_mobile_number) {
      parsedResult.consignee_mobile_number = parsedResult.customer_mobile_number;
    }

    return parsedResult;

  } catch (error) {
    console.error('Error extracting data:', error);
    throw new Error('Failed to extract data from invoice');
  }
};

module.exports = { extractInvoice };
