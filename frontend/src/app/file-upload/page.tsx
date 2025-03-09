'use client'
import { useState } from "react";
import { backendURL_FileUpload } from "../../../config";
import { FaFilePdf, FaFileImage, FaFileExcel, FaFile } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FileData } from "@/types";


const FileUpload: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

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
      if (error instanceof Error && error.message === 'Failed to fetch') {
        setErrorText('Network error: Unable to connect to the server. Please check your internet connection or backend status.');
      } else {
        setErrorText('Internal Server Error');
      }
    }
  };

  const fileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setErrorText('');
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
  const getSimplifiedFileType = (fileType: string) => {
    if (fileType === "application/pdf") {
      return "PDF";
    }
    if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      return "Excel (XLSX)";
    }
    return fileType.split("/")[1];
  };

  return (
    <section className="relative flex flex-col items-center justify-center pb-0 pt-32 md:pt-40">
      <form onSubmit={fileSubmit} className="w-full max-w-4xl">
        <p className="text-center mb-8 text-lg font-bold">File Upload</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {/* Left Grid - File upload options */}
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
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
              <RiFileExcel2Fill /> Upload Multiple
              <input type="file" accept=".xlsx,.xls" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Right Grid - Content & Upload any file */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-center">Not sure the file extension? Don’t worry, upload here — we will take care of it.</p>
            <div className="flex justify-center items-center w-full">
              <label className="flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded cursor-pointer w-3/5">
                <FaFile /> Upload any File type
                <input type="file" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>
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
                    <td className="border px-4 py-2 text-center">{file.name}</td>
                    <td className="border px-4 py-2 text-center">{getSimplifiedFileType(file.type)}</td>
                    <td className="border px-4 py-2 text-center">{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedFiles.length === 0 && (
          <p className="text-center py-4">No file selected - please select a file</p>
        )}
        {errorText && (
          <p className="text-center text-red-600 mt-4 font-medium">
            {errorText}
          </p>
        )}
        <div className="flex justify-center items-center mt-8">
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded max-w-xs"
          >
            {isLoading ? 'Uploading, Please wait...' : 'Submit'}
          </button>
        </div>

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