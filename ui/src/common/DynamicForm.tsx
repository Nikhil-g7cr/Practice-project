import React, { useState, useEffect } from "react";

export type FieldType = "text" | "number" | "email" | "password" | "textarea" | "select" | "checkbox" | "file";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  accept?: string;
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
  initialValues,
  onSubmit,
  submitButtonText = "Submit",
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    const initialState: Record<string, any> = {};
    fields.forEach((field) => {
      initialState[field.name] =
        initialValues?.[field.name] !== undefined
          ? initialValues[field.name]
          : field.type === "checkbox"
          ? false
          : field.type === "file" // File inputs should start as null
          ? null
          : "";
    });
    setFormData(initialState);
  }, [fields, initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // FIX: Check if the input is a file. If it is, grab the actual File object.
    let finalValue: any = value;
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      finalValue = files && files.length > 0 ? files[0] : null;
    }

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
            ) : field.type === "file" ? (
              // FIX: File inputs cannot have a `value` prop in React, so we render it separately
              <input
                type="file"
                id={field.name}
                name={field.name}
                accept={field.accept}
                onChange={handleChange}
                required={field.required}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-1"
              />
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
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default DynamicForm;