import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { updatePhone } from "../../redux/features/phones/PhoneSlice";

const EditPhone = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const dispatch = useAppDispatch();

  const { phones } = useAppSelector((state) => state.phones);

  const phone = phones?.find((p: any) => p._id === id);

  const [name, setName] = useState(phone?.name || "");

  const [price, setPrice] = useState(phone?.basePrice || 0);

  const [image, setImage] = useState(phone?.thumbnail);

  useEffect(() => {
    if (phone) {
      setName(phone.name);

      setPrice(phone.basePrice);

      setImage(phone.thumbnail);
    }
  }, [phone]);

  const handleUpdate = async () => {
    if (!phone) return;

    await dispatch(
      updatePhone({
        id: phone._id,
        data: {
          name,
          basePrice: price,
          thumbnail: image,
        },
      }),
    );

    navigate(`/phone/${phone._id}`);
  };

  if (!phone) {
    return (
      <div
        className="
          min-h-screen
          flex
          justify-center
          items-center

          bg-[url('/phonebg.png')]
          bg-cover
          bg-center
          bg-fixed
        "
      >
        <div
          className="
            relative
            overflow-hidden

            px-8
            py-6

            rounded-[2rem]

            bg-white/10
            backdrop-blur-[30px]

            border
            border-white/20

            shadow-[0_20px_60px_rgba(255,255,255,0.08)]
          "
        >
          {/* Reflection */}
          <div
            className="
              absolute
              inset-0

              bg-gradient-to-br
              from-white/20
              via-transparent
              to-white/5
            "
          />

          <h1
            className="
              relative
              z-10

              text-xl
              font-semibold

              text-slate-800
            "
          >
            Loading phone data...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        overflow-hidden

        min-h-screen

        bg-[url('/updateSM2.png')]
        bg-cover
        bg-center
        bg-fixed

        px-4
        py-20
      "
    >
      {/* Global Blur */}
      {/* <div
        className="
          absolute
          inset-0

          backdrop-blur-[10px]

          bg-white/[0.03]
        "
      /> */}

      {/* Cyan Glow */}
      <div
        className="
          absolute
          top-[-120px]
          left-[-100px]

          w-[420px]
          h-[420px]

          bg-cyan-300/20

          rounded-full
          blur-3xl

          animate-pulse
        "
      />

      {/* Purple Glow */}
      <div
        className="
          absolute
          bottom-[-120px]
          right-[-100px]

          w-[420px]
          h-[420px]

          bg-purple-300/20

          rounded-full
          blur-3xl

          animate-pulse
        "
      />

      {/* Main Container */}
      <div
        className="
          relative
          z-10

          max-w-2xl
          mx-auto

          mt-20
        "
      >
        {/* Liquid Glass Card */}
        <div
          className="
            group
            relative
            overflow-hidden

            rounded-[2.5rem]

            bg-white/10
            backdrop-blur-[30px]

            border
            border-white/20

            before:absolute
            before:inset-0
            before:rounded-[2.5rem]
            before:p-[1px]
            before:bg-gradient-to-br
            before:from-white/60
            before:via-white/10
            before:to-cyan-200/20
            before:pointer-events-none

            after:absolute
            after:inset-[1px]
            after:rounded-[2.4rem]
            after:bg-white/[0.03]
            after:backdrop-blur-[50px]
            after:pointer-events-none

            shadow-[0_20px_60px_rgba(255,255,255,0.08)]
          "
        >
          {/* Reflection */}
          <div
            className="
              absolute
              inset-0

              bg-gradient-to-br
              from-white/20
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

          {/* Glow */}
          <div
            className="
              absolute
              -top-10
              -left-10

              w-40
              h-40

              bg-cyan-200/20

              rounded-full
              blur-3xl
            "
          />

          {/* Shine Animation */}
          <div
            className="
              absolute
              top-0
              left-[-140%]

              w-[70%]
              h-full

              bg-gradient-to-r
              from-transparent
              via-white/20
              to-transparent

              skew-x-[-20deg]

              transition-all
              duration-[1600ms]

              group-hover:left-[140%]

              pointer-events-none
            "
          />

          {/* CONTENT */}
          <div
            className="
              relative
              z-10

              p-8
              md:p-10
            "
          >
            {/* Title */}
            <div className="mb-8">
              <span
                className="
                  inline-flex
                  items-center

                  px-4
                  py-2

                  rounded-full

                  bg-white/10
                  backdrop-blur-2xl

                  border
                  border-white/20

                  text-cyan-700

                  text-xs
                  font-bold

                  tracking-widest
                  uppercase

                  mb-4
                "
              >
                Admin Panel
              </span>

              <h1
                className="
                  text-4xl
                  md:text-5xl

                  font-black

                  bg-gradient-to-r
                  from-slate-900
                  via-slate-700
                  to-slate-500

                  bg-clip-text
                  text-transparent
                "
              >
                Update Phone
              </h1>
            </div>

            {/* FORM */}
            <div className="space-y-6">
              {/* NAME */}
              <div>
                <label
                  className="
                    block

                    text-sm
                    font-semibold

                    text-slate-700

                    mb-3
                  "
                >
                  Phone Name
                </label>

                <div
                  className="
                    relative
                    overflow-hidden

                    rounded-2xl

                    bg-white/10
                    backdrop-blur-2xl

                    border
                    border-white/20

                    shadow-[0_8px_20px_rgba(255,255,255,0.05)]
                  "
                >
                  {/* Reflection */}
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-br
                      from-white/20
                      via-transparent
                      to-white/5
                    "
                  />

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                      relative
                      z-10

                      w-full

                      px-5
                      py-4

                      bg-transparent

                      text-slate-800
                      placeholder:text-slate-400

                      focus:outline-none
                    "
                    placeholder="Enter phone name"
                  />
                </div>
              </div>

              {/* PRICE */}
              <div>
                <label
                  className="
                    block

                    text-sm
                    font-semibold

                    text-slate-700

                    mb-3
                  "
                >
                  Base Price
                </label>

                <div
                  className="
                    relative
                    overflow-hidden

                    rounded-2xl

                    bg-white/10
                    backdrop-blur-2xl

                    border
                    border-white/20

                    shadow-[0_8px_20px_rgba(255,255,255,0.05)]
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-br
                      from-white/20
                      via-transparent
                      to-white/5
                    "
                  />

                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="
                      relative
                      z-10

                      w-full

                      px-5
                      py-4

                      bg-transparent

                      text-slate-800
                      placeholder:text-slate-400

                      focus:outline-none
                    "
                    placeholder="Enter phone price"
                  />
                </div>
              </div>

              {/* IMAGE */}
              <div>
                <label
                  className="
                    block

                    text-sm
                    font-semibold

                    text-slate-700

                    mb-3
                  "
                >
                  Thumbnail URL
                </label>

                <div
                  className="
                    relative
                    overflow-hidden

                    rounded-2xl

                    bg-white/10
                    backdrop-blur-2xl

                    border
                    border-white/20

                    shadow-[0_8px_20px_rgba(255,255,255,0.05)]
                  "
                >
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-br
                      from-white/20
                      via-transparent
                      to-white/5
                    "
                  />

                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="
                      relative
                      z-10

                      w-full

                      px-5
                      py-4

                      bg-transparent

                      text-slate-800
                      placeholder:text-slate-400

                      focus:outline-none
                    "
                    placeholder="Paste image URL"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleUpdate}
                className="
                  group
                  relative
                  overflow-hidden

                  w-full

                  py-4
                  mt-4

                  rounded-2xl

                  bg-white/12
                  backdrop-blur-2xl

                  border
                  border-white/20

                  text-slate-800
                  font-bold
                  text-lg

                  shadow-[0_10px_30px_rgba(255,255,255,0.08)]

                  transition-all
                  duration-300

                  hover:scale-[1.02]
                  hover:bg-white/15

                  active:scale-95
                "
              >
                {/* Reflection */}
                <div
                  className="
                    absolute
                    inset-0

                    bg-gradient-to-br
                    from-white/20
                    via-transparent
                    to-white/5
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
                    duration-[1200ms]

                    group-hover:left-[130%]
                  "
                />

                <span className="relative z-10">Update Phone</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPhone;
