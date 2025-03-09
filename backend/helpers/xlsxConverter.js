const xlsx = require('xlsx');

const convertXlsxToCsv = (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error('No sheets found in the uploaded XLSX file.');
  }

  // Convert sheet to JSON and filter out empty rows
  const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });
  const nonEmptyRows = jsonData.filter(row => 
    Object.values(row).some(cell => cell !== null && cell !== "")
  );

  if (nonEmptyRows.length === 0) {
    throw new Error('The uploaded XLSX file contains only empty rows.');
  }

  // Convert filtered data back to CSV
  const filteredSheet = xlsx.utils.json_to_sheet(nonEmptyRows);
  const csvData = xlsx.utils.sheet_to_csv(filteredSheet);
  const base64Data = Buffer.from(csvData, 'utf-8').toString('base64');

  return { csvData, base64Data };
};

module.exports = { convertXlsxToCsv };