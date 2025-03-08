'use client'
import { useState } from "react";
import { backendURL_FileUpload } from "../../../config";

const FileUpload: React.FC = () => {
  const [fileData, setFileData] = useState<Record<string, any> | null>(null);
  const fileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

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
    } else {
      console.log('No file selected');
    }
  };

  return (
    <section className="relative flex items-center justify-center pb-0 pt-32 md:pt-40 px-5">
      <form onSubmit={fileSubmit} className="flex flex-col items-center gap-4">
        <p>File Upload Page</p>
        <input type="file" name="file" />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Submit</button>
        {fileData && (
          <div className="mt-4 p-4 border rounded shadow-md w-full max-w-md">
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