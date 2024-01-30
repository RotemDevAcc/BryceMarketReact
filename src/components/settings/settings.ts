import { jwtDecode } from "jwt-decode";
// export const TargetServer = "https://brycemarketserver.onrender.com/"
export const TargetServer = "http://127.0.0.1:8000/"

export function numberWithCommas(x:string | number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// Function to check if a token is expired
export const isTokenExpired = (token: string) => {
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

    return decodedToken.exp < currentTime;
  } catch (error) {
    // Handle decoding errors (e.g., invalid token format)
    return true; // Treat as expired if decoding fails
  }
};

// Check if the token is expired
// const isExpired = isTokenExpired(token);

// if (isExpired) {
  // Token is expired
  // You can log the user out or take appropriate action
  // For example: dispatch a logout action
  // dispatch(logoutAction());
// }
