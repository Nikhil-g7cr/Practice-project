import React, { useState, useEffect } from "react";

export type FieldType = "text" | "number" | "email" | "password" | "textarea" | "select" | "checkbox";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[]; 
}

export interface DynamicFormProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (formData: Record<string, any>) => void;
  submitButtonText?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialValues, // FIX 1: Removed the '= {}' from here
  onSubmit,
  submitButtonText = "Submit",
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const initialState: Record<string, any> = {};
    fields.forEach((field) => {
      // FIX 2: Safely check if initialValues exists using optional chaining (?.)
      initialState[field.name] =
        initialValues?.[field.name] !== undefined
          ? initialValues[field.name]
          : field.type === "checkbox"
          ? false
          : "";
    });
    setFormData(initialState);
  }, [fields, initialValues]); // Now this won't trigger on every keystroke!

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    const finalValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={field.name} className="mb-1 text-sm font-medium text-gray-700 flex items-center">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={!!formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Yes</span>
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default DynamicForm;