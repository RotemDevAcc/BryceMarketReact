import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Message } from '../../Message';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { purchaseCartAsync, selectcoupon } from './superSlice';
import { selectCart, selectPrice } from './cartSlice';
import { get_user_token, is_user_logged, user_force_logout } from '../login/loginSlice';
import { isTokenExpired } from "../settings/settings";
import { useEffect } from "react";
const Paypal = (props:{price:number}) => {

    const dispatch = useAppDispatch()
    const myCart = useAppSelector(selectCart)
    const islogged = useAppSelector(is_user_logged)
    const token = useAppSelector(get_user_token);
    const totalPrice = useAppSelector(selectPrice);
    const VerifiedCoupon = useAppSelector(selectcoupon);
    const initialOptions = {
        clientId: "AUYRjtY2_vXsZMeIQWnqTM5JLYztUm3tqA_Wd-2Do5cHGISL-hKYAWg9Ua82DvEUbvIrvfHmjzBHdOlA",
        currency: "USD",
        intent: "capture",
    };

    const handleApprove = (orderid:string) => {
        dispatch(purchaseCartAsync({cart:myCart,price:totalPrice,token,coupon:VerifiedCoupon, orderid:orderid}));
    }

    
    useEffect(() => {
        const interval = setInterval(() => {
            if (islogged && isTokenExpired(token)) {
                const paypalButtons = document.querySelector('.paypal-buttons'); // Adjust the selector if needed
                if (paypalButtons && paypalButtons.parentNode) {
                    paypalButtons.parentNode.removeChild(paypalButtons);
                }
                dispatch(user_force_logout());
                Message("Your Login Has Expired we are redirecting you back to the login page.","warning")
            }
        }, 3000); // Check every 3 seconds

        return () => {
            clearInterval(interval); // Clear the interval on component unmount
        }
    }, [islogged, token, dispatch]);
    

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons style={{ layout: "horizontal" }} 
                
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: "Product Payment",
                                amount: {
                                    value:props.price.toString()
                                },
                            }
                        ]
                    })
                }}
                onApprove={async (data, actions:any) => {
                    Message("Order Sent, Please Wait.", "info")
                    
                    try {
                        const order = await actions.order.capture();
                
                        // Additional logic can go here, if needed
                
                        const orderid = order.purchase_units[0].payments.captures[0].id
                        if (orderid) {
                            handleApprove(orderid)
                            Message("Order Sent Successfully.", "success")
                        } else {
                            Message("Order Failed, We Couldn't fetch the order id.", "error")
                        }
                    } catch (error) {
                        // Handle the error here
                        console.error("Error during order processing:", error);
                        Message("An error occurred during the order process.", "error");
                    }
                }}
                onCancel={(data) => {
                    Message("Payment process was cancelled.", "info");
                }}
                onError={(err) => {
                    // Handle errors here
                    console.error("PayPal Button Error:", err);
                    // Message("An error occurred with the PayPal button.", "error");
                }}
            />
            </PayPalScriptProvider>
        </div>
    )
}

export default Paypal