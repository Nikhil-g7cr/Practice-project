import React, { useState } from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../redux/hooks/reduxHooks";
import { checkoutCart } from "../../../redux/features/cart/CartSlice";
import { usePopup } from "../../../hooks/usePopup";
import { useNavigate } from "react-router-dom";

const CartSummary: React.FC = () => {
  const { summary, items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showSuccess, showError } = usePopup();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handlePayment = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      // Trigger the checkout process
      await dispatch(checkoutCart()).unwrap();

      showSuccess(
        "Payment Successful",
        "Your order has been placed and inventory has been updated!",
      );

      // Redirect to a success page or home
      navigate("/");
    } catch (error: any) {
      showError("Payment Failed", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Formatting helper for Indian Rupees
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>

      <div className="space-y-4 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Price ({items.length} items)</span>
          <span className="font-medium">
            {formatCurrency(summary.subtotal + summary.totalDiscount)}
          </span>
        </div>

        <div className="flex justify-between text-emerald-600">
          <span>Discount</span>
          <span className="font-medium">
            - {formatCurrency(summary.totalDiscount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">
            {formatCurrency(summary.subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span className="font-medium">
            {formatCurrency(summary.gstAmount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span className="font-medium">
            {formatCurrency(summary.platformFee)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          {summary.deliveryCharge === 0 ? (
            <span className="font-medium text-emerald-600">Free Delivery</span>
          ) : (
            <span className="font-medium">
              {formatCurrency(summary.deliveryCharge)}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-dashed border-slate-300 my-4"></div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-slate-800">Total Amount</span>
        <span className="text-xl font-black text-slate-900">
          {formatCurrency(summary.finalAmount)}
        </span>
      </div>

      <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm font-semibold mb-6 border border-emerald-100">
        You will save {formatCurrency(summary.totalDiscount)} on this order!
      </div>

      <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;