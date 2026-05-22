import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import { useAppDispatch } from "../../../../redux/hooks/reduxHooks";
import { login } from "../../../../redux/features/auth/AuthenticationSlice";
import {
  PublicClientApplication,
  type AuthenticationResult,
} from "@azure/msal-browser";
import { environment } from "../../../../environment/environment";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginError {
  field?: string;
  message: string;
}

interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthPayload {
  user: AuthUser;
  token: string;
}

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: environment.CLIENT_ID,
    authority: environment.AUTHORITY,
    redirectUri: environment.REDIRECT_URL,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
});
const msalInitializePromise = msalInstance.initialize();

const Login = () => {
  // dispatch initialization
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  // use state for login form
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);

  const completeLogin = (user: AuthUser, token: string) => {
    dispatch(login({ user, token }));
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/");
  };

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
        credentials: "include", // Include cookies for session management,

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
      completeLogin(data.user, data.accessToken);
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

  const getMicrosoftAuthPayload = async (
    authResult: AuthenticationResult
  ): Promise<AuthPayload> => {
    try {
      const backendResponse = await fetch(
        `${environment.APP_API_URL}/auth/microsoft`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
          }),
        }
      );

      if (backendResponse.ok) {
        const data = await backendResponse.json();

        if (data?.accessToken && data?.user) {
          return {
            user: data.user,
            token: data.accessToken,
          };
        }
      }
    } catch (error) {
      console.warn("Microsoft backend exchange failed", error);
    }

    const account = authResult.account;

    if (!account) {
      throw new Error("Microsoft did not return an account profile.");
    }

    return {
      token: authResult.accessToken || authResult.idToken,
      user: {
        id: account.localAccountId,
        name: account.name || account.username,
        email: account.username,
        role: "user",
      },
    };
  };

  const handleMicrosoftLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await msalInitializePromise;

      const loginRequest = {
        scopes: ["openid", "profile", "email", "User.Read"],
      };

      const response = await msalInstance.loginPopup(loginRequest);
      msalInstance.setActiveAccount(response.account);

      const { user, token } = await getMicrosoftAuthPayload(response);
      completeLogin(user, token);
    } catch (err) {
      console.error("Microsoft login failed", err);
      setError({
        message:
          err instanceof Error
            ? err.message
            : "Microsoft login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="mb-4 p-3 bg-error-container border border-error rounded-lg text-error-container text-sm">
                {error.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
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

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="divider-section">
              <div className="divider-wrapper">
                <div className="divider-line"></div>
                <span className="divider-text">Or continue with</span>
                <div className="divider-line"></div>
              </div>

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
                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  className="social-btn"
                  disabled={loading}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                    alt="Microsoft"
                    className="social-icon"
                  />
                  <span>Microsoft</span>
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
