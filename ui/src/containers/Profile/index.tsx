import React, { useState } from "react";
import { useSelector } from "react-redux";
import Bg from  "../../../public/profileBg.png"

const Profile = () => {

  // User Data
  const { user } = useSelector(
    (state: any) => state.auth
  );

  // Delivery Details
  const [
    deliveryDetails,
    setDeliveryDetails,
  ] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Cart
  const [cartItems] = useState<any[]>(
    []
  );

  // Handle Input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } =
      e.target;

    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save Address
  const handleSaveAddress = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    console.log(
      "Saving delivery details:",
      deliveryDetails
    );

    alert(
      "Delivery details saved successfully!"
    );
  };

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        px-4
        py-32
      "
      style={{backgroundImage:`url(${Bg})`}}
    >

      {/* PLAYFUL LIQUID BACKGROUND */}

      {/* Glow Blob 1 */}
      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[420px]
          h-[420px]
          bg-cyan-300/30
          rounded-full
          blur-3xl
          animate-pulse
        "
      />

      {/* Glow Blob 2 */}
      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          w-[420px]
          h-[420px]
          bg-purple-300/30
          rounded-full
          blur-3xl
          animate-pulse
        "
      />

      {/* Glow Blob 3 */}
      <div
        className="
          absolute
          top-[40%]
          left-[45%]
          w-[300px]
          h-[300px]
          bg-pink-200/20
          rounded-full
          blur-3xl
        "
      />

      {/* Background Blur */}
      {/* <div
        className="
          absolute
          inset-0
          backdrop-blur-[90px]
        "
      /> */}

      {/* MAIN CONTENT */}
      <div
        className="
          relative
          z-10
          max-w-5xl
          mx-auto
          space-y-8
        "
      >

        {/* HEADER */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            bg-white/20
            backdrop-blur-3xl
            border
            border-white/30
            shadow-[0_10px_60px_rgba(255,255,255,0.12)]
            p-8
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

          {/* Glow */}
          <div
            className="
              absolute
              top-[-80px]
              right-[-80px]
              w-48
              h-48
              bg-cyan-200/30
              rounded-full
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-6
            "
          >

            {/* Avatar */}
            <div
              className="
                relative
                w-24
                h-24
                rounded-[2rem]
                bg-gradient-to-br
                from-cyan-200
                via-white
                to-purple-200
                flex
                items-center
                justify-center
                text-3xl
                font-bold
                text-slate-800
                border
                border-white/40
                shadow-[0_10px_40px_rgba(255,255,255,0.2)]
                overflow-hidden
              "
            >

              {/* Reflection */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-white/60
                  via-transparent
                  to-transparent
                "
              />

              <span className="relative z-10">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase()}
              </span>
            </div>

            {/* User Details */}
            <div className="relative z-10">

              <h1
                className="
                  text-4xl
                  font-bold
                  bg-gradient-to-r
                  from-slate-900
                  via-slate-700
                  to-slate-500
                  bg-clip-text
                  text-transparent
                "
              >
                {user?.name ||
                  "Guest User"}
              </h1>

              <p className="text-slate-500 mt-2">
                {user?.email ||
                  "No Email"}
              </p>

              {user?.role && (
                <div
                  className="
                    mt-4
                    inline-flex
                    px-4
                    py-2
                    rounded-full
                    bg-white/30
                    border
                    border-white/30
                    backdrop-blur-xl
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  {user.role}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DELIVERY SECTION */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            bg-white/18
            backdrop-blur-3xl
            border
            border-white/30
            shadow-[0_10px_60px_rgba(255,255,255,0.1)]
            p-8
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

          <div className="relative z-10">

            <h2
              className="
                text-2xl
                font-bold
                text-slate-800
                mb-6
              "
            >
              Delivery Information
            </h2>

            <form
              onSubmit={
                handleSaveAddress
              }
              className="space-y-5"
            >

              {/* Address */}
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={
                  deliveryDetails.address
                }
                onChange={
                  handleInputChange
                }
                className="
                  w-full
                  px-5
                  py-4
                  rounded-2xl
                  bg-white/25
                  border
                  border-white/30
                  backdrop-blur-xl
                  focus:outline-none
                  text-slate-800
                  placeholder:text-slate-400
                "
              />

              {/* City + State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={
                    deliveryDetails.city
                  }
                  onChange={
                    handleInputChange
                  }
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    bg-white/25
                    border
                    border-white/30
                    backdrop-blur-xl
                    focus:outline-none
                  "
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={
                    deliveryDetails.state
                  }
                  onChange={
                    handleInputChange
                  }
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    bg-white/25
                    border
                    border-white/30
                    backdrop-blur-xl
                    focus:outline-none
                  "
                />
              </div>

              {/* Zip + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={
                    deliveryDetails.zipCode
                  }
                  onChange={
                    handleInputChange
                  }
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    bg-white/25
                    border
                    border-white/30
                    backdrop-blur-xl
                    focus:outline-none
                  "
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={
                    deliveryDetails.phone
                  }
                  onChange={
                    handleInputChange
                  }
                  className="
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    bg-white/25
                    border
                    border-white/30
                    backdrop-blur-xl
                    focus:outline-none
                  "
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="
                  relative
                  overflow-hidden
                  px-8
                  py-4
                  rounded-2xl
                  bg-white/25
                  backdrop-blur-2xl
                  border
                  border-white/30
                  text-slate-800
                  font-semibold
                  shadow-[0_8px_30px_rgba(255,255,255,0.15)]
                  transition-all
                  duration-300
                  hover:scale-[1.03]
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

                <span className="relative z-10">
                  Save Delivery Details
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* CART SECTION */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            bg-white/18
            backdrop-blur-3xl
            border
            border-white/30
            shadow-[0_10px_60px_rgba(255,255,255,0.1)]
            p-8
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

          <div className="relative z-10">

            <h2
              className="
                text-2xl
                font-bold
                text-slate-800
                mb-6
              "
            >
              Current Cart Status
            </h2>

            {cartItems.length ===
            0 ? (

              <div
                className="
                  text-center
                  py-10
                  rounded-2xl
                  bg-white/20
                  border
                  border-white/20
                  backdrop-blur-xl
                "
              >

                <p className="text-lg text-slate-700 font-medium">
                  Your cart is currently empty.
                </p>

                <p className="text-slate-500 mt-2">
                  Browse products and
                  add something amazing.
                </p>
              </div>

            ) : (

              <ul className="space-y-4">

                {cartItems.map(
                  (item, index) => (
                    <li
                      key={index}
                      className="
                        p-5
                        rounded-2xl
                        bg-white/20
                        border
                        border-white/20
                        backdrop-blur-xl
                      "
                    >
                      {item.name} - $
                      {item.price}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;