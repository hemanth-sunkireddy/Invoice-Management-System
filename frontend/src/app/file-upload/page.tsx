'use client'
import { useState } from "react";
import { backendURL_FileUpload } from "../../../config";

interface FileData {
  fileName: string;
  fileType: string;
  fileSize: number;
  [key: string]: string | number;
}

const FileUpload: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('fileSize', file.size.toString());

    try {
      const response = await fetch(backendURL_FileUpload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      console.log('Success:', result);
      setFileData(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach(file => handleFileUpload(file));
    } else {
      console.log('No file selected');
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center pb-0 pt-32 md:pt-40 px-5">
      <form onSubmit={fileSubmit} className="flex flex-col items-center gap-4 w-full max-w-lg">
        <p>File Upload Page</p>
        <div className="flex gap-4">
          <label className="p-2 bg-blue-500 text-white rounded cursor-pointer">
            Upload PDF
            <input type="file" accept="application/pdf" className="hidden" />
          </label>
          <label className="p-2 bg-green-500 text-white rounded cursor-pointer">
            Upload Image
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <label className="p-2 bg-yellow-500 text-white rounded cursor-pointer">
            Upload Excel
            <input type="file" accept=".xlsx,.xls" className="hidden" />
          </label>
          <label className="p-2 bg-purple-500 text-white rounded cursor-pointer">
            Upload Multiple Excel
            <input type="file" accept=".xlsx,.xls" multiple className="hidden" />
          </label>
        </div>
        <p className="mt-4 text-center">Not sure the file extension? Don’t worry, upload here — we will take care of it.</p>
        <label className="p-2 bg-gray-500 text-white rounded cursor-pointer">
          Upload Any File
          <input type="file" className="hidden" />
        </label>
        <button type="submit" className="p-2 bg-blue-600 text-white rounded mt-4">Submit</button>
        {fileData && (
          <div className="mt-4 p-4 border rounded shadow-md w-full">
            <h3 className="text-lg font-bold mb-2">Uploaded File Details:</h3>
            <ul>
              {Object.entries(fileData).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </section>
  );
};

export default FileUpload;