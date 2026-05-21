import React, { useEffect, useState } from "react";
import { getAllUploadedFilesApi } from "../../redux/features/phones/PhoneApi";

// 1. Define the TypeScript shape based on what your backend sends
interface AzureFile {
  fileName: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
}

export default function ImageGallery() {
  const [files, setFiles] = useState<AzureFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Fetch the files when the component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const data = await getAllUploadedFilesApi();
        
        // Filter out non-images (optional, just in case you uploaded PDFs or ZIPs)
        const imageFiles = data.filter((file: AzureFile) => 
          file.contentType?.startsWith("image/")
        );
        
        setFiles(imageFiles);
      } catch (err) {
        setError("Failed to load images from the server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // 3. Handle Loading and Error states
  if (loading) return <div className="p-10 text-center">Loading images...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  // 4. Render the grid
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Azure Uploads</h2>
      
      {files.length === 0 ? (
        <p className="text-gray-500">No images found in storage.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div key={file.fileName} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* THE MAGIC HAPPENS HERE: Just use the Azure URL in the src tag! */}
              <div className="h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={file.url} 
                  alt={file.fileName} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* File Details Footer */}
              <div className="p-3 bg-white">
                <p className="text-xs font-semibold text-gray-800 truncate" title={file.fileName}>
                  {file.fileName}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}