const extractInvoice = async (model, fileBuffer, mimeType) => {
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: mimeType,
        },
      },
      'Extract the fields customer_name, invoice_number, invoice_date, items (with product_name, item_price, quantity, taxable_value, and gst), and total_amount in structured JSON format, ensuring all keys are predefined even if some values are missing.'
    ]);

    let summary = result.response.text();
    summary = summary.replace(/^```json\s*\n/, '').trim().replace(/\n?```$/, '').trim();
    return JSON.parse(summary);
  } catch (error) {
    console.error('Error extracting data:', error);
    throw new Error('Failed to extract data from invoice');
  }
};

module.exports = { extractInvoice };