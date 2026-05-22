import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../../common/DynamicForm";
import { phoneFields, laptopFields } from "../../config/productFormFields";
import API from "../../config/axios.config";

interface AddProductProps {
  productType: "phone" | "laptop";
}

const AddProduct: React.FC<AddProductProps> = ({ productType }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = productType === "phone" ? phoneFields : laptopFields;
  const apiEndpoint = productType === "phone" ? "/phones" : "/laptops";
  const redirectRoute = productType === "phone" ? "/phones" : "/laptops";

  const handleFormSubmit = async (rawFormData: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);

    let payload = { ...rawFormData };

    // --- REFORMAT PHONE DATA TO MATCH NESTJS DTO ---
    if (productType === "phone") {
      payload = {
        name: rawFormData.name,
        slug: rawFormData.slug,
        brand: rawFormData.brand,
        description: rawFormData.description,
        basePrice: Number(rawFormData.basePrice), // ensure it's a number
        thumbnail: rawFormData.thumbnail,
        
        // Wrap images in an array as required by DTO
        images: [rawFormData.thumbnail], 
        
        // Group spec_ fields into the specifications object
        specifications: {
          processor: rawFormData.spec_processor,
          display: rawFormData.spec_display,
          battery: rawFormData.spec_battery,
          camera: rawFormData.spec_camera,
          ram: rawFormData.spec_ram,
          os: rawFormData.spec_os,
        },

        // DTO requires arrays for variants and colors. 
        // For a basic form, we will supply default dummy data to pass validation. 
        // (If you want dynamic arrays later, you'd build a custom UI for them)
        colors: [
          { name: "Default Black", hexCode: "#000000" }
        ],
        storageVariants: [
          { 
            storage: "128GB", 
            price: Number(rawFormData.basePrice), 
            stock: 10 
          }
        ],
        
        isAvailable: true,
      };
    }

    try {
      const response = await API.post(apiEndpoint, payload);
      
      if (response.data.status === "Success") {
        alert(`${productType} added successfully!`);
        navigate(redirectRoute);
      }
    } catch (err: any) {
      console.error(`Failed to add ${productType}:`, err);
      
      // Improved error logging: If NestJS sends an array of validation errors, display them
      const errorMsg = err.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        setError(errorMsg.join(", ")); // Shows specific validation errors like "slug must be a string"
      } else {
        setError(errorMsg || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
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