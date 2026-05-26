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
import { BRAND_NAME } from "../../../../shared/shared-variables";
import ErrorDisplay from "../../../errors/errorDisplay";

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

const msalInitializePromise =
  msalInstance.initialize();

const Login = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<LoginFormData>({
      email: "",
      password: "",
      rememberMe: false,
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<LoginError | null>(null);

  const completeLogin = (
    user: AuthUser,
    token: string
  ) => {

    dispatch(login({ user, token }));

    sessionStorage.setItem(
      "accessToken",
      token
    );

    sessionStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    navigate("/");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const validateForm = (): boolean => {

    if (!formData.email.trim()) {

      setError({
        field: "email",
        message: "Email is required",
      });

      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(formData.email)
    ) {

      setError({
        field: "email",
        message:
          "Please enter a valid email",
      });

      return false;
    }

    if (!formData.password.trim()) {

      setError({
        field: "password",
        message: "Password is required",
      });

      return false;
    }

    if (formData.password.length < 6) {

      setError({
        field: "password",
        message:
          "Password must be at least 6 characters",
      });

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password:
              formData.password,
          }),
        }
      );

      if (!response.ok) {

        const data =
          await response.json();

        throw new Error(
          data.message ||
            "Login failed"
        );
      }

      const data =
        await response.json();

      completeLogin(
        data.user,
        data.accessToken
      );

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
    console.log(
      "Google login clicked"
    );
  };

  const handleAppleLogin = () => {
    console.log(
      "Apple login clicked"
    );
  };

  const getMicrosoftAuthPayload =
    async (
      authResult: AuthenticationResult
    ): Promise<AuthPayload> => {

      try {

        const backendResponse =
          await fetch(
            `${environment.APP_API_URL}/auth/microsoft`,
            {
              method: "POST",
              credentials:
                "include",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                accessToken:
                  authResult.accessToken,
                idToken:
                  authResult.idToken,
              }),
            }
          );

        if (backendResponse.ok) {

          const data =
            await backendResponse.json();

          if (
            data?.accessToken &&
            data?.user
          ) {

            return {
              user: data.user,
              token:
                data.accessToken,
            };
          }
        }

      } catch (error) {

        console.warn(
          "Microsoft backend exchange failed",
          error
        );
      }

      const account =
        authResult.account;

      if (!account) {

        throw new Error(
          "Microsoft did not return an account profile."
        );
      }

      return {
        token:
          authResult.accessToken ||
          authResult.idToken,

        user: {
          id: account.localAccountId,
          name:
            account.name ||
            account.username,
          email:
            account.username,
          role: "user",
        },
      };
    };

  const handleMicrosoftLogin =
    async () => {

      setError(null);
      setLoading(true);

      try {

        await msalInitializePromise;

        const loginRequest = {
          scopes: [
            "openid",
            "profile",
            "email",
            "User.Read",
          ],
        };

        const response =
          await msalInstance.loginPopup(
            loginRequest
          );

        msalInstance.setActiveAccount(
          response.account
        );

        const { user, token } =
          await getMicrosoftAuthPayload(
            response
          );

        completeLogin(user, token);

      } catch (err) {

        console.error(
          "Microsoft login failed",
          err
        );

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
    <div className="relative min-h-screen overflow-hidden w-full ">

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">

        {/* Glass Card */}
        <div className="w-150 border border-white/70 backdrop-blur-3xl rounded-[2rem] shadow-black shadow-[0_8px_40px_rgba(255,255,255,0.25)] overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">

            {/* <a
              href="/"
              className="inline-block text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400 bg-clip-text text-transparent"
            >
              {BRAND_NAME}
            </a> */}

            <h1 
              className="inline-block text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400 bg-clip-text text-transparent"
            >
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">

            {error && (
              <div className="mb-4">
                <ErrorDisplay
                  ErrorMessage={
                    error.message
                  }
                />
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="block text-sm text-slate-600 mb-2">
                  Email
                </label>

                <div className="flex items-center gap-3 bg-white/30 border border-white/40 rounded-2xl px-4 py-3 backdrop-blur-xl focus-within:border-cyan-400/50 transition-all duration-300">

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
              </div>

              {/* Password */}
              <div>

                <label className="block text-sm text-slate-600 mb-2">
                  Password
                </label>

                <div className="flex items-center gap-3 bg-white/30 border border-white/40 rounded-2xl px-4 py-3 backdrop-blur-xl focus-within:border-cyan-400/50 transition-all duration-300">

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
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 text-sm text-slate-500">

                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={
                      formData.rememberMe
                    }
                    onChange={handleChange}
                    className="accent-cyan-500"
                  />

                  Remember me
                </label>

                <button
                  type="button"
                  onClick={
                    handleForgotPassword
                  }
                  className="text-sm text-cyan-600 hover:text-cyan-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <div className="flex justify-center">

              <button
                type="submit"
                disabled={loading}
                className="w-80 bg-gray-100 hover:bg-white/60 border border-white/50 backdrop-blur-xl rounded-2xl py-3 text-sm font-semibold text-slate-800 transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
                  </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-8">

              <div className="flex-1 h-px bg-white/30"></div>

              <span className="text-xs text-slate-500 uppercase tracking-wider">
                Continue With
              </span>

              <div className="flex-1 h-px bg-white/30"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-3">

              {/* Google */}
              <button
                onClick={
                  handleGoogleLogin
                }
                className="bg-white/30 hover:bg-white/50 border border-white/40 rounded-2xl p-3 backdrop-blur-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQz_QywYHMSMdToW6wEfnbabwgTPF6PRsdLrdqXc9Lm2sh9jEpT4BuKIt3rgwq6VnaH0_DmJmDfir8TEoaLuKoSBpwXIHz_-G2HeG2AezpRPtBuSgceppZdwIgElAMD6x74inRmESsH6Qro0GLiNarCgKJPpQPPPaSD0MX-PcH1hQF1LOE-M1-qlyEnxE1xetGaGKKSqV0izHYXQ0wZtYMztbkITZ6CUuXo2tFSxvAR8tmBUj9qzpWeyszWGF3x8jNDSBzDXi9xown"
                  alt="Google"
                  className="w-5 h-5"
                />
              </button>

              {/* Apple */}
              <button
                onClick={
                  handleAppleLogin
                }
                className="bg-white/30 hover:bg-white/50 border border-white/40 rounded-2xl p-3 backdrop-blur-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk10T-otNfhAH-WaOO6PmyjrNhCtGa3D6J-C0WAB9O3N9zyJOrrPa25erm4zeCLXK8QsGPwLVDMyT2ljjiWJM2aj4zOGGXj22_-DAg9bgSJiqgPAi_zjvwRxGgvekEW2DubSJQyb1z_-8DcOAwZ7_t_qFesxVnC9-8goPVlMyehfHobxWtAWtqFv4Wdl534VfyJW_juG-EvS-VYRRAU9qQjL88ZTq7LvehqvkTy8Dz27Q9OVYw8Y1VdwaCmWTMw-4mDp_NbWFfuM4i"
                  alt="Apple"
                  className="w-5 h-5"
                />
              </button>

              {/* Microsoft */}
              <button
                onClick={
                  handleMicrosoftLogin
                }
                disabled={loading}
                className="bg-white/30 hover:bg-white/50 border border-white/40 rounded-2xl p-3 backdrop-blur-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft"
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Signup */}
            <p className="mt-8 text-center text-sm text-slate-500">

              Don’t have an account?{" "}

              <button
                onClick={
                  handleSignUpClick
                }
                className="text-cyan-600 hover:text-cyan-500 transition-colors font-medium"
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