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

    // console.log(summary);
    summary = cleanJsonString(summary);

    try {
      parsedResult = JSON.parse(summary);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError.message);
      console.error('Failed JSON snippet:', summary);
      throw new Error(`Failed to parse JSON at position ${jsonError.message.match(/position (\d+)/)?.[1] || 'unknown'}`);
    }

    let invoice_tax = 0;
    if (mimeType === 'application/pdf' || mimeType.startsWith('image/')){
      ['CGST', 'SGST', 'IGST'].forEach((tax) => {
        // console.log(typeof parsedResult[tax]);
        if (parsedResult[tax] && typeof parsedResult[tax] === 'object') {
          Object.values(parsedResult[tax]).forEach((value) => {
            // console.log(typeof value);
            // console.log(value);
            const cleanedValue = typeof value === 'string' ? value.replace(/₹|,/g, '').trim() : value;
            const numValue = parseFloat(cleanedValue);
            // console.log(numValue);
            if (!isNaN(numValue)) {
              invoice_tax += numValue;
            }
          });
        }
      });

    parsedResult.invoice_tax = invoice_tax;
    parsedResult.consignee_name = parsedResult.consignee_name || parsedResult.customer_name || null;
    parsedResult.consignee_mobile_number = parsedResult.consignee_mobile_number || parsedResult.customer_mobile_number || null;

    }
    else{

      let invoice_tax = 0;
      
      // if (Array.isArray(parsedResult.invoices)) {
      //   parsedResult.invoices.forEach((invoice) => {
      //     // console.log(invoice.CGST);
      //     const cgstTotal = parseFloat(invoice.CGST.replace(/,/g, ''));
      //     const igstTotal = parseFloat(invoice.IGST.replace(/,/g, ''));
      //     const sgstTotal = parseFloat(invoice.SGST.replace(/,/g, ''));
      
      //     console.log("CGST TOTAL: ", cgstTotal);
      //     console.log("SGST Total: ", sgstTotal);
      //     console.log("IGST total: ", igstTotal);
      
      //     // nvoice.CGST = { "total per": cgstTotal };
      //     // invoice.SGST = { "total per": sgstTotal };
      //     // invoice.IGST = { "total per": igstTotal };
      //     invoice_tax += cgstTotal + sgstTotal + igstTotal;
      //     invoice.invoice_tax = invoice_tax
      //   });
      // }

    }

    if (mimeType.startsWith('image/jpeg')) {
      if (parsedResult.items && Array.isArray(parsedResult.items)) {
        parsedResult.items.forEach((item) => {
          item.price_with_tax = item.unit_price * item.quantity;
        });
      }
    }
    console.log(parsedResult);

    return parsedResult;
  } catch (error) {
    console.error('Error extracting data:', error.message);
    throw new Error('Failed to extract data from invoice');
  }
};

module.exports = { extractInvoice };
