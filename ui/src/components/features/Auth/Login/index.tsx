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
import { GlassButton } from "../../../../styles/liquidUI";

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      setError({
        field: "email",
        message: "Email is required",
      });

      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError({
        field: "email",
        message: "Please enter a valid email",
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
      const response = await fetch("http://localhost:3000/api/auth/login", {
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
    console.log("Google login clicked");
  };

  const handleAppleLogin = () => {
    console.log("Apple login clicked");
  };

  const getMicrosoftAuthPayload = async (
    authResult: AuthenticationResult,
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
        },
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
    <div
      className="
      relative
      min-h-screen
      overflow-hidden
      w-full

      /* Background Image */
      bg-[url('/login.png')]
      bg-cover
      bg-center
      bg-no-repeat
    "
    >
      {/* Dark Overlay For Contrast */}
      <div
        className="
        absolute
        inset-0
        bg-black/10
      "
      />

      {/* Playful Glow Background */}
      <div
        className="
        absolute
        top-[-150px]
        left-[-120px]
        w-[420px]
        h-[420px]
        bg-cyan-300/30
        rounded-full
        blur-3xl
        animate-pulse
      "
      />

      <div
        className="
        absolute
        bottom-[-120px]
        right-[-100px]
        w-[400px]
        h-[400px]
        bg-purple-300/30
        rounded-full
        blur-3xl
        animate-pulse
      "
      />

      <div
        className="
        absolute
        top-[40%]
        left-[50%]
        w-[260px]
        h-[260px]
        bg-pink-200/20
        rounded-full
        blur-3xl
      "
      />

      {/* Global Blur Layer */}
      {/* <div
        className="
        absolute
        inset-0
        backdrop-blur-[12px]
      "
      /> */}

      {/* Main Content */}
      <main
        className="
        relative
        z-10
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        py-10
      "
      >
        {/* LIQUID GLASS CARD */}
        <div
          className="
          group
          relative
          w-[600px]
          overflow-hidden
          rounded-[2.5rem]

          /* Liquid Glass */
          bg-white/12
          backdrop-blur-[35px]

          /* Refraction Border */
          border
          border-white/30

          /* Edge Lighting */
          before:absolute
          before:inset-0
          before:rounded-[2.5rem]
          before:p-[1.2px]
          before:bg-gradient-to-br
          before:from-white/70
          before:via-white/10
          before:to-cyan-200/30
          before:pointer-events-none

          /* Inner Refraction */
          after:absolute
          after:inset-[1px]
          after:rounded-[2.4rem]
          after:bg-white/[0.03]
          after:backdrop-blur-[50px]
          after:pointer-events-none

          shadow-[0_20px_80px_rgba(255,255,255,0.08)]
        "
        >
          {/* Reflection Layer */}
          <div
            className="
            absolute
            inset-0
            bg-gradient-to-br
            from-white/30
            via-transparent
            to-white/5
            pointer-events-none
          "
          />

          {/* Top Reflection */}
          <div
            className="
            absolute
            top-0
            left-0
            w-full
            h-[35%]
            bg-gradient-to-b
            from-white/25
            via-white/5
            to-transparent
            pointer-events-none
          "
          />

          {/* Cyan Glow */}
          <div
            className="
            absolute
            -top-16
            -left-16
            w-48
            h-48
            bg-cyan-200/25
            rounded-full
            blur-3xl
          "
          />

          {/* Purple Glow */}
          <div
            className="
            absolute
            bottom-[-70px]
            right-[-40px]
            w-40
            h-40
            bg-purple-200/20
            rounded-full
            blur-3xl
          "
          />

          {/* Animated Shine */}
          <div
            className="
            absolute
            top-0
            left-[-140%]
            w-[70%]
            h-full
            bg-gradient-to-r
            from-transparent
            via-white/30
            to-transparent
            skew-x-[-20deg]
            transition-all
            duration-[1400ms]
            group-hover:left-[140%]
            pointer-events-none
          "
          />

          {/* Header */}
          <div className="relative z-10 px-10 pt-10 pb-4 text-center">
            <h1
              className="
              inline-block
              text-4xl
              font-bold
              tracking-tight
              bg-gradient-to-r
              from-slate-900
              via-slate-700
              to-slate-400
              bg-clip-text
              text-transparent
            "
            >
              Welcome Back
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <div className="relative z-10 px-10 pb-10">
            {error && (
              <div className="mb-4">
                <ErrorDisplay ErrorMessage={error.message} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Email
                </label>

                <div
                  className="
                  flex
                  items-center
                  gap-3

                  bg-white/18
                  border
                  border-white/30

                  rounded-2xl
                  px-4
                  py-4

                  backdrop-blur-2xl

                  focus-within:border-cyan-300/60
                  focus-within:bg-white/25

                  transition-all
                  duration-300
                "
                >
                  <span
                    className="
                    material-symbols-outlined
                    text-slate-500
                    text-[20px]
                  "
                  >
                    mail
                  </span>

                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="
                    bg-transparent
                    w-full
                    text-sm
                    text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                  "
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Password
                </label>

                <div
                  className="
                  flex
                  items-center
                  gap-3

                  bg-white/18
                  border
                  border-white/30

                  rounded-2xl
                  px-4
                  py-4

                  backdrop-blur-2xl

                  focus-within:border-cyan-300/60
                  focus-within:bg-white/25

                  transition-all
                  duration-300
                "
                >
                  <span
                    className="
                    material-symbols-outlined
                    text-slate-500
                    text-[20px]
                  "
                  >
                    lock
                  </span>

                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="
                    bg-transparent
                    w-full
                    text-sm
                    text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                  "
                  />
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label
                  className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-600
                "
                >
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
                  className="
                  text-sm
                  text-cyan-700
                  hover:text-cyan-500
                  transition-colors
                "
                >
                  Forgot password?
                </button>
              </div>

              {/* Liquid Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                  group
                  relative
                  overflow-hidden

                  w-80
                  py-4

                  rounded-2xl

                  bg-white/20
                  backdrop-blur-2xl

                  border
                  border-white/30

                  text-slate-800
                  font-semibold

                  shadow-[0_8px_30px_rgba(255,255,255,0.18)]

                  transition-all
                  duration-300

                  hover:scale-[1.03]
                  hover:bg-white/30

                  active:scale-[0.98]
                "
                >
                  {/* Reflection */}
                  <div
                    className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-white/40
                    via-transparent
                    to-white/10
                  "
                  />

                  {/* Shine */}
                  <div
                    className="
                    absolute
                    top-0
                    left-[-130%]
                    w-[70%]
                    h-full
                    bg-gradient-to-r
                    from-transparent
                    via-white/40
                    to-transparent
                    skew-x-[-20deg]
                    transition-all
                    duration-[1000ms]
                    group-hover:left-[130%]
                  "
                  />

                  <span className="relative z-10">
                    {loading ? "Signing in..." : "Sign In"}
                  </span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-white/20"></div>

              <span
                className="
                text-xs
                text-slate-500
                uppercase
                tracking-wider
              "
              >
                Continue With
              </span>

              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-4">
              {/* Social Button */}
              {[1, 2, 3].map((_, i) => (
                <button
                  key={i}
                  className="
                  relative
                  overflow-hidden

                  bg-white/18
                  hover:bg-white/25

                  border
                  border-white/30

                  rounded-2xl
                  p-4

                  backdrop-blur-2xl

                  transition-all
                  duration-300

                  hover:scale-105
                "
                >
                  <div
                    className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-white/30
                    via-transparent
                    to-white/5
                  "
                  />
                </button>
              ))}
            </div>

            {/* Signup */}
            <p
              className="
              mt-8
              text-center
              text-sm
              text-slate-600
            "
            >
              Don’t have an account?{" "}
              <button
                onClick={handleSignUpClick}
                className="
                text-cyan-700
                hover:text-cyan-500
                transition-colors
                font-medium
              "
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
