import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Bg from "../../../public/profileBg.png";
import API from "../../config/axios.config";
import { login } from "../../redux/features/auth/AuthenticationSlice";
import Popup, { type PopupConfig } from "../../common/Popup";

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

  // Error State for inline validation
  const [formErrors, setFormErrors] = useState({
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

  const closePopup = () =>
    setPopupState((prev) => ({ ...prev, isOpen: false }));
  // ---------------------------------

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

  // --- 1. SINGLE FIELD VALIDATOR ---
  const validateField = (name: string, value: string): string => {
    let error = "";
    const trimmedValue = value.trim();

    switch (name) {
      case "name":
        if (!trimmedValue) error = "Full name is required.";
        else if (trimmedValue.length < 2) error = "Name must be at least 2 characters long.";
        else if (trimmedValue.length > 50) error = "Name cannot exceed 50 characters.";
        else if (!/^[a-zA-Z\s\.\-]+$/.test(trimmedValue)) error = "Name can only contain letters, spaces, hyphens, and periods.";
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedValue) error = "Email address is required.";
        else if (!emailRegex.test(trimmedValue)) error = "Please enter a valid email address.";
        break;

      case "phone":
        if (trimmedValue) {
          const phoneRegex = /^\+?[1-9]\d{6,14}$/;
          if (!phoneRegex.test(trimmedValue)) error = "Phone must be 7-15 digits, optionally starting with '+'.";
        }
        break;

      case "password":
        if (trimmedValue && trimmedValue.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        break;
      
      default:
        break;
    }
    return error;
  };

  // --- 2. REAL-TIME VALIDATION ON CHANGE ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the input value
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Immediately validate the current field and update its error state
    const fieldError = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // --- 3. FULL FORM VALIDATION ON SUBMIT ---
  const validateForm = () => {
    const errors = {
      name: validateField("name", profileForm.name),
      email: validateField("email", profileForm.email),
      phone: validateField("phone", profileForm.phone),
      password: validateField("password", profileForm.password),
    };

    setFormErrors(errors);

    // Returns true if all error strings are completely empty
    return !Object.values(errors).some(error => error !== "");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run full validation before proceeding
    if (!validateForm()) {
      return;
    }

    const updateData: any = {};

    if (profileForm.name !== user.name) {
      updateData.name = profileForm.name;
    }
    if (profileForm.email !== user.email) {
      updateData.email = profileForm.email;
    }
    if (profileForm.phone !== (user.phone || "")) {
      updateData.phone = profileForm.phone;
    }
    if (profileForm.password.trim() !== "") {
      updateData.password = profileForm.password;
    }

    if (Object.keys(updateData).length === 0) {
      setPopupState({
        isOpen: true,
        type: "info",
        title: "No Changes",
        message: "You haven't made any changes to your profile.",
        autoClose: true,
        autoCloseDelay: 3000,
      });
      return;
    }

    setIsUpdating(true);

    try {
      const currentUserId = user.id || user._id;
      const response = await API.patch(`/user/${currentUserId}`, updateData);

      const updatedUserFromDB = response.data.data;

      dispatch(
        login({
          user: {
            ...user,
            name: updatedUserFromDB.name || updateData.name,
            email: updatedUserFromDB.email || updateData.email,
            phone: updatedUserFromDB.phone || updateData.phone,
          },
          token: token,
        })
      );

      setPopupState({
        isOpen: true,
        type: "success",
        title: "Profile Updated",
        message: "Your profile information was successfully updated.",
        autoClose: true,
        autoCloseDelay: 3000,
      });

      setProfileForm((prev) => ({ ...prev, password: "" }));
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      const errorMessage = error.response?.data?.message || "We couldn't update your profile. Please try again.";

      setPopupState({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: errorMessage,
        autoClose: true,
        autoCloseDelay: 4000,
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

            <form onSubmit={handleUpdateProfile} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={profileForm.name}
                    onChange={handleInputChange}
                    maxLength={50}
                    className={`w-full px-5 py-4 rounded-2xl bg-white/25 border backdrop-blur-xl focus:outline-none transition-all ${
                      formErrors.name 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-white/30 focus:border-indigo-400"
                    } text-slate-800 placeholder:text-slate-400`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={profileForm.email}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 rounded-2xl bg-white/25 border backdrop-blur-xl focus:outline-none transition-all ${
                      formErrors.email 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-white/30 focus:border-indigo-400"
                    } text-slate-800 placeholder:text-slate-400`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Phone Number */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g., +919876543210"
                    value={profileForm.phone}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 rounded-2xl bg-white/25 border backdrop-blur-xl focus:outline-none transition-all ${
                      formErrors.phone 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-white/30 focus:border-indigo-400"
                    } text-slate-800 placeholder:text-slate-400`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-slate-700 mb-1 ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave blank to keep unchanged"
                    value={profileForm.password}
                    onChange={handleInputChange}
                    maxLength={64}
                    className={`w-full px-5 py-4 rounded-2xl bg-white/25 border backdrop-blur-xl focus:outline-none transition-all ${
                      formErrors.password 
                        ? "border-red-400 focus:border-red-500" 
                        : "border-white/30 focus:border-indigo-400"
                    } text-slate-800 placeholder:text-slate-400`}
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-1.5 ml-2 font-medium">
                      {formErrors.password}
                    </p>
                  )}
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
      </div>
    </div>
  );
};

export default Profile;