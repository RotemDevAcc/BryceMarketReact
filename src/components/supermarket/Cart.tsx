import React, { useState } from 'react'
import { clearCart, removeProduct, selectCart, selectPrice } from './cartSlice'
import { Modal, Button } from 'react-bootstrap';
import { get_user_token } from '../login/loginSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faCashRegister, faShoppingCart, faTicket } from '@fortawesome/free-solid-svg-icons';
import { clearCoupon, getCouponAsync, selectcoupon } from './superSlice';
import Paypal from './Paypal';
import { Message } from '../../Message';


const Modals = {
    purchase: 1,
    coupon: 2,
    hide: 0
}

const Cart = () => {
    const dispatch = useAppDispatch();
    const myCart = useAppSelector(selectCart)
    const token = useAppSelector(get_user_token);
    const totalPrice = useAppSelector(selectPrice);
    const VerifiedCoupon = useAppSelector(selectcoupon);
    const [showModal, setShowModal] = useState(Modals.hide);
    const [modalmessage, setModalMessage] = useState("")
    const [Coupon, setCoupon] = useState("")

    const show_dialog = async () => {
        let price = totalPrice
        if(VerifiedCoupon && VerifiedCoupon.percent){
            price = Number((totalPrice - (VerifiedCoupon.percent / 100) * totalPrice).toFixed(2))
        }
        const confirmationMessage = `Are you sure you want to purchase all the items for $${price}?`;
        setModalMessage(confirmationMessage);
        setShowModal(Modals.purchase);
    };

    const handleCancel = () => {
        setShowModal(Modals.hide)
    }

    const VerifyCoupon = () => {
        if(!Coupon || Coupon === ""){
            Message("You need to enter a coupon code","error")
            return
        }
        dispatch(getCouponAsync({token:token,coupon:Coupon}));
        handleCancel()
    }    

    return (
        <div>
            <div className="card">
                <div className="card-header">
                    Shopping Cart{' '}
                    <FontAwesomeIcon icon={faShoppingCart}/>
                </div>
                <ul className="list-group list-group-flush" id="cart-items">
                    {myCart.map((prod, index) => (
                        <li key={index} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{prod.name} (Count: {prod.count}) - {(prod.price * prod.count).toFixed(2)}</span>
                                <button className="btn btn-sm btn-danger" onClick={() => dispatch(removeProduct({ prodid: prod.id }))}>X</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="card-body">
                    <h5>${totalPrice}</h5>


                    <button className="btn btn-primary" onClick={() => show_dialog()} style={{ margin: 5 }}>
                        Checkout{' '}
                        <FontAwesomeIcon icon={faCashRegister} />
                    </button>
                    
                    <button className="btn btn-danger" onClick={() => dispatch(clearCart())}>
                        Clear Cart{' '}
                        <FontAwesomeIcon icon={faBroom} />
                    </button>
                    
                    
                    {VerifiedCoupon.percent ? <>
                    <h4>Current Coupon: {VerifiedCoupon.percent}%</h4>
                    {totalPrice > 0 ? <h4>Price With Coupon: {(totalPrice - (VerifiedCoupon.percent / 100) * totalPrice).toFixed(2) }</h4> : <></>}
                    
                    <button className='btn btn-danger' onClick={()=>dispatch(clearCoupon())} style={{margin: 5}}>Remove Coupon</button> 
                    </>
                    : 
                    <button className="btn btn-primary" onClick={() => setShowModal(Modals.coupon)} style={{ margin: 5 }}>
                        Coupon Code{' '}
                        <FontAwesomeIcon icon={faTicket} />
                    </button>}
                    


                </div>
            </div>

            <Modal show={showModal === Modals.purchase} onHide={()=>Modals.hide}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalmessage}</Modal.Body>
                <Modal.Footer>
                    {totalPrice > 0.0 ? <Paypal price={VerifiedCoupon && VerifiedCoupon.percent ? Number((totalPrice - (VerifiedCoupon.percent / 100) * totalPrice).toFixed(2)) : totalPrice}></Paypal> : <>No Products Selected</>}
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal === Modals.coupon} onHide={()=>Modals.hide}>
                <Modal.Header>
                    <Modal.Title>Enter A Coupon Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalmessage}
                    <input className="form-control" type="text" id="CouponForm" name="coupon" value={Coupon} onChange={(e)=>setCoupon(e.target.value)} required />
                    <br/>
                    <Button variant="primary" onClick={VerifyCoupon}>
                        Enter
                    </Button>{' '}
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Modal.Body>


            </Modal>
        </div>
    )
}

export default Cart