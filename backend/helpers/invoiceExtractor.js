const { pdfExtractionCommand, xlsxJsonExtractionCommand, ImageExtractionCommand } = require('./extractionCommand');

const cleanJsonString = (jsonString) => {

  jsonString = jsonString.replace(/^```json\s*/, '').replace(/\n?```$/, '');


  jsonString = jsonString.replace(/,\s*(?=\]|\})/g, '');

  jsonString = jsonString.replace(/(\\n)/g, ' ').trim();

  jsonString = jsonString.replace(/"([^"]*)$/, '"$1');

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

    summary = cleanJsonString(summary);
    try {
      parsedResult = JSON.parse(summary);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError.message);
      console.error('Failed JSON snippet:', summary);
      throw new Error(`Failed to parse JSON at position ${jsonError.message.match(/position (\d+)/)?.[1] || 'unknown'}`);
    }

    let invoice_tax = 0;

    ['CGST', 'SGST', 'IGST'].forEach((tax) => {
      console.log(typeof parsedResult[tax])
      if (parsedResult[tax] && typeof parsedResult[tax] === 'object') {
        Object.values(parsedResult[tax]).forEach((value) => {
          console.log(typeof value);
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            invoice_tax += numValue;
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
