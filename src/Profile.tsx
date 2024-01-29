import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { selectDarkMode, toggleDarkMode } from './components/settings/darkModeSlice';
import { changeFullNameAsync, changePicAsync, getClientReceiptsAsync, get_recipe_recommend, get_user_details, get_user_receipts, get_user_token, recommandProductsAsync, reset_userreceipts } from './components/login/loginSlice';
import { TargetServer, numberWithCommas } from './components/settings/settings';
import { Modal, Button } from 'react-bootstrap';
import { Message } from './Message';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCalendarAlt, faVenusMars, faIdCard, faMoon, faSun, faImage, faReceipt, faShoppingCart, faDollarSign, faBox } from '@fortawesome/free-solid-svg-icons';
import { getDataAsync, selectproducts, selectstatus } from './components/supermarket/superSlice';


const ModalTypes = {
    Clear: 0,
    NEW_PICTURE: 1,
    NEW_NAME: 2,
    RECOMMEND: 3,
    RECEIPTS: 4,
};

const Profile = () => {
    const [firstName, setfirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [selectedImage, setSelectedImage] = useState<File | null>(null);;
    const [showModal, setShowModal] = useState(0);

    const [receiptList, setreceiptList] = useState<JSX.Element[]>([]);
    const [profileHeader, setProfileHeader] = useState<string | JSX.Element>('');
    const [profileButtons, setProfileButtons] = useState<JSX.Element | string>('');
    const [recommendations, setrecommendations] = useState<string | JSX.Element>('');
    
    const dispatch = useAppDispatch();
    const myDetails = useAppSelector(get_user_details);
    const darkMode = useAppSelector(selectDarkMode);
    const token = useAppSelector(get_user_token)
    const userReceipts = useAppSelector(get_user_receipts)
    const recommend = useAppSelector(get_recipe_recommend)
    const superproducts = useAppSelector(selectproducts)
    const status = useAppSelector(selectstatus)

    const [imageSrc, setImageSrc] = useState(`${TargetServer}static/images/${myDetails.img || "placeholder.png"}`);
    const placeholderImg = `${TargetServer}static/images/placeholder.png`;

    const newPicture = () => {
        setShowModal(ModalTypes.NEW_PICTURE)
    };

    const GetProductName = useCallback((productid: number) => {
        if(!superproducts || !superproducts.length) return 'Product not Found';
        const foundProduct = superproducts.find(product => Number(product.id) === Number(productid));
        return foundProduct ? foundProduct.name : 'Product Not Found';
    }, [superproducts])

    const formatProducts =useCallback((products:any) =>{
        const prods = JSON.parse(products)
        const productItems = prods.map((product:any,index:number) => (
            <div key={`${index}format`}>
                <li className='list-group-item'>
                    <FontAwesomeIcon icon={faShoppingCart}/> Product Name: {GetProductName(product.item)}<br/> 
                    <FontAwesomeIcon icon={faBox}/> Count: {product.count}<br/> 
                    <FontAwesomeIcon icon={faDollarSign}/> Price: ${product.price}<br/>
                </li> 
            </div>
        ));
        return productItems
    }, [GetProductName])

    const ShowReceipts = useCallback(() => {
        if(token && token !== ''){
            
            if(userReceipts?.id === 0)
            {
                const details = {token:token}
                Message("Fetching Receipts, Stand By.","info")
                dispatch(getClientReceiptsAsync(details))
                dispatch(getDataAsync())
            }else{
                setShowModal(ModalTypes.RECEIPTS)
            }
                
            
        }
        
    },[token,userReceipts,dispatch]);

    useEffect(() => {
        if (status === "done" && superproducts?.length > 0) {
            if (userReceipts && showModal === ModalTypes.RECEIPTS) {
                const receiptsArray = Object.values(userReceipts)
                const receiptbody = receiptsArray.map((receipt,index) => (
                    <div key={index}>
                        <strong>Receipt ID:</strong> {receipt.id}<br/>
                        <strong>Price:</strong> ${numberWithCommas(receipt.price)}<br/>
                        <strong>Products:</strong>
                        <ul>
                            {formatProducts(receipt.products)}
                        </ul>
                    </div>
                ));
                setreceiptList(receiptbody)
            }
        }
    }, [status,superproducts, userReceipts, showModal,formatProducts])

    const newName = () => {
        setShowModal(ModalTypes.NEW_NAME)
    };

    useEffect(() => {

    
      return () => {
        dispatch(reset_userreceipts())
      }
    }, [dispatch])
    

    useEffect(() => {
        if (recommend) {
            const divrecommend =
                <div>
                    <h3>Product Name: {recommend.name}</h3>
                    <h4>Ingredients: </h4>
                    {recommend.ingredients.map((ing, index) => (
                        <li key={index}>{index}. {recommend.ingredients[index]} </li>
                    ))}
                    <h5>{recommend.instructions}</h5>
                </div>
            setrecommendations(divrecommend)
        }
        return () => {
            setrecommendations('')
        }


    }, [recommend])

    useEffect(() => {
        setImageSrc(`${TargetServer}static/images/${myDetails.img}`)
    }, [myDetails])

    const handleNameFirstChange = (event: ChangeEvent<HTMLInputElement>) => {
        setfirstName(event.target.value || '')
    }
    const handleNameLastChange = (event: ChangeEvent<HTMLInputElement>) => {
        setlastName(event.target.value || '')
    }


    const handleIMGClose = () => {
        setShowModal(ModalTypes.Clear)
        setSelectedImage(null);
    }

    const handleIMGCancel = () => {
        setShowModal(ModalTypes.Clear)
        setSelectedImage(null);
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) setSelectedImage(file);
    };

    const handleIMGConfirm = () => {
        if (selectedImage) {
            const imageFile = selectedImage
            if (!imageFile) {
                Message("An image was not provided.", "error");
                return;
            }

            // Check file format and size
            const allowedFormats = ['.png'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            // Validate file format based on allowedFormats
            const isValidFormat = allowedFormats.some(format => imageFile.name.toLowerCase().endsWith(format));

            if (!isValidFormat) {
                Message("Please upload a PNG image.", "error");
            } else if (imageFile.size > maxSize) {
                Message("Image size must be less than 2MB.", "error");
            } else {
                // Use fetch or other methods to send the form data to the server
                handleIMGClose()
                const formData = new FormData();
                formData.append('img', imageFile);
                formData.append('rtype', "newpicture");
                formData.append('token', token);
                dispatch(changePicAsync(formData))
            }
        } else {
            Message("No Image Sent", "error")
        }
    }

    const handleNameCancel = () => {
        setShowModal(ModalTypes.Clear)
    }

    const handleNameConfirm = () => {
        const fullname = (myDetails && myDetails.firstname + " " + myDetails.lastname) || "None"
        const firstname = firstName
        const lastname = lastName

        if (!firstname || !lastname) {
            Message("Firstname And Lastname must be specified", "error")
            return
        }

        const fakename = `${firstname} ${lastname}`

        if (fakename === fullname) {
            Message("Your New Name cant be the same as your current name.", "error")
            return
        }

        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('token', token);
        formData.append('rtype', "newname");
        setShowModal(ModalTypes.Clear)
        dispatch(changeFullNameAsync(formData))
    }


    useEffect(() => {

           
    }, [userReceipts])
    

    useEffect(() => {
        if (!myDetails.username) {
            setProfileHeader(
                <>
                    You must be logged in to use this page
                    {/* <NavLink to="/login" className="nav-link">
                        Click Here
                    </NavLink> */}
                </>
            );
        } else {
            const fullname = `${myDetails.firstname || 'John'} ${myDetails.lastname || 'Doe'}`;
            setProfileHeader(
                <>
                    Welcome {fullname} To Your Profile
                    <br />
                    Choose Your Actions:
                </>
            );
            
            setProfileButtons(
                <div>
                    <h3>Your Picture</h3>
                    <div className="card" style={{ width: '18rem' }}>
                        <img
                            src={imageSrc}
                            onError={()=>setImageSrc(placeholderImg)}
                            className="card-img-top"
                            alt="Profile Pic"
                        />
                        <div className="card-body">
                            <h5 className="card-title">{myDetails.username}</h5>
                            <button className="btn btn-primary" onClick={newPicture}>
                                Change Picture{' '}
                                <FontAwesomeIcon icon={faImage} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <br />
                        <button id="receiptButton" className="btn btn-success" onClick={ShowReceipts}>
                            My Receipts{' '}
                            <FontAwesomeIcon icon={faReceipt} />
                        </button>
                        <br />
                        <ul>
                            <li>
                                <FontAwesomeIcon icon={faUser} /> Username: {myDetails.username}
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faEnvelope} /> Email: {myDetails.email}
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faCalendarAlt} /> Date Of Birth: {myDetails.dob || "Not Specified"}
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faVenusMars} /> Gender: {myDetails.gender || "Male"}
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faIdCard} /> Fullname: {fullname}
                            </li>
                        </ul>
                        <br />
                        <button className="btn btn-primary" style={{ borderRadius: 20, margin: 10 }} onClick={newName}>
                            Change Name
                        </button>
                        <button className="btn btn-primary" style={{ borderRadius: 20 }} onClick={() => {dispatch(recommandProductsAsync(token)); setShowModal(ModalTypes.RECOMMEND)}}>
                            Recommend Recipe
                        </button>
                    </div>
                </div>
            );

            // Rest of your initialization logic

            // if (myDetails.is_staff) {
            //     // Additional logic for staff
            // }
        }
    }, [myDetails, imageSrc, placeholderImg, dispatch, token, ShowReceipts]);


    return (
        <div>
            <div className="container mt-4">
                <h2>{profileHeader}</h2>
                <br />
                <br />
                <ul className="list-group">
                    {profileButtons}
                </ul>


                <h2>Settings:</h2>
                <div className="custom-control custom-switch">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitches"
                        checked={darkMode}
                        onChange={() => dispatch(toggleDarkMode())}
                    />
                    <label
                        className="custom-control-label"
                        htmlFor="customSwitches"
                    >
                        {darkMode ? (
                            <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
                        ) : (
                            <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
                        )}{' '}
                        Toggle Darkmode
                    </label>
                </div>

            </div>
            <Modal show={showModal === ModalTypes.NEW_PICTURE} onHide={handleIMGCancel}>
                <Modal.Header>
                    <Modal.Title>Change Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="changeImgForm">
                        <label htmlFor="changeImgImage">Image (PNG format, max 2MB):</label>
                        <input
                            type="file"
                            id="changeImgImage"
                            name="changeImgImage"
                            accept=".png"
                            onChange={handleImageChange}
                            required
                        />
                        <br />
                        <Button variant="primary" onClick={() => handleIMGConfirm()}>
                            Change Image
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleIMGCancel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal === ModalTypes.NEW_NAME} onHide={handleNameCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="changeNameForm">
                        <label htmlFor="changeNameFirst">Firstname:</label>
                        <input
                            type="text"
                            id="changeNameFirst"
                            name="changeNameFirst"
                            value={firstName}
                            onChange={handleNameFirstChange}
                            required
                        />
                        <br />
                        <label htmlFor="changeNameLast">Lastname:</label>
                        <input
                            type="text"
                            id="changeNameLast"
                            name="changeNameLast"
                            value={lastName}
                            onChange={handleNameLastChange}
                            required
                        />
                        <br />
                        <Button variant="primary" onClick={handleNameConfirm}>
                            Change Name
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showModal === ModalTypes.RECOMMEND} onHide={handleNameCancel}>
                <Modal.Header>
                    <Modal.Title>Recommended Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {recommendations}
                </Modal.Body>
                <Button variant="danger" onClick={()=>setShowModal(ModalTypes.Clear)}>
                        Close
                </Button>
            </Modal>
            <Modal show={showModal === ModalTypes.RECEIPTS} onHide={()=>setShowModal(ModalTypes.Clear)}>
                <Modal.Header>
                    <Modal.Title>Receipts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {receiptList}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={()=>setShowModal(ModalTypes.Clear)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Profile;
