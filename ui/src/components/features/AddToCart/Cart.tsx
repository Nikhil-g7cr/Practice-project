// import React from "react";
// import {
//   useAppSelector,
//   useAppDispatch,
// } from "../../../redux/hooks/reduxHooks";
// import {
//   removeFromCart,
//   updateQuantity,
//   clearCart,
// } from "../../../redux/features/cart/CartSlice";
// import { useNavigate } from "react-router-dom";

// const Cart: React.FC = () => {
//   // Read cart data from global Redux state
//   const { cartItems, totalQuantity, totalPrice } = useAppSelector(
//     (state) => state.cart,
//   );
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   // Empty Cart View
//   if (cartItems.length === 0) {
//     return (
//       <div className=" flex flex-col items-center justify-center h-screen w-full">
//         <div className="flex flex-col items-center justify-center text-center">
//           <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
//             shopping_cart
//           </span>

//           <h2 className="">
//             Your Cart is Empty
//           </h2>

//           <p className="">
//             Looks like you haven't added anything to your cart yet. Browse our
//             top products and find something you love!
//           </p>

//           <button
//             onClick={() => navigate("/")}
//             className="mt-4 px-8 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 hover:-translate-y-0.5"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Populated Cart View
//   return (
//     <div className="max-w-6xl mx-auto mt-20 px-4 py-12 md:py-16">
//       <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
//         Shopping Cart
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column: Cart Items List */}
//         <div className="lg:col-span-2 space-y-4">
//           {cartItems.map((item) => (
//             <div
//               key={item._id}
//               className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative group"
//             >
//               {/* Product Image */}
//               <div className="w-full sm:w-28 h-28 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
//                 {item.imageUrl ? (
//                   <img
//                     src={item.imageUrl}
//                     alt={item.name}
//                     className="object-contain w-full h-full p-2 hover:scale-110 transition-transform duration-300"
//                   />
//                 ) : (
//                   <span className="material-symbols-outlined text-4xl text-slate-300">
//                     image
//                   </span>
//                 )}
//               </div>

//               {/* Product Details */}
//               <div className="flex-grow text-center sm:text-left">
//                 <h3 className="font-semibold text-lg text-slate-800 line-clamp-1">
//                   {item.name}
//                 </h3>
//                 <p className="text-cyan-600 font-bold text-lg mt-1">
//                   ${item.price.toFixed(2)}
//                 </p>
//               </div>

//               {/* Quantity Controls & Remove Action */}
//               <div className="flex flex-col items-center sm:items-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
//                 {/* Plus / Minus UI */}
//                 <div className="flex items-center gap-3 bg-slate-50 px-2 py-1.5 rounded-xl border border-slate-200">
//                   <button
//                     onClick={() =>
//                       dispatch(
//                         updateQuantity({
//                           id: item._id,
//                           quantity: item.quantity - 1,
//                         }),
//                       )
//                     }
//                     disabled={item.quantity <= 1}
//                     className="text-slate-500 hover:text-cyan-600 hover:bg-white w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:hover:bg-transparent transition-all"
//                   >
//                     <span className="material-symbols-outlined text-sm">
//                       remove
//                     </span>
//                   </button>
//                   <span className="font-bold text-slate-700 w-6 text-center">
//                     {item.quantity}
//                   </span>
//                   <button
//                     onClick={() =>
//                       dispatch(
//                         updateQuantity({
//                           id: item._id,
//                           quantity: item.quantity + 1,
//                         }),
//                       )
//                     }
//                     className="text-slate-500 hover:text-cyan-600 hover:bg-white w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm"
//                   >
//                     <span className="material-symbols-outlined text-sm">
//                       add
//                     </span>
//                   </button>
//                 </div>

//                 {/* Remove Button */}
//                 <button
//                   onClick={() => dispatch(removeFromCart(item._id))}
//                   className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-1 transition-colors"
//                 >
//                   <span className="material-symbols-outlined text-[16px]">
//                     delete
//                   </span>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Right Column: Cart Summary (Sticky Sidebar) */}
//         <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-fit lg:sticky lg:top-24">
//           <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
//             Order Summary
//           </h2>

//           <div className="space-y-4 text-slate-600 mb-8">
//             <div className="flex justify-between items-center">
//               <span className="text-slate-500">
//                 Subtotal ({totalQuantity} items)
//               </span>
//               <span className="font-semibold text-slate-700">
//                 ${totalPrice.toFixed(2)}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-slate-500">Shipping</span>
//               <span className="text-emerald-500 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-sm tracking-wide uppercase">
//                 Free
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-slate-500">Tax</span>
//               <span className="font-semibold text-slate-700">
//                 Calculated at checkout
//               </span>
//             </div>
//           </div>

//           <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-end">
//             <span className="text-lg font-bold text-slate-800">Total</span>
//             <span className="text-3xl font-bold text-cyan-600">
//               ${totalPrice.toFixed(2)}
//             </span>
//           </div>

//           <button className="w-full py-4 bg-slate-900 hover:bg-cyan-600 text-white font-semibold rounded-2xl transition-colors duration-300 shadow-lg shadow-slate-900/20 hover:shadow-cyan-600/30 flex justify-center items-center gap-2">
//             Proceed to Checkout
//             <span className="material-symbols-outlined text-sm">
//               arrow_forward
//             </span>
//           </button>

//           <button
//             onClick={() => dispatch(clearCart())}
//             className="w-full py-3 mt-4 text-slate-400 font-medium hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
//           >
//             Clear Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
