import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Bg from "../../../public/profileBg.png";
import API from "../../config/axios.config";
import { login } from "../../redux/features/auth/AuthenticationSlice";
import Popup, {type PopupConfig} from "../../common/Popup";


const Profile = () => {
  const dispatch = useDispatch();
  
  // User Data from Redux
  const { user, token } = useSelector((state: any) => state.auth);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // --- POPUP STATE CONFIGURATION ---
  const [popupState, setPopupState] = useState<PopupConfig>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const closePopup = () => setPopupState((prev) => ({ ...prev, isOpen: false }));
  // ---------------------------------

  const [cartItems] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "", 
        password: "", 
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updateData: any = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      };
      if (profileForm.password.trim() !== "") {
        updateData.password = profileForm.password;
      }

      // 1. Await the response and use the correct /api/user path
      const currentUserId = user.id || user._id;
      const response = await API.patch(`/user/${currentUserId}`, updateData); 

      // 2. Extract the successfully updated user from your backend response
      // (Your NestJS controller returns { status: 'Success', data: { updatedUser } })
      const updatedUserFromDB = response.data.data;

      // 3. Dispatch the exact new data to Redux to instantly update the UI
      dispatch(
        login({
          user: { 
            ...user, 
            name: updatedUserFromDB.name || updateData.name,
            email: updatedUserFromDB.email || updateData.email,
            phone: updatedUserFromDB.phone || updateData.phone
          }, 
          token: token,
        })
      );

      // Trigger SUCCESS custom popup
      setPopupState({
        isOpen: true,
        type: "success",
        title: "Profile Updated",
        message: "Your profile information was successfully updated.",
        autoClose: true,
        autoCloseDelay: 3000,
      });
      
      setProfileForm((prev) => ({ ...prev, password: "" }));
      
    } catch (error) {
      console.error("Failed to update profile:", error);
      
      // Trigger ERROR custom popup
      setPopupState({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "We couldn't update your profile. Please try again.",
        autoClose: true,
        autoCloseDelay: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 py-32"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      {/* ADD POPUP COMPONENT HERE */}
      <Popup config={popupState} onClose={closePopup} />

      {/* PLAYFUL LIQUID BACKGROUND */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-cyan-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] bg-pink-200/20 rounded-full blur-3xl" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/20 backdrop-blur-3xl border border-white/30 shadow-[0_10px_60px_rgba(255,255,255,0.12)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 pointer-events-none" />
          <div className="absolute top-[-80px] right-[-80px] w-48 h-48 bg-cyan-200/30 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-cyan-200 via-white to-purple-200 flex items-center justify-center text-3xl font-bold text-slate-800 border border-white/40 shadow-[0_10px_40px_rgba(255,255,255,0.2)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />
              {user?.image_url ? (
                <img src={user.image_url} alt={user.name} className="relative z-10 h-full w-full object-cover" />
              ) : (
                <span className="relative z-10">{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                {user?.name || "Guest User"}
              </h1>
              <p className="text-slate-500 mt-2">{user?.email || "No Email"}</p>

              {user?.role !== "user" && (
                <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-white/30 border border-white/30 backdrop-blur-xl text-sm font-medium text-slate-700 capitalize">
                  {user?.role}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* UPDATE PROFILE SECTION */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/18 backdrop-blur-3xl border border-white/30 shadow-[0_10px_60px_rgba(255,255,255,0.1)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Update Profile Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={profileForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white/25 border border-white/30 backdrop-blur-xl focus:outline-none focus:border-indigo-400 text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={profileForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white/25 border border-white/30 backdrop-blur-xl focus:outline-none focus:border-indigo-400 text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={profileForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 rounded-2xl bg-white/25 border border-white/30 backdrop-blur-xl focus:outline-none focus:border-indigo-400 text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave blank to keep unchanged"
                    value={profileForm.password}
                    onChange={handleInputChange}
                    minLength={8}
                    className="w-full px-5 py-4 rounded-2xl bg-white/25 border border-white/30 backdrop-blur-xl focus:outline-none focus:border-indigo-400 text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="relative overflow-hidden px-8 py-4 rounded-2xl bg-white/25 backdrop-blur-2xl border border-white/30 text-slate-800 font-semibold shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isUpdating ? "Saving Changes..." : "Save Profile Changes"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* CART SECTION */}
        {/* <div className="relative overflow-hidden rounded-[2.5rem] bg-white/18 backdrop-blur-3xl border border-white/30 shadow-[0_10px_60px_rgba(255,255,255,0.1)] p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Current Cart Status</h2>
            {cartItems.length === 0 ? (
              <div className="text-center py-10 rounded-2xl bg-white/20 border border-white/20 backdrop-blur-xl">
                <p className="text-lg text-slate-700 font-medium">Your cart is currently empty.</p>
                <p className="text-slate-500 mt-2">Browse products and add something amazing.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item, index) => (
                  <li key={index} className="p-5 rounded-2xl bg-white/20 border border-white/20 backdrop-blur-xl">
                    {item.name} - ${item.price}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default Profile;