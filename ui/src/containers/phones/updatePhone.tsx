import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks"; // Import useAppSelector
import { updatePhone } from "../../redux/features/phones/PhoneSlice";

const EditPhone = () => {
  const navigate = useNavigate();
  // 1. Get the ID from the URL (e.g., /phones/update/:id)
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // 2. Pull your phones array from Redux
  const { phones } = useAppSelector((state) => state.phones);

  // 3. Find the specific phone that matches the ID in the URL
  const phone = phones?.find((p: any) => p._id === id);

  // 4. Initialize state safely (fallback to empty/0 if phone isn't loaded yet)
  const [name, setName] = useState(phone?.name || "");
  const [price, setPrice] = useState(phone?.basePrice || 0);
  const [image, setImage] = useState(phone?.thumbnail);

  // Update local state if the phone data loads after the initial render
  useEffect(() => {
    if (phone) {
      setName(phone.name);
      setPrice(phone.basePrice);
      setImage(phone.thumbnail)
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
          thumbnail:image
        },
      }),
    );
    navigate(`/phone/${phone._id}`); // Navigate back to the phone's detail page after update
  };

  // 5. Add a fallback in case the phone data isn't in Redux yet (e.g. if the user refreshed the page)
  if (!phone) {
    return (
      <div className="flex justify-center items-center py-20">
        <h1 className="text-xl">Loading phone data...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2"
      />

      
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
     

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white p-2 rounded"
      >
        Update Phone
      </button>
    </div>
  );
};

export default EditPhone;
