import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
import { useAppDispatch } from "../../../../redux/hooks/reduxHooks";
import { login } from "../../../../redux/features/auth/AuthenticationSlice";
import { environment } from "../../../../environment/environment";
import ErrorDisplay from "../../../errors/errorDisplay";
import { loginRequest } from "../../../../config/ms.config";
import { useMsal } from "@azure/msal-react";
import DynamicForm, { type FormField } from "../../../../common/DynamicForm";

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

  const [loading, setLoading] = useState(false);
  const [debugStatus, setDebugStatus] = useState("");
  const [error, setError] = useState<LoginError | null>(null);

  const { instance } = useMsal();
  
  useEffect(() => {
    const processMicrosoftLogin = async () => {
      try {
        const response = await instance.handleRedirectPromise();

        if (!response) return;

        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: response.account,
        });

        const backendResponse = await fetch(
          `${environment.APP_API_URL}/auth/microsoft`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              accessToken: tokenResponse.accessToken,
            }),
          },
        );

        if (!backendResponse.ok) {
          throw new Error("Backend Microsoft login failed");
        }

        const data = await backendResponse.json();

        const apiAccessToken = data.accessToken || data.token;

        await completeLogin(data.user, apiAccessToken);
      } catch (error) {
        console.error("Microsoft redirect login error", error);
      }
    };

    processMicrosoftLogin();
  }, [instance]);

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

  // --- NEW: Define the fields for the DynamicForm ---
  const loginFields: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "name@company.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      minLength: 6,
      placeholder: "••••••••",
    },
    {
      name: "rememberMe",
      label: "Remember me",
      type: "checkbox",
    },
  ];

  // --- NEW: Handle the validated data payload directly ---
  const handleFormSubmit = async (formData: Record<string, any>) => {
    setError(null);
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

  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error(err);
      setError({
        message:
          err instanceof Error
            ? err.message
            : "Microsoft authentication failed",
      });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute top-[-150px] left-[-120px] w-[420px] h-[420px] bg-cyan-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] left-[50%] w-[260px] h-[260px] bg-pink-200/20 rounded-full blur-3xl" />

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="mt-20 group relative w-full max-w-[460px] overflow-hidden rounded-[2.5rem] bg-white/12 backdrop-blur-[35px] border border-white/30 shadow-[0_20px_80px_rgba(255,255,255,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 px-6 pt-6 pb-2 text-center">
            <h1 className="inline-block text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Sign in to continue your journey
            </p>
          </div>

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

            {/* --- REPLACED: DynamicForm takes over inputs & validation --- */}
            <DynamicForm 
              fields={loginFields} 
              onSubmit={handleFormSubmit} 
              submitButtonText={loading ? "Signing in..." : "Sign In"} 
            />

            {/* Forgot Password Link moved outside the form */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-cyan-700 hover:text-cyan-900 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>

            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                Continue With
              </span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Google", icon: "G", onClick: handleGoogleLogin, disabled: loading },
                { label: "Microsoft", icon: "M", onClick: handleMicrosoftLogin, disabled: loading },
                { label: "Apple", icon: "A", onClick: handleAppleLogin, disabled: loading },
              ].map((provider) => (
                <button
                  key={provider.label}
                  type="button"
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
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <button
                onClick={handleSignUpClick}
                className="text-cyan-700 hover:text-cyan-900 transition-colors font-medium"
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