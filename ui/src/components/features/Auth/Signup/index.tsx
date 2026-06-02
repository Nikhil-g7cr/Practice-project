import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../redux/hooks/reduxHooks";
import { login } from "../../../../redux/features/auth/AuthenticationSlice";

const BRAND_NAME = "Stuff SYSTEM";

// const ErrorDisplay = ({ ErrorMessage }: { ErrorMessage: string }) => (
//   <div className="bg-red-500/10 border border-red-500/50 text-red-700 text-sm p-3 rounded-xl backdrop-blur-md">
//     {ErrorMessage}
//   </div>
// );

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

interface SignupErrors {
  name?: string;
  email?: string;
  password?: string;
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
  const [fieldErrors, setFieldErrors] = useState<SignupErrors>({});
  const [error, setError] = useState<SignupError | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    // Clear form submission error when user starts typing
    setError(null);

    // Real-time validation
    const errors: SignupErrors = { ...fieldErrors };

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
      } else if (value.length < 8) {
        errors.password = "Password must be at least 8 characters";
      } else {
        delete errors.password;
      }
    }

    setFieldErrors(errors);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: SignupErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      errors.name = "Name can only contain letters and spaces";
    }

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
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
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


  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
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

      if (data.accessToken && data.user) {
        // 1. Save to sessionStorage (matching your slice's logic)
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // 2. Dispatch your Redux action to instantly log them in
        dispatch(login({
          user: data.user,
          token: data.accessToken
        }));

        // 3. Clear errors and redirect
        setFieldErrors({});
        navigate("/"); // or "/" or wherever your logged-in users go
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

  const handleLoginClick = () => {
    navigate("/login");
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
      <div
        className="
        absolute
        inset-0
        bg-black/10
      "
      />

      {/* Playful Liquid Background */}
      <div
        className="
        absolute
        top-[-150px]
        left-[-100px]
        w-[420px]
        h-[420px]
        bg-cyan-300/25
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
        w-[420px]
        h-[420px]
        bg-purple-300/25
        rounded-full
        blur-3xl
        animate-pulse
      "
      />

      <div
        className="
        absolute
        top-[45%]
        left-[50%]
        w-[300px]
        h-[300px]
        bg-pink-200/20
        rounded-full
        blur-3xl
      "
      />

      {/* Global Blur */}
      <div
        className="
        absolute
        inset-0
        backdrop-blur-[12px]
      "
      />

      {/* Main Canvas - Kept top padding as requested, reduced bottom padding */}
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

          /* Liquid Glass */
          bg-white/10
          backdrop-blur-[35px]

          /* Refraction Border */
          border
          border-white/25

          /* Light Bending */
          before:absolute
          before:inset-0
          before:rounded-[2.5rem]
          before:p-[1.2px]
          before:bg-gradient-to-br
          before:from-white/70
          before:via-white/10
          before:to-cyan-200/30
          before:pointer-events-none

          /* Inner Diffusion */
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
            from-white/20
            via-white/5
            to-transparent
            pointer-events-none
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
            via-white/25
            to-transparent
            skew-x-[-20deg]
            transition-all
            duration-[1400ms]
            group-hover:left-[140%]
            pointer-events-none
          "
          />

          {/* LEFT SIDE (Form) */}
          <div
            className="
            relative
            z-10
            p-6
            md:p-10
            flex
            flex-col
            justify-center
          "
          >
            {/* Header */}
            <div className="mb-6">
              <h1
                className="
                font-headline
                text-2xl
                md:text-3xl
                font-bold
                mb-2

                bg-gradient-to-r
                from-slate-900
                via-slate-700
                to-slate-400
                bg-clip-text
                text-transparent
              "
              >
                Create Account
              </h1>

              <p
                className="
                text-sm
                md:text-base
                text-slate-600
              "
              >
                Join {BRAND_NAME} to access exclusive professional-grade
                electronics.
              </p>
            </div>

            {/* Error */}
            {/* Errors are now displayed at the field level and below the submit button */}

            {/* FORM */}
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label
                  className="
                  block
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-slate-600
                  mb-1.5
                "
                  htmlFor="name"
                >
                  Full Name
                </label>

                <div
                  className={`
                  relative
                  overflow-hidden
                  rounded-xl
                  bg-white/15
                  backdrop-blur-2xl
                  border
                  transition-all
                  duration-300
                  ${
                    fieldErrors.name
                      ? "border-red-400/60 bg-red-50/10"
                      : "border-white/25 focus-within:border-cyan-300/60 focus-within:bg-white/20"
                  }
                `}
                >
                  {/* Reflection */}
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

                  <span
                    className="
                    material-symbols-outlined
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    text-[20px]
                  "
                  >
                    person
                  </span>

                  <input
                    className="
                    relative
                    z-10
                    w-full
                    pl-11
                    pr-4
                    py-3
                    bg-transparent
                    text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                  "
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      error
                    </span>
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="
                  block
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-slate-600
                  mb-1.5
                "
                  htmlFor="email"
                >
                  Email Address
                </label>

                <div
                  className={`
                  relative
                  overflow-hidden
                  rounded-xl
                  bg-white/15
                  backdrop-blur-2xl
                  border
                  transition-all
                  duration-300
                  ${
                    fieldErrors.email
                      ? "border-red-400/60 bg-red-50/10"
                      : "border-white/25 focus-within:border-cyan-300/60"
                  }
                `}
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

                  <span
                    className="
                    material-symbols-outlined
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    text-[20px]
                  "
                  >
                    mail
                  </span>

                  <input
                    className="
                    relative
                    z-10
                    w-full
                    pl-11
                    pr-4
                    py-3
                    bg-transparent
                    text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                  "
                    id="email"
                    name="email"
                    placeholder="jane@example.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                <label
                  className="
                  block
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-slate-600
                  mb-1.5
                "
                  htmlFor="password"
                >
                  Password
                </label>

                <div
                  className={`
                  relative
                  overflow-hidden
                  rounded-xl
                  bg-white/15
                  backdrop-blur-2xl
                  border
                  transition-all
                  duration-300
                  ${
                    fieldErrors.password
                      ? "border-red-400/60 bg-red-50/10"
                      : "border-white/25 focus-within:border-cyan-300/60"
                  }
                `}
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

                  <span
                    className="
                    material-symbols-outlined
                    absolute
                    left-3.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    text-[20px]
                  "
                  >
                    lock
                  </span>

                  <input
                    className="
                    relative
                    z-10
                    w-full
                    pl-11
                    pr-4
                    py-3
                    bg-transparent
                    text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                  "
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
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">
                      error
                    </span>
                    {fieldErrors.password}
                  </p>
                )}
                {!fieldErrors.password && (
                  <p
                    className="
                    text-xs
                    text-slate-500
                    mt-1.5
                  "
                  >
                    Must be at least 8 characters long.
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start mt-3">
                <div className="flex items-center h-5">
                  <input
                    className="
                    w-4
                    h-4
                    rounded
                    accent-cyan-500
                    bg-white/20
                  "
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                </div>

                <div className="ml-2.5">
                  <label
                    className="
                    text-xs
                    text-slate-600
                  "
                    htmlFor="terms"
                  >
                    I agree to the{" "}
                    <a
                      className="
                      text-cyan-700
                      font-semibold
                      hover:underline
                    "
                      href="#terms"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      className="
                      text-cyan-700
                      font-semibold
                      hover:underline
                    "
                      href="#privacy"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
              </div>

              {/* Liquid Button */}
              <button
                className="
                group
                relative
                overflow-hidden
                w-full
                py-3
                mt-6
                rounded-xl
                bg-white/18
                backdrop-blur-2xl
                border
                border-white/30
                text-slate-800
                font-semibold
                text-base
                shadow-[0_8px_30px_rgba(255,255,255,0.12)]
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:bg-white/25
                active:scale-[0.98]
              "
                type="submit"
                disabled={loading}
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
                  via-white/30
                  to-transparent
                  skew-x-[-20deg]
                  transition-all
                  duration-[1000ms]
                  group-hover:left-[130%]
                "
                />

                <span className="relative z-10">
                  {loading ? "Creating Account..." : "Create Account"}
                </span>
              </button>

              {/* Signup Error Display */}
              {error && error.message && (
                <div className="mt-4 rounded-xl border border-red-400/50 bg-red-50/20 px-4 py-3 flex items-start gap-3">
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
            </form>
          </div>

          {/* RIGHT SIDE (Info) */}
          <div
            className="
            hidden
            md:flex
            flex-col
            relative
            overflow-hidden
          "
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                alt="Abstract technology background"
                className="
                w-full
                h-full
                object-cover
                opacity-40
              "
                src="/login.png"
              />

              {/* Blur Overlay */}
              <div
                className="
                absolute
                inset-0
                bg-white/10
                backdrop-blur-[4px]
              "
              />
            </div>

            {/* Content */}
            <div
              className="
              relative
              z-10
              flex
              flex-col
              h-full
              justify-between
              p-8
              lg:p-10
            "
            >
              <div
                className="
                relative
                overflow-hidden
                rounded-2xl
                bg-white/10
                backdrop-blur-2xl
                border
                border-white/20
                p-6
              "
              >
                {/* Reflection */}
                <div
                  className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-white/25
                  via-transparent
                  to-white/5
                "
                />

                <div className="relative z-10">
                  <h2
                    className="
                    text-2xl
                    font-bold
                    text-slate-800
                  "
                  >
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
                      <li
                        key={index}
                        className="
                        flex
                        items-start
                        gap-3
                      "
                      >
                        <div
                          className="
                          bg-white/20
                          border
                          border-white/20
                          p-2
                          rounded-xl
                          backdrop-blur-xl
                        "
                        >
                          <span
                            className="
                            material-symbols-outlined
                            text-cyan-700
                            text-[20px]
                          "
                          >
                            {item.icon}
                          </span>
                        </div>

                        <div>
                          <h3
                            className="
                            text-base
                            text-slate-800
                            font-semibold
                          "
                          >
                            {item.title}
                          </h3>

                          <p
                            className="
                            text-xs
                            text-slate-600
                            mt-0.5
                          "
                          >
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
                  <span
                    className="
                    material-symbols-outlined
                    text-cyan-700
                    text-[18px]
                  "
                  >
                    eco
                  </span>

                  <span
                    className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-semibold
                    text-slate-600
                  "
                  >
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
