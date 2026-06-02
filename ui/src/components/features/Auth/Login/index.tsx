import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import { useAppDispatch } from "../../../../redux/hooks/reduxHooks";
import { login } from "../../../../redux/features/auth/AuthenticationSlice";
import { environment } from "../../../../environment/environment";
import ErrorDisplay from "../../../errors/errorDisplay";
import { loginRequest } from "../../../../config/ms.config";
import { useMsal } from "@azure/msal-react";
// import MicrosoftLoginButton from "./msLoginButton";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  name?: string;
  email?: string;
  password?: string;
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
  image_url?: string;
}

interface AuthPayload {
  user: AuthUser;
  token?: string;
  accessToken?: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [debugStatus, setDebugStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});
  const [error, setError] = useState<LoginError | null>(null);

  const { instance } = useMsal();

  useEffect(() => {
    console.info("[Login] Login component rendered");
  }, []);

  const fetchAuthenticatedUser = async (
    token: string,
    fallbackUser: AuthUser,
  ) => {
    const response = await fetch(`${environment.APP_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return fallbackUser;
    }

    return response.json();
  };

  const completeLogin = async (user: AuthUser, token: string) => {
    console.log("[Auth] Storing application session", {
      userEmail: user.email,
      hasAccessToken: !!token,
    });

    const authenticatedUser = await fetchAuthenticatedUser(token, user);

    dispatch(login({ user: authenticatedUser, token }));

    sessionStorage.setItem("accessToken", token);

    sessionStorage.setItem("user", JSON.stringify(authenticatedUser));

    console.log("[Auth] Application session stored", {
      accessTokenStored: !!sessionStorage.getItem("accessToken"),
      userStored: !!sessionStorage.getItem("user"),
    });

    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear form submission error when user starts typing
    setError(null);

    // Real-time validation
    const errors: LoginErrors = { ...fieldErrors };

    if (name === "name") {
      if (!value.trim()) {
        errors.name = "Name is required";
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        errors.name = "Name can only contain letters and spaces";
      } else {
        delete errors.name;
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        errors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        errors.password = "Password is required";
      } else if (value.length < 6) {
        errors.password = "Password must be at least 6 characters";
      } else {
        delete errors.password;
      }
    }

    setFieldErrors(errors);
  };

  const validateForm = (): boolean => {
    const errors: LoginErrors = {};

    // Validate name
    // if (!formData.name.trim()) {
    //   errors.name = "Name is required";
    // } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
    //   errors.name = "Name can only contain letters and spaces";
    // }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Validate password
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${environment.APP_API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
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

      const data: AuthPayload = await response.json();

      setFieldErrors({});
      const apiAccessToken = data.accessToken || data.token;

      if (!apiAccessToken) {
        throw new Error("Login response did not include an access token");
      }

      await completeLogin(data.user, apiAccessToken);
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
    setError({ message: "Google sign-in is not configured yet." });
  };

  // ================= MICROSOFT SSO =================

  const handleMicrosoftLogin = async () => {
    console.info("[Microsoft SSO] Microsoft button clicked");
    setDebugStatus("Microsoft sign-in started. Check the popup window.");
    setError(null);
    setLoading(true);

    try {
      console.log("[Microsoft SSO] Opening Microsoft popup");
      
      // 1. Trigger the Microsoft login popup using your ms.config.ts settings
      const result = await instance.loginPopup(loginRequest);

      console.log("ACCESS TOKEN:", result.accessToken);

      if (!result.accessToken) {
        throw new Error("No access token received from Microsoft");
      }

      setDebugStatus("Authenticating with server...");

      // 2. Send the token to your NestJS backend
      const response = await fetch(`${environment.APP_API_URL}/auth/microsoft`, {
        method: "POST",
        credentials: "include", // CRITICAL: This allows your backend to set the HttpOnly refresh cookie!
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: result.accessToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Microsoft login failed on server");
      }

      const data: AuthPayload = await response.json();
      const apiAccessToken = data.accessToken || data.token;

      if (!apiAccessToken) {
        throw new Error(
          "Microsoft login response did not include an access token",
        );
      }

      // 3. Complete the login process using your existing helper
      setFieldErrors({});
      setDebugStatus("Login successful! Redirecting...");

      // We pass data.user and data.accessToken to the completeLogin function you already wrote
      await completeLogin(data.user, apiAccessToken);
    } catch (err: any) {
      console.error("[Microsoft SSO] Error:", err);

      // If the user manually closes the popup window, MSAL throws a "user_cancelled" error.
      // We catch it so it displays a nice message instead of a scary red error.
      const errorMessage =
        err instanceof Error && err.message.includes("user_cancelled")
          ? "Microsoft sign-in was cancelled."
          : err instanceof Error
            ? err.message
            : "Microsoft authentication failed.";

      setError({ message: errorMessage });
      setDebugStatus("");
    } finally {
      setLoading(false);
    }
  };

  // =================================================

  const handleAppleLogin = () => {
    setError({ message: "Apple sign-in is not configured yet." });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className="relative min-h-screen overflow-hidden w-full bg-[url('/login.png')] bg-cover bg-center bg-no-repeat">
      {/* Dark Overlay For Contrast */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Playful Glow Background */}
      <div className="absolute top-[-150px] left-[-120px] w-[420px] h-[420px] bg-cyan-300/30 rounded-full blur-3xl animate-pulse" />

      <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-3xl animate-pulse" />

      <div className="absolute top-[40%] left-[50%] w-[260px] h-[260px] bg-pink-200/20 rounded-full blur-3xl" />

      {/* Global Blur Layer */}
      {/* <div
        className="
        absolute
        inset-0
        backdrop-blur-[12px]
      "
      /> */}

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        {/* LIQUID GLASS CARD */}
        <div className="mt-20 group relative w-full max-w-[460px] overflow-hidden rounded-[2.5rem] bg-white/12 backdrop-blur-[35px] border border-white/30 before:absolute before:inset-0 before:rounded-[2.5rem] before:p-[1.2px] before:bg-gradient-to-br before:from-white/70 before:via-white/10 before:to-cyan-200/30 before:pointer-events-none after:absolute after:inset-[1px] after:rounded-[2.4rem] after:bg-white/[0.03] after:backdrop-blur-[50px] after:pointer-events-none shadow-[0_20px_80px_rgba(255,255,255,0.08)]">
          {/* Reflection Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />

          {/* Top Reflection */}
          <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

          {/* Cyan Glow */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-200/25 rounded-full blur-3xl" />

          {/* Purple Glow */}
          <div className="absolute bottom-[-70px] right-[-40px] w-40 h-40 bg-purple-200/20 rounded-full blur-3xl" />

          {/* Animated Shine */}
          <div className="absolute top-0 left-[-140%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] transition-all duration-[1400ms] group-hover:left-[140%] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 px-6 pt-6 pb-2 text-center">
            <h1 className="inline-block text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <div className="relative z-10 px-6 pb-6">
            {error && (
              <div className="mb-4">
                <ErrorDisplay ErrorMessage={error.message} />
              </div>
            )}

            {debugStatus && (
              <div className="mb-4 rounded-xl border border-cyan-200/50 bg-white/30 px-4 py-2 text-xs text-slate-700">
                {debugStatus}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Email
                </label>

                <div
                  className={`flex items-center gap-3 bg-white/18 border rounded-2xl px-4 py-3 backdrop-blur-2xl transition-all duration-300 ${
                    fieldErrors.email
                      ? "border-red-400/60 bg-red-50/10"
                      : "border-white/30 focus-within:border-cyan-300/60 focus-within:bg-white/25"
                  }`}
                >
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    mail
                  </span>

                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-transparent w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      error
                    </span>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Password
                </label>

                <div
                  className={`flex items-center gap-3 bg-white/18 border rounded-2xl px-4 py-3 backdrop-blur-2xl transition-all duration-300 ${
                    fieldErrors.password
                      ? "border-red-400/60 bg-red-50/10"
                      : "border-white/30 focus-within:border-cyan-300/60 focus-within:bg-white/25"
                  }`}
                >
                  <span className="material-symbols-outlined text-slate-500 text-[20px]">
                    lock
                  </span>

                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-transparent w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      error
                    </span>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="accent-cyan-500"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-cyan-700 hover:text-cyan-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Liquid Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative overflow-hidden w-full py-3 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 text-slate-800 font-semibold shadow-[0_8px_30px_rgba(255,255,255,0.18)] transition-all duration-300 hover:scale-[1.03] hover:bg-white/30 active:scale-[0.98]"
                >
                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10" />

                  {/* Shine */}
                  <div className="absolute top-0 left-[-130%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] transition-all duration-[1000ms] group-hover:left-[130%]" />

                  <span className="relative z-10">
                    {loading ? "Signing in..." : "Sign In"}
                  </span>
                </button>
              </div>

              {/* Login Error Display */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-400/50 bg-red-50/20 px-4 py-3 flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0 mt-0.5">
                    error
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-red-600 font-medium">
                      {error.message}
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      Please check your credentials and try again.
                    </p>
                  </div>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                Continue With
              </span>

              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Google",
                  icon: "G",
                  onClick: handleGoogleLogin,
                  disabled: loading,
                },
                {
                  label: "Microsoft",
                  icon: "M",
                  onClick: handleMicrosoftLogin,
                  disabled: loading,
                },
                {
                  label: "Apple",
                  icon: "A",
                  onClick: handleAppleLogin,
                  disabled: loading,
                },
              ].map((provider) => (
                <button
                  key={provider.label}
                  type="button"
                  aria-label={`Continue with ${provider.label}`}
                  title={`Continue with ${provider.label}`}
                  onClick={provider.onClick}
                  disabled={provider.disabled}
                  className="relative overflow-hidden bg-white/18 hover:bg-white/25 border border-white/30 rounded-2xl p-4 backdrop-blur-2xl transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5" />
                  <span className="relative z-10 text-sm font-bold text-slate-800">
                    {provider.icon}
                  </span>
                </button>
              ))}
              {/* <MicrosoftLoginButton/> */}
            </div>

            {/* Signup */}
            <p className="mt-8 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <button
                onClick={handleSignUpClick}
                className="text-cyan-700 hover:text-cyan-500 transition-colors font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
