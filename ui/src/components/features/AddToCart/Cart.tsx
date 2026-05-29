import React, { useEffect } from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../redux/hooks/reduxHooks";
import {
  syncCartItem,
  clearLocalCart,
  fetchCart,
} from "../../../redux/features/cart/CartSlice";
import { useNavigate } from "react-router-dom";
import CartSummary from "./CartSummary";

const Cart: React.FC = () => {
  // 1. Read the correct state variables from CartSlice
  const { items, summary, loading } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 2. Fetch the cart when the component mounts
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // 3. Helper function to handle Add, Subtract, and Remove
  const handleQuantityChange = (item: any, newQuantity: number) => {
    dispatch(
      syncCartItem({
        productId: item.productId._id, // Extract the ID from the populated object
        productModel: item.productModel,
        quantity: newQuantity,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
      }),
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading Cart...
      </div>
    );
  }

  // Empty Cart View
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
            shopping_cart
          </span>
          <h2>Your Cart is Empty</h2>
          <p>Browse our top products and find something you love!</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-8 py-3 bg-cyan-600 text-white font-semibold rounded-xl"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Populated Cart View
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="mt-10 flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 ">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              // Because of NestJS .populate(), item.productId contains the actual product details
              const product = item.productId;

              return (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative group"
                >
                  <div className="w-full sm:w-28 h-28 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-contain w-full h-full p-2"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        image
                      </span>
                    )}
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-semibold text-lg text-slate-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-cyan-600 font-bold text-lg mt-1">
                      ${item.discountPrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-200">
                      <button
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="text-slate-500 hover:text-cyan-600 w-8 h-8 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-sm">
                          remove
                        </span>
                      </button>
                      <span className="font-bold text-slate-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                        className="text-slate-500 hover:text-cyan-600 w-8 h-8"
                      >
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>
                      </button>
                    </div>

                    {/* Removing an item is just updating its quantity to 0 */}
                    <button
                      onClick={() => handleQuantityChange(item, 0)}
                      className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;
