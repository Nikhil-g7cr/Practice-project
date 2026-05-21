import React, { useEffect, useState, useCallback } from "react";
import { 
  getAllUploadedFilesApi, 
  uploadImageToAzureApi, 
  deleteImageFromAzureApi // <-- IMPORT THE NEW FUNCTION
} from "../../redux/features/phones/PhoneApi";
import { useAppSelector } from "../../redux/hooks/reduxHooks";
import { Roles } from "../../routes/Roles";

interface AzureFile {
  fileName: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
}

export default function ImageGallery() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === Roles.ADMIN;

  const [files, setFiles] = useState<AzureFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE FOR UPLOAD MODAL ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- STATE FOR DELETE MODAL ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH FILES ---
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUploadedFilesApi();
      
      const imageFiles = data.filter((file: AzureFile) => 
        file.contentType?.startsWith("image/")
      );
      
      const sortedFiles = imageFiles.sort((a: AzureFile, b: AzureFile) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setFiles(sortedFiles);
    } catch (err) {
      setError("Failed to load images from the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Gallery data is loaded from Azure-backed API when this screen mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFiles();
  }, [fetchFiles]);

  // --- UPLOAD HANDLERS ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    if (!isAdmin) {
      setError("Only admins can upload images.");
      return;
    }

    try {
      setIsUploading(true);
      await uploadImageToAzureApi(selectedFile);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      await fetchFiles(); // Refresh gallery
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image. Make sure the backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- DELETE HANDLERS ---
  const handleDeleteClick = (fileName: string) => {
    if (!isAdmin) {
      setError("Only admins can delete images.");
      return;
    }

    setFileToDelete(fileName);
    setIsDeleteModalOpen(true); // Open the confirmation popup
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    if (!isAdmin) {
      setError("Only admins can delete images.");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteImageFromAzureApi(fileToDelete);
      setIsDeleteModalOpen(false);
      setFileToDelete(null);
      await fetchFiles(); // Refresh gallery after deletion
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete image.");
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading && files.length === 0) return <div className="p-10 text-center">Loading images...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Azure Uploads</h2>
        
        {isAdmin && (
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-[#4a7c59] hover:bg-[#3c6649] text-white px-5 py-2 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2"
          >
            <span>+ Upload Image</span>
          </button>
        )}
      </div>
      
      {/* Gallery Grid */}
      {files.length === 0 && !loading ? (
        <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          No images found in storage. Click upload to add one!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div key={file.fileName} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative">
              
              {/* Image Container */}
              <div className="h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={file.url} 
                  alt={file.fileName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* DELETE BUTTON (Shows on hover) */}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteClick(file.fileName)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-red-50 text-red-500 p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Delete Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

              {/* File Details */}
              <div className="p-3 bg-white border-t border-gray-50">
                <p className="text-xs font-semibold text-gray-800 truncate" title={file.fileName}>
                  {file.fileName.split('-').slice(1).join('-')}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- UPLOAD MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] max-w-[90%] transform transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upload to Azure</h3>
            <p className="text-sm text-gray-500 mb-4">Select an image to upload directly to your blob storage container.</p>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#4a7c59] hover:file:bg-green-100 mb-6 border border-gray-200 rounded-xl p-2"
            />

            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => { setIsUploadModalOpen(false); setSelectedFile(null); }}
                disabled={isUploading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                className="px-6 py-2 bg-[#4a7c59] text-white rounded-xl font-semibold transition-colors disabled:bg-gray-300 flex items-center gap-2"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] max-w-[90%] transform transition-all">
            <div className="flex items-center gap-4 mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800">Delete Image</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this image? This action will permanently remove it from your Azure storage and cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => { setIsDeleteModalOpen(false); setFileToDelete(null); }}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors disabled:bg-red-300 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
