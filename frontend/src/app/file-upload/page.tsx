'use client'
import { backendURL_FileUpload } from "../../../config";

const FileUpload: React.FC = () => {
  const fileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      try {
        const base64Content = await toBase64(file);


        formData.append('fileName', file.name);
        formData.append('fileType', file.type);
        formData.append('fileSize', file.size.toString());
        formData.append('fileContent', base64Content);

        console.log('File details:', {
          name: file.name,
          type: file.type,
          size: file.size,
          base64Content,
        });

        const response = await fetch(backendURL_FileUpload, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const result = await response.json();
        console.log('Success:', result);
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
      </form>
    </section>
  );
};

export default FileUpload;
