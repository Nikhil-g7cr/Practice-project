import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";

import { fetchPhones } from "../../redux/features/phones/PhoneSlice";

const PhonesPage = () => {
  const dispatch = useAppDispatch();

  const { phones, loading, error } = useAppSelector((state) => state.phones);

  useEffect(() => {
    dispatch(fetchPhones());
  }, [dispatch]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      {phones.map((phone) => (
        <div key={phone._id}>
          <h1>{phone.name}</h1>

          <img src={phone.thumbnail} alt={phone.name} width={200} />

          <p>{phone.basePrice}</p>
        </div>
      ))}
    </div>
  );
};

export default PhonesPage;
