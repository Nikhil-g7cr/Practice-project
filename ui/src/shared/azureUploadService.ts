import API from "../config/axios.config";

/**
 * Uploads a file to Azure Blob via the backend API.
 * @param file The File object to upload
 * @returns The generated fileName on Azure (e.g., "174...-[name].jpg")
 */
export const uploadFileToAzure = async (file: File): Promise<string> => {
  const uploadData = new FormData();
  uploadData.append("file", file);

  const response = await API.post("/upload", uploadData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Ensure this matches your backend response exactly. 
  // Based on your code, it returns response.data.fileName
  const fileName = response.data?.fileName || response.data?.data?.fileName;
  
  if (!fileName) {
      throw new Error("File uploaded, but backend did not return a fileName.");
  }
  
  return fileName;
};

/**
 * Deletes an orphaned or removed file from Azure Blob.
 * @param fileName The name of the file to delete
 */
export const deleteFileFromAzure = async (fileName: string): Promise<void> => {
    try {
        // Adjust the endpoint to match your actual backend delete route
        await API.delete(`/upload/${fileName}`); 
    } catch (error) {
        console.error(`Failed to delete orphaned file from Azure: ${fileName}`, error);
    }
};