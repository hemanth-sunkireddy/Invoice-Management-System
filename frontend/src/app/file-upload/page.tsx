'use client'
import { useState } from "react";
import { backendURL_FileUpload } from "../../../config";
import { FaFilePdf, FaFileImage, FaFileExcel, FaFile } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";

interface FileData {
  fileName: string;
  fileType: string;
  fileSize: number;
  [key: string]: string | number;
}

const FileUpload: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const fileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFiles.length > 0) {
      setIsLoading(true);
      await Promise.all(selectedFiles.map(file => handleFileUpload(file)));
      setIsLoading(false);
    } else {
      console.log('No file selected - please select a file');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center pb-0 pt-32 md:pt-40 px-5">
      <form onSubmit={fileSubmit} className="w-full max-w-4xl">
        <p className="text-center mb-8 text-lg font-bold">File Upload Page</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Left Grid - File upload options */}
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer">
              <FaFilePdf /> Upload PDF
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
            <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer">
              <FaFileImage /> Upload Image
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer">
              <FaFileExcel /> Upload Excel
              <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
            </label>
            <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer">
              <RiFileExcel2Fill /> Upload Multiple Excel
              <input type="file" accept=".xlsx,.xls" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Right Grid - Content & Upload any file */}
          <div className="flex flex-col gap-4 justify-between">
            <p className="text-center">Not sure the file extension? Don’t worry, upload here — we will take care of it.</p>
            <label className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer">
              <FaFile /> Upload Any File
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-8 border rounded shadow-md w-full">
            <h3 className="text-lg font-bold text-center mb-4">Selected Files</h3>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">File Name</th>
                  <th className="border px-4 py-2">File Type</th>
                  <th className="border px-4 py-2">File Size (bytes)</th>
                </tr>
              </thead>
              <tbody>
                {selectedFiles.map((file) => (
                  <tr key={file.name}>
                    <td className="border px-4 py-2">{file.name}</td>
                    <td className="border px-4 py-2">{file.type}</td>
                    <td className="border px-4 py-2">{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedFiles.length === 0 && (
          <p className="text-center py-4">No file selected - please select a file</p>
        )}

        <button type="submit" className="p-3 bg-blue-600 text-white rounded mt-8 w-full">
          {isLoading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      {fileData && (
          <div className="mt-4 p-4 border rounded shadow-md w-full">
            <h3 className="text-lg font-bold mb-2 text-center">Uploaded File Details</h3>
            <ul>
              {Object.entries(fileData).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        )}
    </section>
  );
};

export default FileUpload;