import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { get_user_token } from '../login/loginSlice';
import { AdmingetAllReceiptsAsync, get_admin_products, get_admin_allreceipts } from './managementSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faDollarSign, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Receipts = () => {

  const dispatch = useAppDispatch();
  const token = useAppSelector(get_user_token)
  const allproducts = useAppSelector(get_admin_products)
  const allreceipts = useAppSelector(get_admin_allreceipts)
  const [ShowReceipts, setShowReceipts] = useState(false)

  const [receiptsbody, setreceiptsbody] = useState<JSX.Element[]>([]);

  const GetProductName = useCallback((productid: number) => {
    const foundProduct = allproducts.find(product => Number(product.id) === Number(productid));
    return foundProduct ? foundProduct.name : 'Product Not Found';
  }, [allproducts])

  const formatProducts = useCallback((products: any) => {
    const prods = products
    const productItems = prods.map((product: any, index: number) => (
      <div key={`${index}format`}>
        <li className='list-group-item'>
          <FontAwesomeIcon icon={faShoppingCart} /> Product Name: {GetProductName(product.item)}<br />
          <FontAwesomeIcon icon={faBox} /> Count: {product.count}<br />
          <FontAwesomeIcon icon={faDollarSign} /> Price: ${product.price}<br />
        </li>
      </div>
    ));
    return productItems
  }, [GetProductName])

  useEffect(() => {
    if (allproducts?.length > 0 && allreceipts?.length > 0) {
      const receiptsBody = allreceipts.map((receipt, index) =>
        <li key={index} className='list-group-item'>
          <strong>Receipt ID:</strong> {receipt.id}<br />
          <strong>PayPal Order ID:</strong> {receipt.orderid || "No OrderID"}<br />
          <strong>User:</strong> {receipt.recuser.username} <span style={{ color: "#008000" }}>[{receipt.recuser.userid}]</span><br />
          <strong>Price:</strong> ${receipt.price}<br />
          {receipt.discount && receipt.discount > 0 ? <><strong>Discount:</strong> {receipt.discount}%<br /></> : <></>}
          <strong>Products:</strong>
          <ul>
            {formatProducts(receipt.products)}
          </ul>
        </li>
      )

      setreceiptsbody(receiptsBody)
      setShowReceipts(true)
    }

  }, [allproducts, allreceipts, formatProducts])

  useEffect(() => {
    dispatch(AdmingetAllReceiptsAsync(token))
  }, [dispatch, token])



  return (
    <div style={{ textAlign: 'center' }}>
      {ShowReceipts ? (
        <div className='container mt-4'>
          <ul className='list-group'>
            {receiptsbody}
          </ul>
        </div>
      ) : (
        <h2 style={{ margin: 'auto' }}>Receipts Not Loaded Yet.</h2>
      )}
    </div>

  )
}

export default Receipts