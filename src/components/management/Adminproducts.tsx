import React, { useEffect, useState, useCallback, ChangeEvent } from 'react'
import { addAdminCategoryAsync, addAdminProductsAsync, editAdminProductsAsync, getAdminProductsAsync, get_admin_categories, get_admin_products, removeAdminCategoryAsync, removeAdminProductsAsync, selectastatus, updateStatus } from './managementSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { get_user_token, is_user_logged, user_force_logout } from '../login/loginSlice';
import { TargetServer, isTokenExpired } from '../settings/settings';
import { Message } from '../../Message';
import { Button, Modal } from 'react-bootstrap';
import { AllProductDetails } from './managementSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faClose, faEdit, faMinusCircle, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';



const AdminModalTypes = {
    Clear: 0,
    VIEW_PRODUCT: 1,
    EDIT_PRODUCT: 2,
    NEW_PRODUCT: 3,
    NEW_CATEGORY: 4,
    REMOVE_CATEGORY: 5,
};

const Adminproducts = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectastatus);
    const allproducts = useAppSelector(get_admin_products)
    const allcategories = useAppSelector(get_admin_categories)
    const token = useAppSelector(get_user_token)
    const islogged = useAppSelector(is_user_logged)
    const [displayprods, setdisplayprods] = useState<JSX.Element | string>('');
    const [showModal, setshowModal] = useState(AdminModalTypes.Clear)
    const [currentProduct, setCurrentProduct] = useState<AllProductDetails | null>();
    const [FormDATA, setFormDATA] = useState({
        name: '',
        desc: '',
        price: 0,
        category: '',
        img: null, // Assuming the image is a file, set it to null or provide a default value.
        ...currentProduct,
    });
    const [newProdDATA, setnewProdDATA] = useState({
        name: '',
        desc: '',
        price: 0,
        category: '',
        img: null,
        type: '',
    });
    const [catdesc, setcatdesc] = useState('')
    const [removecat, setremovecat] = useState(0)


    const GetCategoryName = useCallback((category: number) => {
        const foundCategory = allcategories.find((cat) => cat.id === category);
        return foundCategory ? foundCategory.desc : 'Category Not Found';
    }, [allcategories]);



    const GetProduct = useCallback((product: number) => {
        const foundProduct = allproducts.find((p) => p.id === product);
        return foundProduct ? foundProduct : null;
    }, [allproducts]);

    const manage_product = useCallback((product: number) => {
        let fproduct = GetProduct(product);
        if (fproduct) {
            setCurrentProduct(fproduct);
            setshowModal(AdminModalTypes.VIEW_PRODUCT);

        } else {
            setCurrentProduct(null);
            Message('Product Was Not Found', 'error');
        }
    }, [GetProduct]);

    const close_productmodal = () => {
        setshowModal(AdminModalTypes.Clear)
        // setshowSecondModal(false)
    }

    const handleEditChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormDATA((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }));
    };



    const handleEditImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) setFormDATA((prevData) => ({
            ...prevData,
            [event.target.name]: file,
        }));;
    };


    const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (!currentProduct) return
        event.preventDefault();
        let formData = new FormData();
        formData.append('type', 'product');
        formData.append('name', FormDATA.name);
        formData.append('desc', FormDATA.desc);
        formData.append('price', FormDATA.price.toString());
        formData.append('category', String(FormDATA.category));
        if (FormDATA.img !== null) {
            const productid = currentProduct.id
            formData.append('img', FormDATA.img);
            dispatch(editAdminProductsAsync({ formData, token, productid }))
            close_productmodal()
        } else {
            Message("You must add a Picture", "error");
        }

    };

    useEffect(() => {
        if(islogged && isTokenExpired(token)){
          dispatch(user_force_logout());
        }
      
    
      }, [islogged, token, dispatch])


    useEffect(() => {
        dispatch(updateStatus("pending"))
        dispatch(getAdminProductsAsync(token))
    }, [dispatch, token])

    useEffect(() => {
        if (status === "done" && allproducts && allproducts.length > 0) {
            let element =
                <div className="container mt-4">
                    <ul className="list-group">
                        <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
                            {allproducts.map((prod, index) => (
                                <div key={index} className="col-md-4" style={{ padding: "15px", flex: "1 0 300px" }}>
                                    <div className="card" style={{ height: "100%" }}>
                                        <img style={{ width: "150px", height: "150px" }} className="img-fluid card-img-top" src={`${TargetServer}static${prod.img}`} alt="Product"></img>
                                        <div className="card-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <div>
                                                <h5 className="card-title">{prod.name}</h5>
                                                <p className="card-text">Description: {prod.desc}</p>
                                                <p className="card-text">Price: ${prod.price}</p>
                                                <p className="card-text">Category: {prod.category} - {GetCategoryName(prod.category)}</p>
                                            </div>
                                            <br/>
                                            <button className="btn btn-sm btn-primary shorter-button" onClick={() => { manage_product(prod.id) }}>
                                                <FontAwesomeIcon icon={faEdit} /> Manage
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </ul>
                </div>

            setdisplayprods(element)
        }

    }, [status, allproducts, allcategories, GetCategoryName, manage_product])

    const addProduct = () => {
        setshowModal(AdminModalTypes.NEW_PRODUCT)
    }

    const handleAddChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setnewProdDATA((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }));
    };

    const handleAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('type', 'product');
        formData.append('name', newProdDATA.name);
        formData.append('desc', newProdDATA.desc);
        formData.append('price', newProdDATA.price.toString());
        formData.append('category', newProdDATA.category);
        if (newProdDATA.img !== null) {
            formData.append('img', newProdDATA.img);
            dispatch(addAdminProductsAsync({ formData, token }));
            close_productmodal()
        } else {
            Message("You must add a Picture", "error");
        }

    };

    const handleAddImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) setnewProdDATA((prevData) => ({
            ...prevData,
            [event.target.name]: file,
        }));;
    };

    const deleteProduct = (productid: number) => {
        if (productid <= 0) return Message("Product Not Found", "error")
        close_productmodal()
        dispatch(removeAdminProductsAsync({ productid: productid, token: token }))
    }

    const addCategory = () => {
        setshowModal(AdminModalTypes.NEW_CATEGORY)
    }


    const handleCatAddSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!catdesc || catdesc === "") {
            Message("You must specify a Category Description", "error")
            return
        }

        const formData = new FormData();
        formData.append('desc', catdesc);
        formData.append('type', "category");

        close_productmodal()
        dispatch(addAdminCategoryAsync({ formData, token }));
    }

    const removeCategory = () => {
        setshowModal(AdminModalTypes.REMOVE_CATEGORY)
    }

    const handleRemoveCatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const category = removecat
        let formData = new FormData();
        formData.append('type', 'delcategory');
        formData.append('categoryid', category.toString());
        dispatch(removeAdminCategoryAsync({ formData, token: token }))
    }

    const categoryOptions = allcategories && allcategories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.desc}</option>
    ));

    return (
        <div style={{ textAlign: 'center' }}>
            {status === "done" ? (
                <div>
                    <div className="text-center mt-3">
                        <button className="btn btn-primary" onClick={() => addProduct()}>Add Product <FontAwesomeIcon icon={faPlus} /></button>
                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={() => addCategory()}>Add Category <FontAwesomeIcon icon={faPlusCircle} /></button>
                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={() => removeCategory()}>Remove Category <FontAwesomeIcon icon={faMinusCircle} /></button>
                    </div>

                    {displayprods}
                </div>
            ) : <h2 style={{ margin: 'auto' }}>Products Not Loaded Yet.</h2>}
            <Modal show={showModal === AdminModalTypes.VIEW_PRODUCT && currentProduct !== null} onHide={() => close_productmodal()}>
                {currentProduct && (
                    <Modal.Header>
                        <Modal.Title>{currentProduct.id} - {currentProduct.name}</Modal.Title>
                    </Modal.Header>
                )}
                <Modal.Body>
                    <Button style={{ marginRight: "10px" }} variant="primary" onClick={() => setshowModal(AdminModalTypes.EDIT_PRODUCT)}>
                        Edit <FontAwesomeIcon icon={faEdit} />
                    </Button>

                    {currentProduct && (
                        <Button style={{ marginRight: "10px" }} variant="danger" onClick={() => deleteProduct(currentProduct.id)}>
                            Delete <FontAwesomeIcon icon={faBan} />
                        </Button>
                    )}


                    <Button variant="secondary" onClick={() => close_productmodal()}>
                        Close <FontAwesomeIcon icon={faClose} />
                    </Button>
                </Modal.Body>
            </Modal>
            <Modal show={showModal === AdminModalTypes.EDIT_PRODUCT} onHide={() => close_productmodal()}>
                <Modal.Header>
                    {currentProduct && (
                        <Modal.Title>
                            {currentProduct.id} - {currentProduct.name}
                        </Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditSubmit}>
                        <label htmlFor="editProductName">Name:</label>
                        <input
                            type="text"
                            id="editProductName"
                            name="name"
                            value={FormDATA.name}
                            onChange={handleEditChange}
                            required
                        />
                        <br />
                        <label htmlFor="editProductDesc">Description:</label>
                        <input
                            type="text"
                            id="editProductDesc"
                            name="desc"
                            value={FormDATA.desc}
                            onChange={handleEditChange}
                            required
                        />
                        <br />
                        <label htmlFor="editProductPrice">Price:</label>
                        <input
                            type="number"
                            id="editProductPrice"
                            name="price"
                            value={FormDATA.price}
                            onChange={handleEditChange}
                            required
                        />
                        <br />
                        <label htmlFor="edit_category">Category:</label>
                        <select
                            name="category"
                            required
                            id="edit_category"
                            value={FormDATA.category}
                            onChange={(event) => handleEditChange(event)}
                        >
                            <option value="">
                                ---------
                            </option>
                            {categoryOptions}
                        </select>
                        <br />
                        <label htmlFor="editProductImage">Image (PNG format, max 2MB):</label>
                        <input
                            type="file"
                            id="editProductImage"
                            name="img"
                            accept=".png"
                            onChange={handleEditImageChange}
                            required
                        />
                        <br />
                        <hr />
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showModal === AdminModalTypes.NEW_PRODUCT} onHide={() => close_productmodal()}>
                <Modal.Header>
                    <Modal.Title>
                        New Product
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleAddSubmit}>
                        <label htmlFor="addProductName">Name:</label>
                        <input
                            type="text"
                            id="addProductName"
                            name="name"
                            value={newProdDATA.name}
                            onChange={handleAddChange}
                            required
                        />
                        <br />
                        <label htmlFor="addProductDesc">Description:</label>
                        <input
                            type="text"
                            id="addProductDesc"
                            name="desc"
                            value={newProdDATA.desc}
                            onChange={handleAddChange}
                            required
                        />
                        <br />
                        <label htmlFor="addProductPrice">Price:</label>
                        <input
                            type="number"
                            id="addProductPrice"
                            name="price"
                            value={newProdDATA.price}
                            onChange={handleAddChange}
                            required
                        />
                        <br />
                        <label htmlFor="add_category">Category:</label>
                        <select
                            name="category"
                            required
                            id="add_category"
                            value={newProdDATA.category}
                            onChange={(event) => handleAddChange(event)}
                        >
                            <option value="">
                                ---------
                            </option>
                            {categoryOptions}
                        </select>
                        <br />
                        <label htmlFor="addProductImage">Image (PNG format, max 2MB):</label>
                        <input
                            type="file"
                            id="addProductImage"
                            name="img"
                            accept=".png"
                            onChange={handleAddImageChange}
                            required
                        />
                        <br />
                        <hr />
                        <button type="submit" className="btn btn-primary">
                            Create Product
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showModal === AdminModalTypes.NEW_CATEGORY} onHide={() => close_productmodal()}>
                <Modal.Header>
                    <Modal.Title>
                        New Category
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleCatAddSubmit}>
                        <label htmlFor="addCatDesc">Description:</label>
                        <input
                            type="text"
                            id="addCatDesc"
                            name="desc"
                            value={catdesc}
                            onChange={(e) => setcatdesc(e.target.value)}
                            required
                        />
                        <br />
                        <hr />
                        <button type="submit" className="btn btn-primary">
                            Create Category
                        </button>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showModal === AdminModalTypes.REMOVE_CATEGORY} onHide={() => close_productmodal()}>
                <Modal.Header>
                    <Modal.Title>
                        Choose A Category To Remove
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleRemoveCatSubmit}>
                        <label htmlFor="edit_category">Category:</label>
                        <select
                            name="category"
                            required
                            id="remove_category"
                            value={removecat}
                            onChange={(e) => setremovecat(Number(e.target.value))}
                        >
                            <option value="">
                                ---------
                            </option>
                            {categoryOptions}
                        </select>
                        <br />
                        <hr />
                        <button type="submit" className="btn btn-primary">
                            Remove Category
                        </button>
                    </form>

                </Modal.Body>
                <Button variant="danger" onClick={() => close_productmodal()}>
                    Close
                </Button>
            </Modal>
        </div>
    )
}

export default Adminproducts