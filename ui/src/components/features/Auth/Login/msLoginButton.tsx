// import { useMsal } from "@azure/msal-react";
// import { useNavigate } from "react-router-dom";
// import { environment } from "../../../../environment/environment";
// // import { loginRequest } from "../../../../config/ms.config";
// import { useAppDispatch } from "../../../../redux/hooks/reduxHooks";
// import { login } from "../../../../redux/features/auth/AuthenticationSlice";

// interface AuthPayload {
//   user: {
//     id?: string;
//     name: string;
//     email: string;
//     role?: string;
//     image_url?: string;
//   };
//   token?: string;
//   accessToken?: string;
// }

// function MicrosoftLoginButton() {
//   const { instance } = useMsal();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const handleLogin = async () => {
//     try {
//       console.log("[MicrosoftLoginButton] Starting Microsoft login");

//       // const result = await instance.loginPopup(loginRequest);

//       // if (!result.idToken) {
//       //   throw new Error("Microsoft did not return an ID token");
//       // }

//       console.log("[MicrosoftLoginButton] Exchanging token with API");

//       const response = await fetch(
//         `${environment.APP_API_URL}/auth/microsoft`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             idToken: result.idToken,
//             accessToken: result.accessToken,
//           }),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Microsoft login failed");
//       }

//       const data: AuthPayload = await response.json();
//       const apiAccessToken = data.accessToken || data.token;

//       if (!apiAccessToken) {
//         throw new Error("API did not return an access token");
//       }

//       console.log("[MicrosoftLoginButton] Login successful");

//       dispatch(login({ user: data.user, token: apiAccessToken }));
//       sessionStorage.setItem("accessToken", apiAccessToken);
//       sessionStorage.setItem("user", JSON.stringify(data.user));

//       navigate("/");
//     } catch (error) {
//       console.error("[MicrosoftLoginButton] Login failed", error);
//       alert(
//         error instanceof Error
//           ? error.message
//           : "Microsoft login failed. Please try again.",
//       );
//     }
//   };

//   return <button onClick={handleLogin}>M</button>;
// }

// export default MicrosoftLoginButton;
