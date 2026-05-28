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

  const handleFormSubmit = async (rawFormData: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);

    let finalThumbnailName = "";

    try {
      // 1. --- IMAGE UPLOAD LOGIC ---
      // Check if the thumbnail field contains an actual File object
      if (rawFormData.thumbnail instanceof File) {
        const uploadData = new FormData();
        uploadData.append("file", rawFormData.thumbnail);

        // Upload the file to your NestJS backend using your configured API instance
        // Assuming API has baseURL: 'http://localhost:3000/api'
        const uploadResponse = await API.post("/upload", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
            // If your API instance doesn't automatically attach the token, do it here:
            // "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          },
        });

        // Save the generated azure filename (e.g., 170...phone.jpg)
        finalThumbnailName = uploadResponse.data.fileName;
      } else {
        // Fallback just in case it was a string URL
        finalThumbnailName = rawFormData.thumbnail;
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
          
          // Use the newly uploaded Azure filename here!
          thumbnail: finalThumbnailName,
          images: [finalThumbnailName], 
          
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
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          Back
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 capitalize">
            Add New {productType}
          </h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="font-bold block mb-1">Validation Errors:</span>
            {error}
          </div>
        )}

        <div className={isSubmitting ? "opacity-50 pointer-events-none" : ""}>
          <DynamicForm
            fields={fields}
            onSubmit={handleFormSubmit}
            submitButtonText={isSubmitting ? "Saving..." : `Save ${productType}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;