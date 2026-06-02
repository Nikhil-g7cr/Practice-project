import type { FormField } from "../common/DynamicForm"; // Adjust path if necessary
 // Adjust path if necessary

export const laptopFields: FormField[] = [
  { name: "sku", label: "SKU (Unique ID)", type: "text", required: true },
  { name: "brand", label: "Brand", type: "text", required: true },
  { name: "modelName", label: "Model Name", type: "text", required: true },
  { name: "price", label: "Price ($)", type: "number", required: true },
  { name: "stock", label: "Stock Quantity", type: "number", required: true },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    required: true,
    options: [
      { label: "Gaming", value: "Gaming" },
      { label: "Business", value: "Business" },
      { label: "Student", value: "Student" },
      { label: "Creator", value: "Creator" },
    ]
  },
  { name: "operatingSystem", label: "Operating System", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "isAvailable", label: "Is Available?", type: "checkbox" },
];

export const phoneFields: FormField[] = [
  { 
    name: "name", 
    label: "Phone Name", 
    type: "text", 
    required: true, 
    placeholder: "e.g., iPhone 15 Pro",
    minLength: 3,
    maxLength: 50 // Requirement 1: Name length limit
  },
  { name: "slug", label: "Slug", type: "text", required: true, placeholder: "e.g., iphone-15-pro" },
  { name: "brand", label: "Brand", type: "text", required: true, placeholder: "e.g., Apple" },
  { name: "basePrice", label: "Base Price ($)", type: "number", required: true, min: 1 },
  
  // Requirement 2: Strict Image uploading limits
  { 
    name: "thumbnail", 
    label: "Thumbnail Image", 
    type: "file", 
    required: true, 
    accept: "image/*",
    allowedFileTypes: ["image/jpeg", "image/png", "image/webp"], 
    maxFileSizeMB: 5
  },
  
  // Requirement 4: PDF Upload Feature
  {
    name: "manualPdf",
    label: "User Manual (PDF)",
    type: "file",
    required: false,
    accept: ".pdf",
    allowedFileTypes: ["application/pdf"], // ONLY allows PDF
    maxFileSizeMB: 10
  },

  // Requirement 3: Description length limit
  { 
    name: "description", 
    label: "Description", 
    type: "textarea", 
    required: true,
    minLength: 10,
    maxLength: 1000 
  },
  
  { name: "spec_processor", label: "Processor", type: "text", required: true ,minLength: 10, maxLength: 50 },
  { name: "spec_display", label: "Display", type: "text", required: true,minLength: 10, maxLength: 50  },
  { name: "spec_battery", label: "Battery", type: "text", required: true,minLength: 10, maxLength: 50  },
  { name: "spec_camera", label: "Camera", type: "text", required: true,minLength: 10, maxLength: 50  },
  { name: "spec_ram", label: "RAM", type: "text", required: true,minLength: 10, maxLength: 50  },
  { name: "spec_os", label: "Operating System", type: "text", required: true,minLength: 10, maxLength: 50  },
];