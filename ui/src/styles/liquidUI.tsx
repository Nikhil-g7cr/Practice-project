// ==============================
// Liquid Glass UI Components
// React + Tailwind CSS
// ==============================

// Install:
// npm install framer-motion

// =====================================================
// 1. LIQUID GLASS BUTTON
// =====================================================

import { motion } from "framer-motion";

interface GlassButtonProps {
  children: React.ReactNode;
}

export const GlassButton = ({
  children,
}: GlassButtonProps) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.03,
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
      className="
        relative
        overflow-hidden
        px-6
        py-3
        rounded-2xl
        bg-white/20
        backdrop-blur-xl
        border
        border-white/30
        text-slate-800
        font-semibold
        shadow-[0_8px_30px_rgba(255,255,255,0.15)]
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
          pointer-events-none
        "
      />

      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
};

// =====================================================
// 2. LIQUID GLASS NAVBAR
// =====================================================

export const GlassNavbar = () => {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4">

      <div
        className="
          max-w-6xl
          mx-auto
          flex
          items-center
          justify-between
          px-6
          py-3
          rounded-[2rem]
          bg-white/15
          backdrop-blur-3xl
          border
          border-white/20
          shadow-[0_8px_40px_rgba(255,255,255,0.1)]
        "
      >

        {/* Logo */}
        <h1
          className="
            text-2xl
            font-bold
            bg-gradient-to-r
            from-slate-900
            via-slate-700
            to-slate-500
            bg-clip-text
            text-transparent
          "
        >
          LiquidUI
        </h1>

        {/* Nav Links */}
        <div className="flex items-center gap-3">

          <GlassButton>
            Home
          </GlassButton>

          <GlassButton>
            Products
          </GlassButton>

          <GlassButton>
            Contact
          </GlassButton>
        </div>
      </div>
    </nav>
  );
};

// =====================================================
// 3. LIQUID GLASS SLIDER
// =====================================================

interface SliderProps {
  images: string[];
}

export const GlassSlider = ({
  images,
}: SliderProps) => {

  return (
    <div
      className="
        relative
        w-full
        h-[500px]
        overflow-hidden
        rounded-[3rem]
        bg-white/10
        backdrop-blur-3xl
        border
        border-white/20
        shadow-[0_10px_50px_rgba(255,255,255,0.12)]
      "
    >

      {/* Glow */}
      <div
        className="
          absolute
          top-0
          left-0
          w-72
          h-72
          bg-cyan-300/20
          rounded-full
          blur-3xl
        "
      />

      {/* Image */}
      <img
        src={images[0]}
        alt="slider"
        className="
          w-full
          h-full
          object-cover
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/20
          to-transparent
        "
      />
    </div>
  );
};

// =====================================================
// 4. LIQUID GLASS LOGIN
// =====================================================

export const GlassLogin = () => {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-100
        via-white
        to-slate-200
        relative
        overflow-hidden
      "
    >

      {/* Blur Background */}
      <div
        className="
          absolute
          top-[-100px]
          left-[-100px]
          w-[350px]
          h-[350px]
          bg-cyan-300/20
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-100px]
          right-[-100px]
          w-[350px]
          h-[350px]
          bg-purple-300/20
          rounded-full
          blur-3xl
        "
      />

      {/* Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          w-full
          max-w-md
          p-8
          rounded-[2rem]
          bg-white/25
          backdrop-blur-3xl
          border
          border-white/30
          shadow-[0_8px_40px_rgba(255,255,255,0.2)]
        "
      >

        {/* Reflection */}
        <div
          className="
            absolute
            inset-0
            rounded-[2rem]
            bg-gradient-to-br
            from-white/30
            via-transparent
            to-white/10
            pointer-events-none
          "
        />

        <h1
          className="
            text-3xl
            font-bold
            text-slate-800
            text-center
          "
        >
          Welcome Back
        </h1>

        <p
          className="
            text-slate-500
            text-center
            mt-2
          "
        >
          Sign in to continue
        </p>

        {/* Form */}
        <div className="mt-8 space-y-4">

          <input
            placeholder="Email"
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-white/20
              border
              border-white/30
              backdrop-blur-xl
              focus:outline-none
              text-slate-800
              placeholder:text-slate-400
            "
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-white/20
              border
              border-white/30
              backdrop-blur-xl
              focus:outline-none
              text-slate-800
              placeholder:text-slate-400
            "
          />

          <GlassButton>
            Sign In
          </GlassButton>
        </div>
      </motion.div>
    </div>
  );
};

// =====================================================
// 5. LIQUID GLASS SIGNUP
// =====================================================

export const GlassSignup = () => {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-100
        via-white
        to-slate-200
        relative
        overflow-hidden
      "
    >

      {/* Glass Card */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          w-full
          max-w-md
          p-8
          rounded-[2rem]
          bg-white/25
          backdrop-blur-3xl
          border
          border-white/30
          shadow-[0_8px_40px_rgba(255,255,255,0.2)]
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-slate-800
            text-center
          "
        >
          Create Account
        </h1>

        <div className="mt-8 space-y-4">

          <input
            placeholder="Name"
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-white/20
              border
              border-white/30
              backdrop-blur-xl
              focus:outline-none
            "
          />

          <input
            placeholder="Email"
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-white/20
              border
              border-white/30
              backdrop-blur-xl
              focus:outline-none
            "
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-white/20
              border
              border-white/30
              backdrop-blur-xl
              focus:outline-none
            "
          />

          <GlassButton>
            Create Account
          </GlassButton>
        </div>
      </motion.div>
    </div>
  );
};