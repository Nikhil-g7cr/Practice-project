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

      {/* Main Canvas */}
      <main
        className="
        relative
        z-10
        flex-grow
        pt-24
        pb-20
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
          max-w-6xl
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

          {/* LEFT SIDE */}
          <div
            className="
            relative
            z-10
            p-8
            md:p-16
            flex
            flex-col
            justify-center
          "
          >
            {/* Header */}
            <div className="mb-10">
              <h1
                className="
                font-headline
                text-3xl
                md:text-4xl
                font-bold
                mb-3

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
                text-base
                text-slate-600
              "
              >
                Join {BRAND_NAME} to access exclusive professional-grade
                electronics.
              </p>
            </div>

            {/* Error */}
            {error && <ErrorDisplay ErrorMessage={error.message} />}

            {/* FORM */}
            <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
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
                  mb-2
                "
                  htmlFor="name"
                >
                  Full Name
                </label>

                <div
                  className="
                  relative
                  overflow-hidden

                  rounded-2xl

                  bg-white/15
                  backdrop-blur-2xl

                  border
                  border-white/25

                  transition-all
                  duration-300

                  focus-within:border-cyan-300/60
                  focus-within:bg-white/20
                "
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
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                  >
                    person
                  </span>

                  <input
                    className="
                    relative
                    z-10
                    w-full
                    pl-12
                    pr-4
                    py-4

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
                  mb-2
                "
                  htmlFor="email"
                >
                  Email Address
                </label>

                <div
                  className="
                  relative
                  overflow-hidden
                  rounded-2xl

                  bg-white/15
                  backdrop-blur-2xl

                  border
                  border-white/25

                  transition-all
                  duration-300

                  focus-within:border-cyan-300/60
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

                  <span
                    className="
                    material-symbols-outlined
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                  >
                    mail
                  </span>

                  <input
                    className="
                    relative
                    z-10
                    w-full
                    pl-12
                    pr-4
                    py-4

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
                  mb-2
                "
                  htmlFor="password"
                >
                  Password
                </label>

                <div
                  className="
                  relative
                  overflow-hidden
                  rounded-2xl

                  bg-white/15
                  backdrop-blur-2xl

                  border
                  border-white/25

                  transition-all
                  duration-300

                  focus-within:border-cyan-300/60
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

                  <span
                    className="
                    material-symbols-outlined
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                  >
                    lock
                  </span>

                  <input
                    className="
                    relative
                    z-10
                    w-full
                    pl-12
                    pr-4
                    py-4

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

                <p
                  className="
                  text-sm
                  text-slate-500
                  mt-2
                "
                >
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start mt-4">
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

                <div className="ml-3">
                  <label
                    className="
                    text-sm
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
                py-4
                mt-8

                rounded-2xl

                bg-white/18
                backdrop-blur-2xl

                border
                border-white/30

                text-slate-800
                font-semibold
                text-lg

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
            </form>
          </div>

          {/* RIGHT SIDE */}
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
              p-16
            "
            >
              <div
                className="
                relative
                overflow-hidden

                rounded-[2rem]

                bg-white/10
                backdrop-blur-2xl

                border
                border-white/20

                p-8
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
                    text-3xl
                    font-bold
                    text-slate-800
                  "
                  >
                    Precision Engineered for Professionals
                  </h2>

                  <ul className="space-y-6 mt-8">
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
                        gap-4
                      "
                      >
                        <div
                          className="
                          bg-white/20
                          border
                          border-white/20
                          p-3
                          rounded-2xl
                          backdrop-blur-xl
                        "
                        >
                          <span
                            className="
                            material-symbols-outlined
                            text-cyan-700
                          "
                          >
                            {item.icon}
                          </span>
                        </div>

                        <div>
                          <h3
                            className="
                            text-lg
                            text-slate-800
                            font-semibold
                          "
                          >
                            {item.title}
                          </h3>

                          <p
                            className="
                            text-sm
                            text-slate-600
                            mt-1
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
              <div className="mt-auto">
                <div className="flex items-center gap-3">
                  <span
                    className="
                    material-symbols-outlined
                    text-cyan-700
                  "
                  >
                    eco
                  </span>

                  <span
                    className="
                    text-xs
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
