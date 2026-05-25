// // Example usage of Popup component in your App or main layout

// import Popup from "../common/Popup";
// import { usePopup } from "./usePopup";

// const AppWithPopup = () => {
//   const { popupState, showSuccess, showError, showWarning, showInfo, closePopup } = usePopup();

//   // Example: Handle add product
//   const handleAddProduct = async () => {
//     try {
//       // Your API call here
//       // await addProduct(data);
      
//       showSuccess(
//         "Product Added",
//         "Your new product has been successfully added to the store.",
//         "Added"
//       );
//     } catch (error) {
//       showError(
//         "Failed to Add",
//         "There was an error adding the product. Please try again.",
//         "Error"
//       );
//     }
//   };

//   // Example: Handle delete product with confirmation
//   const handleDeleteProduct = () => {
//     showWarning(
//       "Delete Product",
//       "Are you sure you want to delete this product? This action cannot be undone.",
//       async () => {
//         try {
//           // await deleteProduct(productId);
//           showSuccess(
//             "Product Deleted",
//             "The product has been successfully removed from the store.",
//             "Deleted"
//           );
//         } catch (error) {
//           showError(
//             "Failed to Delete",
//             "There was an error deleting the product.",
//             "Error"
//           );
//         }
//       },
//       "Delete"
//     );
//   };

//   // Example: Handle update product
//   const handleUpdateProduct = async () => {
//     try {
//       // await updateProduct(data);
//       showSuccess(
//         "Product Updated",
//         "The product details have been successfully updated.",
//         "Updated"
//       );
//     } catch (error) {
//       showError(
//         "Failed to Update",
//         "There was an error updating the product.",
//         "Error"
//       );
//     }
//   };

//   // Example: Info notification
//   const handleShowInfo = () => {
//     showInfo(
//       "Processing",
//       "Your request is being processed. This may take a few moments."
//     );
//   };

//   return (

//   );
// };

// export default AppWithPopup;

/*
USAGE GUIDE:
============

1. IMPORT THE HOOK:
   import { usePopup } from "./hooks/usePopup";

2. USE IN YOUR COMPONENT:
   const { showSuccess, showError, showWarning, showInfo, popupState, closePopup } = usePopup();

3. SHOW POPUPS:
   
   a) Success Message:
      showSuccess(
        "Success Title",
        "Success message here",
        "Action Label" // optional
      );

   b) Error Message:
      showError(
        "Error Title",
        "Error message here",
        "Action Label" // optional
      );

   c) Warning with Confirmation:
      showWarning(
        "Warning Title",
        "Warning message here",
        () => {
          // Callback when user confirms
          console.log("User confirmed");
        },
        "Action Label" // optional
      );

   d) Info Message:
      showInfo(
        "Info Title",
        "Info message here",
        "Action Label" // optional
      );

4. ADD POPUP TO YOUR APP:
   Place this in your root App component:
   <Popup config={popupState} onClose={closePopup} />

POPUP TYPES:
============
- "success": Green icon, for successful operations
- "error": Red icon, for errors
- "warning": Orange icon, for confirmations
- "info": Blue icon, for information

FEATURES:
=========
✓ Blurred background overlay
✓ Centered on screen
✓ Blocks background interactions
✓ Auto-close after delay (customizable)
✓ Manual close with button
✓ Confirmation dialog support
✓ Smooth animations
✓ Material Design 3 styling
✓ Material Symbols icons
*/
