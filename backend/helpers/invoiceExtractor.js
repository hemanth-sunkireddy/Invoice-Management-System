const { pdfImageExtractionCommand, xlsxJsonExtractionCommand } = require('./extractionCommand');

const cleanJsonString = (jsonString) => {
  return jsonString
    .replace(/^```json\s*/, '')
    .replace(/\n?```$/, '')
    .replace(/\,\s*\]/g, ']') // Remove trailing commas in arrays
    .replace(/\,\s*\}/g, '}')  // Remove trailing commas in objects
    .trim();
};

const extractInvoice = async (model, fileBuffer, mimeType, fileData = null) => {
  try {
    let parsedResult = {};
    let extractionCommand =
      mimeType === 'application/pdf' || mimeType.startsWith('image/')
        ? pdfImageExtractionCommand
        : xlsxJsonExtractionCommand;

    const result = await model.generateContent([
      {
        inlineData: {
          data: mimeType === 'application/pdf' ? fileBuffer.toString('base64') : fileData,
          mimeType: mimeType,
        },
      },
      extractionCommand,
    ]);

    let summary = result.response.text().trim();
    summary = cleanJsonString(summary);
    console.log(summary);
    try {
      parsedResult = JSON.parse(summary);
      console.log(parsedResult);
      // Ensure all fields are present even if they have null or empty values
      parsedResult.items = parsedResult.items?.map(item => ({
        product_name: item.product_name || null,
        item_price: item.item_price || null,
        quantity: item.quantity || null,
        taxable_value: item.taxable_value || null,
        gst_percent: item.gst_percent ?? null,
      })) || [];

    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError.message);
      console.error('Failed JSON snippet:', summary.slice(0, 500));
      throw new Error(`Failed to parse JSON at position ${jsonError.message.match(/position (\d+)/)?.[1] || 'unknown'}`);
    }

    // Calculate total tax
    let invoice_tax = 0;
    ['CGST', 'SGST', 'IGST'].forEach((tax) => {
      if (parsedResult[tax]) invoice_tax += parsedResult[tax];
    });
    parsedResult.invoice_tax = invoice_tax;

    // Fallbacks for consignee info
    parsedResult.consignee_name = parsedResult.consignee_name || parsedResult.customer_name || null;
    parsedResult.consignee_mobile_number = parsedResult.consignee_mobile_number || parsedResult.customer_mobile_number || null;

    return parsedResult;
  } catch (error) {
    console.error('Error extracting data:', error.message);
    throw new Error('Failed to extract data from invoice');
  }
};

module.exports = { extractInvoice };
