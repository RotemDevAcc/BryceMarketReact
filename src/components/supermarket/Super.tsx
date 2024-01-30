import { useCallback, useEffect, useState } from 'react'
import { addProduct } from './cartSlice'
import { selectproducts, selectstatus, getDataAsync, selectcategories } from './superSlice';
import Cart from './Cart';
import { TargetServer, isTokenExpired } from '../settings/settings';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faHandPaper, faPaperPlane, faRegistered } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from 'react-bootstrap';
import { get_user_token, is_user_logged, is_user_staff, user_force_logout } from '../login/loginSlice';
import { Message } from '../../Message';
import axios from 'axios';

interface ReviewProduct {
    id?: number;
    name?: string;
    price?: number
}

interface Reviewer {
    id: number;
    name?: string;
    message?: string;
    email?: string;
}

const Super = () => {
    const MY_SERVER = TargetServer
    const superproducts = useAppSelector(selectproducts)
    const supercategories = useAppSelector(selectcategories)
    const [mappedProducts, setMappedProducts] = useState<JSX.Element[]>([]);
    const [mappedCategories, setMappedCategories] = useState<JSX.Element[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<JSX.Element[]>([]);
    // Write Review
    const [reviewmodal, setreviewmodal] = useState(false)
    const [reviewMesssage, setreviewMesssage] = useState('')
    const [reviewproduct, setreviewproduct] = useState<ReviewProduct>({});
    // View Reviews
    const [AllReviews, setAllReviews] = useState<JSX.Element[]>([]);
    const [ShowReviews, setShowReviews] = useState(false)
    const status = useAppSelector(selectstatus)
    const islogged = useAppSelector(is_user_logged)
    const token = useAppSelector(get_user_token)
    const isStaff = useAppSelector(is_user_staff)
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getDataAsync())
    }, [dispatch])

    useEffect(() => {
        if(islogged && isTokenExpired(token)){
          dispatch(user_force_logout());
        }
      
  
      }, [islogged, token, dispatch])


    // word-wrap: break-word; /* Breaks the word at the end of the line */
    // max-width: 200px; /* Or any other suitable width */

    const remove_review = useCallback((id:number) =>{
        if(!id) return Message("Review Not Found","error")
        if(!isStaff) return


        axios
        .delete(`${TargetServer}reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 204) {
            // Review successfully deleted (204 No Content)
            Message("Review Removed Successfully", "success");
            // You can also update the UI to reflect the removal
          } else {
            Message("Failed to remove the review", "error");
            console.error('Failed to remove review');
          }
        })
        .catch((error) => {
          // Handle network errors
          Message("Failed to remove the review", "error");
          console.error('Network error:', error);
        });

          
    },[isStaff,token]);


    const product_reviews = useCallback((id: number, name: string, price: number) => {
        if (!id) return Message("No Product Found", "error")
        axios.get(`${TargetServer}reviews/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.data) {
                    setShowReviews(true)
                    const reviews = response.data
                    if(reviews && reviews.length > 0){
                        const allreviews = reviews.map((review: Reviewer, index: number) => (
                            <div key={index} className="border p-3 mb-3">
                                <strong>Reviewer:</strong> {review.name}<br />
                                <strong>Reviewer Email:</strong> {review.email}<br />
                                <strong>Reviewer Message:</strong><br/>
                                <span style={{ wordBreak: 'break-word', maxWidth: '200px' }}>{review.message}</span><br />
                                {isStaff ? 
                                    <div>
                                        <h5>Staff: </h5>
                                        <Button variant="danger" onClick={() => remove_review(review.id)}>Remove Review</Button> 
                                    </div>
                                    : <></>
                                }
                            </div>
                        ))
                        setAllReviews(allreviews)
                    }else{
                        const allreviews = <h3>No Reviews Available For This product.</h3>
                        setAllReviews([allreviews])
                    }

                    
                }

            })
            .catch((error) => {
                console.error('Error fetching contact forms:', error);
            });
    }, [token, isStaff, remove_review]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        setreviewMesssage(e.target.value);
    };

    const review_product = (id: number, name: string, price: number) => {
        const productid = id
        if (!productid) return
        setreviewproduct({ id: productid, name: name, price: price })
        setreviewmodal(true)
    }


    const send_review = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const productid = reviewproduct.id

        if (!productid) return Message("No Reviewed Product Found", "error")

        if (!reviewMesssage || reviewMesssage.length < 10) {
            Message("Message is too short (minimum 10 characters)", "error");
            return;
        } else if (reviewMesssage.length > 200) {
            Message("Message is too long (maximum 200 characters)", "error");
            return;
        }

        const formData = new FormData();
        formData.append('message', reviewMesssage);

        // Assuming 'productid' and 'token' are available in your component's scope
        formData.append('productid', productid.toString());

        axios
            .post(`${TargetServer}reviews/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.status === 201) {

                    Message(response.data.message || "Review sent successfully", "success");
                } else {
                    Message(response.data.message || "Failed to send the review", "error");
                    console.error('Failed to send review');
                }
            })
            .catch((error) => {
                // Handle network errors
                Message(error.response.data.message || "Failed to send the review", "error");
                console.error('Network error:', error);
            });

        // Message(`${productid}`, "info")
        // Message(`${reviewMesssage}`, "info")
    }



    const FormatProducts = useCallback((products: any, isFiltered: boolean) => {
        const productsList = products.map((prod: any, index: number) => (
            <div key={index} className="card mb-3" style={{ maxWidth: 540 }}>
                <div className="row g-0">
                    <div className="col-md-8">
                        <img src={`${MY_SERVER}static${prod.img}`} alt="" className="img-fluid" style={{ width: 100, height: 100 }} />
                        <div className="card-body">
                            <h5 className="card-title">{prod.name}</h5>
                            <p className="card-text">Description: {prod.desc}</p>
                            <p className="card-text">Category: {supercategories.filter(category => category.id === prod.category)[0].desc || "None"}</p>
                            <p className="card-text">Price: ${prod.price}</p>
                            <button className="btn btn-primary" onClick={() => dispatch(addProduct({ id: prod.id, name: prod.name, price: prod.price }))}>Add To Cart{' '}<FontAwesomeIcon icon={faHandPaper} /></button><br /><br />
                            <button className="btn btn-primary" onClick={() => review_product(prod.id, prod.name, prod.price)}>Review Product{' '}<FontAwesomeIcon icon={faRegistered} /></button><br /><br />
                            <button className="btn btn-primary" onClick={() => product_reviews(prod.id, prod.name, prod.price)}>Product Reviews{' '}<FontAwesomeIcon icon={faClipboard} /></button>
                        </div>
                    </div>
                </div>
            </div>
        ));
        if (isFiltered) {
            setFilteredProducts(productsList);
        } else {
            setMappedProducts(productsList);
        }

    }, [MY_SERVER, supercategories, dispatch, product_reviews])



    useEffect(() => {
        if (status === "done") {

            const categoriesList = supercategories.map((category, index) => (
                <li key={index} className="nav-item">
                    <button className="nav-link btn btn-link" onClick={() => console.log(category.id)}>{category.desc}</button>
                </li>
            ))
            setMappedCategories(categoriesList);
            FormatProducts(superproducts, false)
        } else {
            setMappedProducts([]);
            setMappedCategories([]);
        }
    }, [MY_SERVER, status, superproducts, supercategories, FormatProducts]);

    useEffect(() => {
        if (status === 'done') {
            const filteredData = superproducts.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredData && filteredData.length <= 0) {
                const NoProducts = <div key={"none"}>
                    <h3>No Products found with the name: {searchQuery}</h3>
                </div>
                setFilteredProducts([NoProducts]);
            } else {
                // setFilteredProducts(productsList);
                FormatProducts(filteredData, true)
            }

        }
    }, [MY_SERVER, searchQuery, status, superproducts, dispatch, FormatProducts]);

    useEffect(() => {
        if (status === 'done') {
            const filterproducts = superproducts.filter((prod) => selectedCategoryId === -1 || prod.category === selectedCategoryId)

            const categoriesList = supercategories.map((category, index) => (
                <li key={index} className="nav-item">
                    <button className="nav-link btn btn-link" onClick={() => handleCategoryClick(category.id)}>
                        {category.desc}
                    </button>
                </li>
            ));



            setMappedCategories(categoriesList);
            if (filterproducts && filterproducts.length <= 0) {
                const NoProducts = <div key={"noprod"}>
                    <h3>No Products Are Available In this Category.</h3>
                </div>
                setMappedProducts([NoProducts]);
            } else {
                FormatProducts(filterproducts, false)
            }

        } else {
            setMappedProducts([]);
            setMappedCategories([]);
        }
    }, [MY_SERVER, status, superproducts, supercategories, selectedCategoryId, dispatch, FormatProducts]);

    const handleCategoryClick = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
    };

    return (
        <div>
            {!islogged ? (
                <h2 style={{ textAlign: "center" }}>You must be logged in to view this page</h2>
            ) : (
                status === "done" ? (<div className="container">
                    <nav className="navbar navbar-expand-lg">
                        <span className="navbar-brand">Categories:</span>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav">
                                <li className="nav-item"> <button className="nav-link btn btn-link" onClick={() => handleCategoryClick(-1)}>All Products</button> </li>
                                {mappedCategories}
                            </ul>
                        </div>
                    </nav>
                    <div className="row">
                        <div className="col-md-8">
                            {searchQuery.length > 0 ? filteredProducts : mappedProducts}
                        </div>
                        <div className="col-md-4">
                            <div className="input-group mb-3">
                                <input type="text" placeholder="Search products..." className="form-control" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <Cart />
                        </div>
                    </div>
                </div>) : (
                    status === "rejected" ? <h1 style={{ textAlign: "center" }}>The Supermarket is currently unavailable</h1> : <h1 style={{ textAlign: "center" }}>Loading Products...</h1>
                ))}

            <Modal show={reviewmodal} onHide={() => setreviewmodal(false)}>
                <Modal.Header>
                    <Modal.Title>
                        Product Review
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <h3>You Are Reviewing: {reviewproduct.name}<br />
                        Price: {reviewproduct.price}<br />
                    </h3>
                    <form onSubmit={send_review}>

                        <textarea
                            className="form-control" // Apply Bootstrap's form-control class
                            rows={4} // You can adjust the number of rows as needed
                            placeholder="Enter your review"
                            value={reviewMesssage}
                            onChange={handleInputChange}
                        />
                        <br />
                        <hr />
                        <button type="submit" className="btn btn-primary">
                            Review Product{" "}
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={ShowReviews} onHide={() => setShowReviews(false)}>
                <Modal.Header>
                    <Modal.Title>Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {AllReviews}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowReviews(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    )
}

export default Super