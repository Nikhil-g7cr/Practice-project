import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import { BRAND_NAME } from "../../../../shared/shared-variables";
import ErrorDisplay from "../../../errors/errorDisplay";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

interface SignupError {
  field?: string;
  message: string;
}

export default function Signup() {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SignupError | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError({ field: "name", message: "Full name is required" });
      return false;
    }

    if (!formData.email.trim()) {
      setError({ field: "email", message: "Email is required" });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError({ field: "email", message: "Please enter a valid email" });
      return false;
    }

    if (!formData.password.trim()) {
      setError({ field: "password", message: "Password is required" });
      return false;
    }

    if (formData.password.length < 8) {
      setError({
        field: "password",
        message: "Password must be at least 8 characters",
      });
      return false;
    }

    if (!formData.terms) {
      setError({
        message: "You must agree to the Terms of Service and Privacy Policy",
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }

      const data = await response.json();

      // Store token if provided
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      // Store user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to dashboard or login
      navigate("/login");
    } catch (err) {
      setError({
        message:
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-on-surface)",
      }}
      className="antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container light"
    >
      {/* Main Canvas */}
      <main className="flex-grow pt-24 pb-20 md:pt-32 flex items-center justify-center bg-gradient-to-br from-background to-surface-container px-4 md:px-16">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden ambient-shadow bg-surface-container-lowest">
          {/* Left Side: Registration Form */}
          <div className="p-8 md:p-16 flex bg-white flex-col justify-center bg-surface-container-lowest border-r border-outline-variant/30">
            <div className="mb-10">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2">
                Create Account
              </h1>
              <p className="font-body text-base text-on-surface-variant">
                Join {BRAND_NAME} to access exclusive professional-grade
                electronics.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <ErrorDisplay ErrorMessage={error.message} />
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label
                  className="block font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-1.5"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    person
                  </span>
                  <input
                    className={`w-full pl-10 pr-3 py-3 bg-surface-container-lowest border rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body text-base text-on-surface placeholder:text-outline/50 ${
                      error?.field === "name"
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className="block font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-1.5"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    mail
                  </span>
                  <input
                    className={`w-full pl-10 pr-3 py-3 bg-surface-container-lowest border rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body text-base text-on-surface placeholder:text-outline/50 ${
                      error?.field === "email"
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    id="email"
                    name="email"
                    placeholder="jane@example.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  className="block font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-1.5"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    lock
                  </span>
                  <input
                    className={`w-full pl-10 pr-3 py-3 bg-surface-container-lowest border rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body text-base text-on-surface placeholder:text-outline/50 ${
                      error?.field === "password"
                        ? "border-error"
                        : "border-outline-variant"
                    }`}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <p className="font-body text-sm text-on-surface-variant mt-1.5">
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest"
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3">
                  <label
                    className="font-body text-sm text-on-surface-variant"
                    htmlFor="terms"
                  >
                    I agree to the{" "}
                    <a
                      className="text-primary font-semibold hover:underline"
                      href="#terms"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      className="text-primary font-semibold hover:underline"
                      href="#privacy"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full py-3 px-6 bg-primary text-on-primary rounded-lg font-headline text-lg font-semibold hover:bg-primary/90 transition-colors duration-200 mt-8 shadow-[0_4px_0_0_rgba(74,124,89,0.3)] active:shadow-none active:translate-y-1"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>

          {/* Right Side: Value Proposition / Image */}
          <div className="hidden md:flex flex-col relative overflow-hidden bg-surface-container-low">
            {/* Abstract Tech Background Image */}
            <div className="absolute inset-0 z-0 bg-primary/5">
              <img
                alt="Abstract representation of high-end circuitry and clean technological aesthetics."
                className="w-full h-full object-cover opacity-20 grayscale mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuCcQei8u3bglQg8rcDs70CrNhd8vFcRtqZtOZF8vn-lyaNcIH3yRctUVc0hARQlbwDKODNIM-iA5mMsN92EBHCvNkl9-jLht4ZkW9NEFeMzHu4gsVOsiGV7mqNy3oJ4VaDHG0suxZzkAwIuleO95jO34luRduAfHWs1NxV0E6Wkf-fTUPjJ-5e9UpZMa-exy09jnRyfmT__cc4BU5YMlZkMNyy8dakgIxcCjOQT3Yzm5fnlzpSMUH0A_oVTJbLSr48oGBJznVYf1X"
              />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between p-16">
              <div className="space-y-8 glass-panel p-6 rounded-xl">
                <h2 className="font-headline text-3xl font-bold text-on-surface">
                  Precision Engineered for Professionals
                </h2>
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                      <span className="material-symbols-outlined">
                        local_shipping
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline text-lg text-on-surface font-semibold">
                        Priority Shipping
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant mt-1">
                        Get your gear faster with expedited order processing.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                      <span className="material-symbols-outlined">
                        verified
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline text-lg text-on-surface font-semibold">
                        Extended Warranty
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant mt-1">
                        Automatic 2-year warranty on all premium components.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                      <span className="material-symbols-outlined">
                        support_agent
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline text-lg text-on-surface font-semibold">
                        Dedicated Support
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant mt-1">
                        Direct access to our tier-2 technical engineering team.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    eco
                  </span>
                  <span className="font-label text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                    Stuff SYSTEM v2.4 ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
