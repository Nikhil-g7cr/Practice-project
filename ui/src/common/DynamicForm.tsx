import React, { useState, useEffect } from "react";

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "file";

// --- UPGRADED: Added validation properties ---
export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  accept?: string;
  options?: { label: string; value: string | number }[];
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  allowedFileTypes?: string[]; // e.g., ["image/jpeg", "image/png", "application/pdf"]
  maxFileSizeMB?: number;
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
  const [errors, setErrors] = useState<Record<string, string>>({}); // NEW: Error state
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {},
  ); // NEW: Track visibility for multiple password fields

  useEffect(() => {
    const initialState: Record<string, any> = {};
    fields.forEach((field) => {
      initialState[field.name] =
        initialValues?.[field.name] !== undefined
          ? initialValues[field.name]
          : field.type === "checkbox"
            ? false
            : field.type === "file"
              ? null
              : "";
    });
    setFormData(initialState);
  }, [fields, initialValues]);

  // --- NEW: Universal Validation Engine ---
  const validateField = (field: FormField, value: any): string | null => {
    if (
      field.required &&
      (value === null || value === undefined || value === "")
    ) {
      return `${field.label} is required`;
    }

    if (typeof value === "string") {
      if (field.minLength && value.trim().length < field.minLength) {
        return `${field.label} must be at least ${field.minLength} characters.`;
      }
      if (field.maxLength && value.trim().length > field.maxLength) {
        return `${field.label} cannot exceed ${field.maxLength} characters.`;
      }
    }

    if (field.type === "number" && value !== "") {
      const numValue = Number(value);
      if (field.min !== undefined && numValue < field.min) {
        return `${field.label} must be at least ${field.min}.`;
      }
      if (field.max !== undefined && numValue > field.max) {
        return `${field.label} cannot exceed ${field.max}.`;
      }
    }

    if (field.type === "file" && value instanceof File) {
      if (
        field.allowedFileTypes &&
        !field.allowedFileTypes.includes(value.type)
      ) {
        return `Invalid file format. Allowed types: ${field.allowedFileTypes.join(", ")}`;
      }
      if (
        field.maxFileSizeMB &&
        value.size > field.maxFileSizeMB * 1024 * 1024
      ) {
        return `File is too large. Maximum size is ${field.maxFileSizeMB}MB.`;
      }
    }
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    let finalValue: any = value;
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      finalValue = files && files.length > 0 ? files[0] : null;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // Real-time error clearing
    const fieldConfig = fields.find((f) => f.name === name);
    if (fieldConfig) {
      const error = validateField(fieldConfig, finalValue);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate ALL fields before submitting
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      onSubmit(formData);
    }
  };

  // NEW: Toggle visibility for a specific password field
  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
      relative
      w-full
      max-w-lg
      mx-auto
      p-8
      rounded-[32px]
      border
      text-black
      border-white/20
      bg-white/10
      backdrop-blur-2xl
      shadow-[0_8px_32px_rgba(31,38,135,0.25)]
      overflow-hidden
    "
    >
      {/* Liquid Glass Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-5">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label
              htmlFor={field.name}
              className="mb-2 flex items-center text-sm font-medium text-black"
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-400">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className={`
                w-full
                rounded-2xl
                border
                px-4
                py-3
                bg-white/10
                backdrop-blur-xl
                text-black
                transition-all
                duration-300
                focus:outline-none
                focus:ring-4
                ${
                  errors[field.name]
                    ? "border-red-400 focus:ring-red-400/20"
                    : "border-white/20 "
                }
              `}
              >
                <option value="" disabled className="text-black">
                  Select {field.label}
                </option>

                {field.options?.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="text-black"
                  >
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
                rows={4}
                className={`
                w-full
                rounded-2xl
                border
                px-4
                py-3
                bg-white/10
                backdrop-blur-xl
                text-black
                placeholder:text-black/50
                transition-all
                duration-300
                focus:outline-none
                focus:ring-4
                ${
                  errors[field.name]
                    ? "border-red-400 focus:ring-red-400/20"
                    : "border-white/20 "
                }
              `}
              />
            ) : field.type === "checkbox" ? (
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={!!formData[field.name]}
                  onChange={handleChange}
                  className="
                  h-5
                  w-5
                  rounded
                  border-white/30
                  bg-white/10
                  
                "
                />
                <span className="ml-2 text-sm text-black/80">Yes</span>
              </div>
            ) : field.type === "file" ? (
              <input
                type="file"
                id={field.name}
                name={field.name}
                accept={field.accept}
                onChange={handleChange}
                className="
                block
                w-full
                rounded-2xl
                border
                border-white/20
                bg-white/10
                backdrop-blur-xl
                p-3
                text-black
                file:mr-4
                file:rounded-xl
                file:border-0
                file:bg-white/20
                file:px-4
                file:py-2
                file:text-black
                hover:file:bg-white/30
              "
              />
            ) : field.type === "password" ? (
              <div className="relative">
                <input
                  type={showPasswords[field.name] ? "text" : "password"}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder || "••••••••"}
                  className={`
                  w-full
                  rounded-2xl
                  border
                  px-4
                  py-3
                  pr-12
                  bg-white/10
                  backdrop-blur-xl
                  text-black
                  placeholder:text-black/50
                  transition-all
                  duration-300
                  focus:outline-none
                  focus:ring-4
                  ${
                    errors[field.name]
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-white/20 "
                  }
                `}
                />

                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-black/60
                  hover:text-black
                  transition-colors
                "
                >
                  <span className="material-symbols-outlined">
                    {showPasswords[field.name]
                      ? "visibility"
                      : "visibility_off"}
                  </span>
                </button>
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`
                w-full
                rounded-2xl
                border
                px-4
                py-3
                bg-white/10
                backdrop-blur-xl
                text-black
                placeholder:text-black/50
                transition-all
                duration-300
                focus:outline-none
                focus:ring-4
                ${
                  errors[field.name]
                    ? "border-red-400 focus:ring-red-400/20"
                    : "border-white/20 "
                }
              `}
              />
            )}

            {errors[field.name] && (
              <p className="mt-2 flex items-center gap-1 text-xs text-red-300">
                <span className="material-symbols-outlined text-xs">error</span>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="
        relative
        z-10
        mt-8
        w-full
        rounded-2xl
        border
        border-white/20
        bg-white/20
        px-4
        py-3
        font-semibold
        text-black
        backdrop-blur-xl
        transition-all
        duration-300
        hover:bg-white/30
        hover:scale-[1.02]
        active:scale-[0.98]
      "
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default DynamicForm;
