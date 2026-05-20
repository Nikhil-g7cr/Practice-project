import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import { useDispatch } from "react-redux";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginError {
  field?: string;
  message: string;
}

const Login = () => {

  // dispatch initialization 
  const dispatch = useDispatch();
  

  const navigate = useNavigate();

  // use state for login form 
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
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

    if (formData.password.length < 6) {
      setError({
        field: "password",
        message: "Password must be at least 6 characters",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
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

      // Store remember me preference
      if (formData.rememberMe) {
        localStorage.setItem("rememberEmail", formData.email);
      }

      // Redirect to dashboard or home
      navigate("/");
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

  const handleGoogleLogin = () => {
    // Implement Google OAuth login
    console.log("Google login clicked");
  };

  const handleAppleLogin = () => {
    // Implement Apple OAuth login
    console.log("Apple login clicked");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-pattern text-on-surface min-h-screen flex flex-col font-body antialiased">
      <main className="flex-grow flex items-center justify-center p-4 md:p-16">
        <div className="auth-card">
          {/* Header with Logo */}
          <div className="auth-card-header">
            <a href="/" className="auth-brand-logo">
              Lumina Tech
            </a>
          </div>

          {/* Glass Card Form Container */}
          <div className="auth-form-wrapper">
            {/* Form Header */}
            <div className="auth-form-header">
              <h1 className="auth-form-title">Welcome back</h1>
              <p className="auth-form-subtitle">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error rounded-lg text-error-container text-sm">
                {error.message}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="form-input-wrapper">
                  <span className="form-input-icon material-symbols-outlined">
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${error?.field === "email" ? "border-error" : ""}`}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="form-input-wrapper">
                  <span className="form-input-icon material-symbols-outlined">
                    lock
                  </span>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${error?.field === "password" ? "border-error" : ""}`}
                    required
                  />
                </div>
              </div>

              {/* Checkbox and Forgot Password */}
              <div className="form-checkbox-group">
                <div className="checkbox-wrapper">
                  <input
                    id="remember-me"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="remember-me" className="checkbox-label">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="forgot-password-link"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="divider-section">
              <div className="divider-wrapper">
                <div className="divider-line"></div>
                <span className="divider-text">Or continue with</span>
                <div className="divider-line"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="social-buttons-grid">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="social-btn"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQz_QywYHMSMdToW6wEfnbabwgTPF6PRsdLrdqXc9Lm2sh9jEpT4BuKIt3rgwq6VnaH0_DmJmDfir8TEoaLuKoSBpwXIHz_-G2HeG2AezpRPtBuSgceppZdwIgElAMD6x74inRmESsH6Qro0GLiNarCgKJPpQPPPaSD0MX-PcH1hQF1LOE-M1-qlyEnxE1xetGaGKKSqV0izHYXQ0wZtYMztbkITZ6CUuXo2tFSxvAR8tmBUj9qzpWeyszWGF3x8jNDSBzDXi9xown"
                    alt="Google"
                    className="social-icon"
                  />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleAppleLogin}
                  className="social-btn"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk10T-otNfhAH-WaOO6PmyjrNhCtGa3D6J-C0WAB9O3N9zyJOrrPa25erm4zeCLXK8QsGPwLVDMyT2ljjiWJM2aj4zOGGXj22_-DAg9bgSJiqgPAi_zjvwRxGgvekEW2DubSJQyb1z_-8DcOAwZ7_t_qFesxVnC9-8goPVlMyehfHobxWtAWtqFv4Wdl534VfyJW_juG-EvS-VYRRAU9qQjL88ZTq7LvehqvkTy8Dz27Q9OVYw8Y1VdwaCmWTMw-4mDp_NbWFfuM4i"
                    alt="Apple"
                    className="social-icon"
                  />
                  <span>Apple</span>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="signup-link-section">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={handleSignUpClick}
                className="signup-link"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
