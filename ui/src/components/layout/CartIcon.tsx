import React from 'react';
import { useAppSelector } from "../../redux/hooks/reduxHooks";
import { useNavigate } from 'react-router-dom';

const CartIcon: React.FC = () => {
  // Subscribe specifically to the total quantity 
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/user/cart')}
      className="relative p-2 flex items-center justify-center text-slate-600 hover:text-cyan-600 transition-colors bg-transparent rounded-full hover:bg-slate-50"
    >
      <span className="material-symbols-outlined text-2xl">shopping_cart</span>
      
      {/* Floating Badge Indicator */}
      {totalQuantity > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-cyan-600 rounded-full min-w-[20px] shadow-sm">
          {totalQuantity > 99 ? '99+' : totalQuantity}
        </span>
      )}
    </button>
  );
};

export default CartIcon;