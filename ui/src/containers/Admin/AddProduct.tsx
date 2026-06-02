import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../../common/DynamicForm";
import Popup from "../../common/Popup";
import { phoneFields, laptopFields } from "../../config/productFormFields";
import API from "../../config/axios.config";
import { usePopup } from "../../hooks/usePopup";

interface AddProductProps {
  productType: "phone" | "laptop";
}

const AddProduct: React.FC<AddProductProps> = ({ productType }) => {
  const navigate = useNavigate();
  const { popupState, showPopup, closePopup } = usePopup();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = productType === "phone" ? phoneFields : laptopFields;
  const apiEndpoint = productType === "phone" ? "/phones" : "/laptops";
  const redirectRoute = productType === "phone" ? "/phones" : "/laptops";

  // Reusable upload helper
  const uploadFileToAzure = async (file: File): Promise<string> => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    const uploadResponse = await API.post("/upload", uploadData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return uploadResponse.data.fileName;
  };

  const handleFormSubmit = async (rawFormData: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. --- DYNAMIC UPLOAD LOGIC ---
      let finalThumbnailName = rawFormData.thumbnail;
      if (rawFormData.thumbnail instanceof File) {
        finalThumbnailName = await uploadFileToAzure(rawFormData.thumbnail);
      }

      let finalManualPdfName = rawFormData.manualPdf;
      if (rawFormData.manualPdf instanceof File) {
        finalManualPdfName = await uploadFileToAzure(rawFormData.manualPdf);
      }

      // 2. --- REFORMAT PRODUCT DATA ---
      let payload = { ...rawFormData };

      if (productType === "phone") {
        payload = {
          name: rawFormData.name,
          slug: rawFormData.slug,
          brand: rawFormData.brand,
          description: rawFormData.description,
          basePrice: Number(rawFormData.basePrice),
          
          thumbnail: finalThumbnailName,
          images: [finalThumbnailName], 
          manualPdf: finalManualPdfName || null, // Ensure PDF name is sent to backend
          
          specifications: {
            processor: rawFormData.spec_processor,
            display: rawFormData.spec_display,
            battery: rawFormData.spec_battery,
            camera: rawFormData.spec_camera,
            ram: rawFormData.spec_ram,
            os: rawFormData.spec_os,
          },
          colors: [{ name: "Default Black", hexCode: "#000000" }],
          storageVariants: [
            {
              storage: "128GB",
              price: Number(rawFormData.basePrice),
              stock: 10,
            },
          ],
          isAvailable: true,
        };
      }

      // 3. --- SAVE PRODUCT TO DATABASE ---
      const response = await API.post(apiEndpoint, payload);

      if (response.data.status === "Success" || response.data) {
        showPopup(
          "success",
          "Product added",
          `${productType} added successfully.`,
          {
            action: "Added",
            autoCloseDelay: 1200,
            onClose: () => navigate(redirectRoute),
          }
        );
      }
    } catch (err: any) {
      console.error(`Failed to add ${productType}:`, err);
      const errorMsg = err.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        setError(errorMsg.join(", ")); 
      } else {
        setError(errorMsg || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Popup config={popupState} onClose={closePopup} />
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 capitalize">
            Add New {productType}
          </h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="font-bold block mb-1">Server Errors:</span>
            {error}
          </div>
        )}

        <div className={isSubmitting ? "opacity-50 pointer-events-none" : ""}>
          <DynamicForm
            fields={fields}
            onSubmit={handleFormSubmit}
            submitButtonText={isSubmitting ? "Uploading & Saving..." : `Save ${productType}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;