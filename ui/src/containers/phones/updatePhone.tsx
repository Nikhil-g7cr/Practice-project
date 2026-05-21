import { useState } from "react";

import { useAppDispatch } from "../../redux/hooks/reduxHooks";
import { updatePhone } from "../../redux/features/phones/PhoneSlice";

const EditPhone = ({ phone }: any) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(phone.name);

  const [price, setPrice] = useState(phone.basePrice);

  const handleUpdate = async () => {
    await dispatch(
      updatePhone({
        id: phone._id,

        data: {
          name,
          basePrice: price,
        },
      }),
    );

    alert("Phone Updated");
  };

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
