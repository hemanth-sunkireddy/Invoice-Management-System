const { pdfExtractionCommand, xlsxJsonExtractionCommand, ImageExtractionCommand } = require('./extractionCommand');

const cleanJsonString = (jsonString) => {
  // Remove any unwanted markdown code blocks
  jsonString = jsonString.replace(/^```json\s*/, '').replace(/\n?```$/, '');
  
  // Clean up commas before closing array or object
  jsonString = jsonString.replace(/,\s*(?=\]|\})/g, '');

  // Handle any unterminated strings by removing unexpected line breaks within strings
  jsonString = jsonString.replace(/(\\n)/g, ' ').trim(); // Remove all '\n' line breaks

  // Ensure proper string termination by closing open strings if necessary
  jsonString = jsonString.replace(/"([^"]*)$/, '"$1');

  // Optionally, you can remove trailing commas in case of JSON issues
  jsonString = jsonString.replace(/,\s*(?=\]|\})/g, '');

  return jsonString;
};


const extractInvoice = async (model, fileBuffer, mimeType, fileData = null) => {
  try {
    let parsedResult = {};
    let extractionCommand;
    if (mimeType === 'application/pdf' || mimeType.startsWith('image/')) {
      extractionCommand = mimeType === 'image/jpeg' ? ImageExtractionCommand : pdfExtractionCommand;
    } else {
      extractionCommand = xlsxJsonExtractionCommand;
    }

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

    // summary = cleanJsonString(summary);
    console.log(summary);
    try {
      parsedResult = JSON.parse(summary);
    } catch (jsonError) {
      // console.error('JSON parsing error:', jsonError.message);
      // console.error('Failed JSON snippet:', summary);
      // throw new Error(`Failed to parse JSON at position ${jsonError.message.match(/position (\d+)/)?.[1] || 'unknown'}`);
    }

    let invoice_tax = 0;

    ['CGST', 'SGST', 'IGST'].forEach((tax) => {
      if (parsedResult[tax] && typeof parsedResult[tax] === 'object') {
        Object.values(parsedResult[tax]).forEach((value) => {
          if (typeof value === 'number') {
            invoice_tax += value;
          }
        });
      }
    });
    
    if (mimeType.startsWith('image/jpeg')) {
      if (parsedResult.items && Array.isArray(parsedResult.items)) {
        parsedResult.items.forEach((item) => {
          item.price_with_tax = item.unit_price * item.quantity;
        });
      }
    }

    parsedResult.invoice_tax = invoice_tax;

    parsedResult.consignee_name = parsedResult.consignee_name || parsedResult.customer_name || null;
    parsedResult.consignee_mobile_number = parsedResult.consignee_mobile_number || parsedResult.customer_mobile_number || null;

    
    return parsedResult;
  } catch (error) {
    console.error('Error extracting data:', error.message);
    throw new Error('Failed to extract data from invoice');
  }
};

module.exports = { extractInvoice };
