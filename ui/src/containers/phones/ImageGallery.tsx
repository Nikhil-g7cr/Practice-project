import React, { useEffect, useState, useMemo } from "react";
import { 
  getAllUploadedFilesApi, 
  uploadImageToAzureApi, 
  deleteImageFromAzureApi 
} from "../../redux/features/phones/PhoneApi";
import { useAppSelector } from "../../redux/hooks/reduxHooks";
import { Roles } from "../../routes/Roles";
import Popup from "../../common/Popup";
import { usePopup } from "../../hooks/usePopup";

interface AzureFile {
  fileName: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
}

type FileFilter = 'all' | 'image' | 'pdf' | 'other';

export default function FileGallery() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === Roles.ADMIN;
  const { popupState, showError, showSuccess, closePopup } = usePopup();

  const [files, setFiles] = useState<AzureFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FILTERS & SELECTION ---
  const [filter, setFilter] = useState<FileFilter>('all');
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  // --- STATE FOR UPLOAD MODAL ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- STATE FOR DELETE MODAL ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await getAllUploadedFilesApi();
      let extractedFiles = [];
      if (Array.isArray(response)) {
        extractedFiles = response;
      } else if (response?.data && Array.isArray(response.data)) {
        extractedFiles = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        extractedFiles = response.data.data;
      } else if (response?.data?.files && Array.isArray(response.data.files)) {
        extractedFiles = response.data.files;
      }


      setFiles(extractedFiles);
      setError(null);
    } catch (err: any) {
      // Make sure we actually display the error string if it fails
      setError(err?.response?.data?.message || err.message || "Failed to load files from storage.");
    } finally {
      setLoading(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      if (filter === 'all') return true;
      if (filter === 'image') return f.contentType.startsWith('image/');
      if (filter === 'pdf') return f.contentType === 'application/pdf';
      if (filter === 'other') return !f.contentType.startsWith('image/') && f.contentType !== 'application/pdf';
      return true;
    });
  }, [files, filter]);

  // --- SELECTION LOGIC ---
  const toggleSelection = (fileName: string) => {
    setSelectedFileNames(prev => 
      prev.includes(fileName) ? prev.filter(n => n !== fileName) : [...prev, fileName]
    );
  };

  const handleSelectAll = () => {
    if (selectedFileNames.length === filteredFiles.length) {
      setSelectedFileNames([]); // Deselect all
    } else {
      setSelectedFileNames(filteredFiles.map(f => f.fileName)); // Select all current
    }
  };

  // --- UPLOAD LOGIC ---
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      await uploadImageToAzureApi(selectedFile);
      showSuccess("Upload Complete", `${selectedFile.name} was successfully uploaded to Azure.`);
      await fetchFiles(); // Refresh gallery to verify upload
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      showError("Upload Failed", err.message || "Could not upload the file.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- DELETE LOGIC ---
  const triggerDelete = (fileNames: string[]) => {
    setFilesToDelete(fileNames);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Execute deletions concurrently 
      await Promise.all(filesToDelete.map(name => deleteImageFromAzureApi(name)));
      
      showSuccess("Deleted Successfully", `${filesToDelete.length} file(s) were permanently deleted.`);
      
      // Remove deleted files from state
      setFiles(prev => prev.filter(f => !filesToDelete.includes(f.fileName)));
      setSelectedFileNames([]); // clear selections
    } catch (err: any) {
      showError("Deletion Error", "Failed to delete one or more files.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setFilesToDelete([]);
    }
  };

  // Format bytes to KB/MB
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Render appropriate preview based on file type
  const renderPreview = (file: AzureFile) => {
    if (file.contentType.startsWith('image/')) {
      return <img src={file.url} alt={file.fileName} className="w-full h-full object-cover" />;
    }
    if (file.contentType === 'application/pdf') {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-red-50 text-red-500">
          <span className="material-symbols-outlined text-4xl mb-2">picture_as_pdf</span>
          <span className="text-xs font-bold uppercase">PDF Document</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-100 text-slate-500">
        <span className="material-symbols-outlined text-4xl mb-2">draft</span>
        <span className="text-xs font-bold uppercase">File</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <Popup config={popupState} onClose={closePopup} />

      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Storage Explorer</h1>
            <p className="text-slate-600 mt-2">Manage all assets and documents stored on Azure Blob.</p>
          </div>
          
          {isAdmin && (
            <div className="flex gap-3">
               {selectedFileNames.length > 0 && (
                <button 
                  onClick={() => triggerDelete(selectedFileNames)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-xl hover:bg-red-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                  Delete Selected ({selectedFileNames.length})
                </button>
              )}
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                Upload File
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {(['all', 'image', 'pdf', 'other'] as FileFilter[]).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  filter === type ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {type === 'all' ? 'All Files' : type === 'other' ? 'Other Docs' : type + 's'}
              </button>
            ))}
          </div>

          {isAdmin && filteredFiles.length > 0 && (
             <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer pr-4">
              <input 
                type="checkbox" 
                checked={selectedFileNames.length === filteredFiles.length && filteredFiles.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              Select All
             </label>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium bg-red-50 rounded-2xl border border-red-100">
            {error}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">folder_open</span>
            <p className="text-slate-500 font-medium">No files found matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => {
              const isSelected = selectedFileNames.includes(file.fileName);
              return (
                <div 
                  key={file.fileName} 
                  className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isSelected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200 hover:shadow-md"
                  }`}
                >
                  {/* Select Checkbox (Admin Only) */}
                  {isAdmin && (
                    <div className="absolute top-2 left-2 z-20">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(file.fileName)}
                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 shadow-sm focus:ring-indigo-500 cursor-pointer bg-white/80 backdrop-blur"
                      />
                    </div>
                  )}

                  {/* Single Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={() => triggerDelete([file.fileName])}
                      className="absolute top-2 right-2 z-20 p-1.5 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                      title="Delete File"
                    >
                      <span className="material-symbols-outlined text-[18px] block">delete</span>
                    </button>
                  )}

                  {/* Preview Area */}
                  <div className="aspect-square relative overflow-hidden bg-slate-50">
                     {renderPreview(file)}
                     {/* Overlay for non-image files to open them */}
                     {!file.contentType.startsWith('image/') && (
                        <a href={file.url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-slate-900/0 hover:bg-slate-900/10 transition-colors z-10">
                           <span className="opacity-0 group-hover:opacity-100 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transition-all">Open File</span>
                        </a>
                     )}
                  </div>

                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-800 truncate" title={file.fileName}>
                      {file.fileName}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                        {file.contentType.split('/')[1] || 'FILE'}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- MODALS --- */}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Upload New File</h2>
              <input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-6"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isUploading}
                  className="px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Upload to Azure"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Multi/Single Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete {filesToDelete.length > 1 ? `${filesToDelete.length} Files` : 'File'}?</h2>
              <p className="text-sm text-slate-600 mb-8">
                Are you sure you want to permanently delete {filesToDelete.length > 1 ? "these files" : "this file"} from Azure storage? This cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  disabled={isDeleting}
                  className="px-6 py-2.5 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  disabled={isDeleting}
                  className="px-6 py-2.5 font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}