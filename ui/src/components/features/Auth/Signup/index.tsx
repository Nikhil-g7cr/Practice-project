import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/reduxHooks";
import { login } from "../../../../redux/features/auth/AuthenticationSlice";
import DynamicForm, { type FormField } from "../../../../common/DynamicForm";

const BRAND_NAME = "Stuff SYSTEM";

interface SignupError {
  field?: string;
  message: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SignupError | null>(null);

  // --- NEW: Define the fields for the DynamicForm ---
  const signupFields: FormField[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 50,
      placeholder: "Jane Doe",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "jane@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      minLength: 8,
      placeholder: "••••••••",
    },
    {
      name: "terms",
      label: "Accept Terms of Service & Privacy Policy",
      type: "checkbox",
      required: true,
    },
  ];

  // --- NEW: Handle the validated data payload directly ---
  const handleFormSubmit = async (formData: Record<string, any>) => {
    setError(null);

    // Manual check for terms checkbox since it's a boolean value
    if (!formData.terms) {
      setError({
        message: "You must agree to the Terms of Service and Privacy Policy",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        credentials: "include",
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

      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
        // sessionStorage.setItem("user", JSON.stringify(data.user));

        dispatch(
          login({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken, // Passing the refresh token to the slice too!
          }),
        );

        navigate("/");
      }
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

  return (
    <div
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-[url('/login.png')]
      bg-cover
      bg-center
      bg-no-repeat
      antialiased
      flex
      flex-col
      selection:bg-cyan-200
      selection:text-slate-900
    "
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Playful Liquid Background */}
      <div className="absolute top-[-150px] left-[-100px] w-[420px] h-[420px] bg-cyan-300/25 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[420px] h-[420px] bg-purple-300/25 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[45%] left-[50%] w-[300px] h-[300px] bg-pink-200/20 rounded-full blur-3xl" />

      {/* Global Blur */}
      <div className="absolute inset-0 backdrop-blur-[12px]" />

      {/* Main Canvas */}
      <main
        className="
        relative
        z-10
        flex-grow
        pt-24
        pb-8
        md:pt-32
        flex
        items-center
        justify-center
        px-4
        md:px-16
      "
      >
        {/* MAIN LIQUID CARD */}
        <div
          className="
          group
          relative
          max-w-5xl
          w-full
          grid
          grid-cols-1
          md:grid-cols-2
          overflow-hidden
          rounded-[2.5rem]
          bg-white/10
          backdrop-blur-[35px]
          border
          border-white/25
          before:absolute
          before:inset-0
          before:rounded-[2.5rem]
          before:p-[1.2px]
          before:bg-gradient-to-br
          before:from-white/70
          before:via-white/10
          before:to-cyan-200/30
          before:pointer-events-none
          after:absolute
          after:inset-[1px]
          after:rounded-[2.4rem]
          after:bg-white/[0.03]
          after:backdrop-blur-[45px]
          after:pointer-events-none
          shadow-[0_20px_80px_rgba(255,255,255,0.08)]
        "
        >
          {/* Reflection Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />

          {/* Top Reflection */}
          <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />

          {/* Animated Shine */}
          <div className="absolute top-0 left-[-140%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] transition-all duration-[1400ms] group-hover:left-[140%] pointer-events-none" />

          {/* LEFT SIDE (Form) */}
          <div className="relative z-10 p-6 md:p-10 flex flex-col justify-center">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-headline text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-400 bg-clip-text text-transparent">
                Create Account
              </h1>

              <p className="text-sm md:text-base text-slate-600">
                Join {BRAND_NAME} to access exclusive professional-grade electronics.
              </p>
            </div>

            {/* --- REPLACED: DynamicForm takes over inputs & validation --- */}
            <div className="mt-4">
              <DynamicForm
                fields={signupFields}
                onSubmit={handleFormSubmit}
                submitButtonText={loading ? "Creating Account..." : "Create Account"}
              />
            </div>

            {/* Signup Error Display */}
            {error && error.message && (
              <div className="mt-6 rounded-xl border border-red-400/50 bg-red-50/20 px-4 py-3 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0 mt-0.5">
                  error
                </span>
                <div className="flex-1">
                  <p className="text-sm text-red-600 font-medium">
                    {error.message}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Please check your information and try again.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE (Info) */}
          <div className="hidden md:flex flex-col relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                alt="Abstract technology background"
                className="w-full h-full object-cover opacity-40"
                src="/login.png"
              />
              {/* Blur Overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-between p-8 lg:p-10">
              <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 p-6">
                {/* Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-white/5" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Precision Engineered for Professionals
                  </h2>

                  <ul className="space-y-4 mt-5">
                    {[
                      {
                        icon: "local_shipping",
                        title: "Priority Shipping",
                        text: "Get your gear faster with expedited order processing.",
                      },
                      {
                        icon: "verified",
                        title: "Extended Warranty",
                        text: "Automatic 2-year warranty on premium components.",
                      },
                      {
                        icon: "support_agent",
                        title: "Dedicated Support",
                        text: "Direct access to our engineering support team.",
                      },
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-white/20 border border-white/20 p-2 rounded-xl backdrop-blur-xl">
                          <span className="material-symbols-outlined text-cyan-700 text-[20px]">
                            {item.icon}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base text-slate-800 font-semibold">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {item.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-700 text-[18px]">
                    eco
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-600">
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