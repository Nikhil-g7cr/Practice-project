import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import {
  updatePhone,
  getPhoneById,
} from "../../redux/features/phones/PhoneSlice"; // <-- IMPORT getPhoneById
import {
  deleteFileFromAzure,
  uploadFileToAzure,
} from "../../shared/azureUploadService"; // Assuming this is where you put it

const EditPhone = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // --- ADDED currentPhone and loading ---
  const { phones, currentPhone, loading } = useAppSelector(
    (state) => state.phones,
  );

  // --- UPDATED FIND LOGIC: Check list first, then check currentPhone ---
  const phone =
    phones?.find((p: any) => p._id === id) ||
    (currentPhone?._id === id ? currentPhone : null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [stock, setStock] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- NEW: THE MAGIC FETCH LOGIC ---
  useEffect(() => {
    // If the phone isn't in Redux, fetch it from the API!
    if (!phone && id) {
      dispatch(getPhoneById(id));
    }
  }, [dispatch, id, phone]);

  // --- Update local state when phone data is finally ready ---
  useEffect(() => {
    if (phone) {
      setName(phone.name || "");
      setPrice(phone.basePrice || 0);
      setImage(phone.thumbnail || "");
      setStock(phone.storageVariants?.[0]?.stock || 0);
    }
  }, [phone]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    let finalFileName = image;
    let newlyUploadedName: string | null = null;

    try {
      if (selectedFile) {
        newlyUploadedName = await uploadFileToAzure(selectedFile);
        finalFileName = newlyUploadedName;
      }

      const updatePayload = {
        name: name,
        basePrice: Number(price),
        thumbnail: finalFileName,
        // Add storage variants update if needed based on your backend
      };

      await dispatch(
        updatePhone({ id: phone!._id, data: updatePayload }),
      ).unwrap();

      navigate("/admin/product"); // Or dynamic prefix
    } catch (error) {
      console.error("Failed to update phone", error);
      if (selectedFile && newlyUploadedName) {
        await deleteFileFromAzure(newlyUploadedName);
      }
      alert("Failed to update the product. Please try again.");
    }
  };

  // --- NEW: Show a loading state while fetching ---
  if (loading && !phone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-[url('/updateSM2.png')] bg-cover bg-center bg-fixed px-4 py-20">
      <div className="absolute top-[-120px] left-[-100px] w-[420px] h-[420px] bg-cyan-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-100px] w-[420px] h-[420px] bg-purple-300/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-2xl mx-auto mt-20">
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white/10 backdrop-blur-[30px] border border-white/20 before:absolute before:inset-0 before:rounded-[2.5rem] before:p-[1px] before:bg-gradient-to-br before:from-white/60 before:via-white/10 before:to-cyan-200/20 before:pointer-events-none after:absolute after:inset-[1px] after:rounded-[2.4rem] after:bg-white/[0.03] after:backdrop-blur-[50px] after:pointer-events-none shadow-[0_20px_60px_rgba(255,255,255,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[35%] bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-200/20 rounded-full blur-3xl" />
          <div className="absolute top-0 left-[-140%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-all duration-[1600ms] group-hover:left-[140%] pointer-events-none" />

          <div className="relative z-10 p-8 md:p-10">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-cyan-700 text-xs font-bold tracking-widest uppercase mb-4">
                Admin Panel
              </span>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
                Update Phone
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Phone Name
                </label>
                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_20px_rgba(255,255,255,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="relative z-10 w-full px-5 py-4 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Enter phone name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Base Price
                </label>
                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_20px_rgba(255,255,255,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="relative z-10 w-full px-5 py-4 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Enter phone price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Thumbnail URL
                </label>
                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_20px_rgba(255,255,255,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />
                  {/* Shows current string or URL (useful if no new file is selected) */}
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="relative z-10 w-full px-5 py-4 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Paste image URL or wait for upload"
                  />

                  {/* Triggers handleFileSelect on change */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#4a7c59] hover:file:bg-green-100 mb-6 border border-gray-200 rounded-xl p-2 relative z-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Stocks
                </label>
                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_20px_rgba(255,255,255,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />
                  {/* Shows current string or URL (useful if no new file is selected) */}
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="relative z-10 w-full px-5 py-4 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdate}
                className="group relative overflow-hidden w-full py-4 mt-4 rounded-2xl bg-white/12 backdrop-blur-2xl border border-white/20 text-slate-800 font-bold text-lg shadow-[0_10px_30px_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />
                <div className="absolute top-0 left-[-130%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] transition-all duration-[1200ms] group-hover:left-[130%]" />
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
