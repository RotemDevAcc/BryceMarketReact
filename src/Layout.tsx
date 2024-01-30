// Layout.js
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { is_user_logged, user_logout, is_user_staff, get_user_details } from './components/login/loginSlice';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { TargetServer } from './components/settings/settings';
import { selectDarkMode } from './components/settings/darkModeSlice';




const Layout = () => {
    const logged = useAppSelector(is_user_logged);
    const myDetails = useAppSelector(get_user_details);
    const isstaff = useAppSelector(is_user_staff);
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [NavBar, setNavBar] = useState<JSX.Element>()
    const isDarkMode = useAppSelector(selectDarkMode);


    const [imageSrc, setImageSrc] = useState(`${TargetServer}static/images/${myDetails.img}`);

    useEffect(() => {
        setImageSrc(`${TargetServer}static/images/${myDetails.img}`)
    }, [myDetails])
    

    const placeholderImg = `${TargetServer}static/images/placeholder.png`;

    const handleImageError = () => {
        setImageSrc(placeholderImg);
    };

    const routeHeaders: Record<string, string> = {
        '/': 'Home',
        '/super': 'Supermarket Products',
        '/contact': 'Contact Us',
        '/register': 'Register Page',
        '/login': 'Login Page',
        '/profile': 'My Profile',
        // Staff Routes
        '/admin': 'Admin Home',
        '/customers': 'Customers',
        '/allproducts': 'All Products',
        '/receipts': 'All Receipts',
        '/admincontacts': 'Contact Messages'
        // Add more routes and headers as needed
    };



    useEffect(() => {
        const loc: any = location.pathname
        const adminpages = [
            "/admin",
            "/customers",
            "/allproducts",
            "/receipts",
            "/admincontacts"
        ]
        const IsAdminPage = adminpages.includes(loc);

        let navbarlist = <>
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                <NavLink to="/" className="nav-link">
                    Home
                </NavLink>
            </li>
            <li className={`nav-item ${location.pathname === '/super' ? 'active' : ''}`}>
                <NavLink to="/super" className="nav-link">
                    Products
                </NavLink>
            </li>
            <li className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>
                <NavLink to="/contact" className="nav-link">
                    Contact
                </NavLink>
            </li>
            {!logged ? (
                <li className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
                    <NavLink to="/login" className="nav-link">
                        Login
                    </NavLink>
                </li>
            ) : (
                <>
                    <li className="nav-item">
                        <span className="nav-link" onClick={() => { dispatch(user_logout()) }} style={{ cursor: "pointer", color: isDarkMode ? "#55a1ff" : "#007bff" }} >Logout</span>
                    </li>
                    <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                        <NavLink to="/profile" className="nav-link">
                            My Profile
                        </NavLink>
                    </li>
                </>
            )}
            {isstaff ?
                <li className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
                    <NavLink to="/admin" className="nav-link">
                        Admin Home
                    </NavLink>
                </li>
                : <></>}

        </>

        if (IsAdminPage) {
            navbarlist = <>
                {isstaff ? (
                    <>
                        <li className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
                            <NavLink to="/admin" className="nav-link">
                                Admin Home
                            </NavLink>
                        </li>
                        <li className={`nav-item ${location.pathname === '/customers' ? 'active' : ''}`}>
                            <NavLink to="/customers" className="nav-link">
                                Customers
                            </NavLink>
                        </li>
                        <li className={`nav-item ${location.pathname === '/allproducts' ? 'active' : ''}`}>
                            <NavLink to="/allproducts" className="nav-link">
                                All Products
                            </NavLink>
                        </li>
                        <li className={`nav-item ${location.pathname === '/receipts' ? 'active' : ''}`}>
                            <NavLink to="/receipts" className="nav-link">
                                All Receipts
                            </NavLink>
                        </li>
                        <li className={`nav-item ${location.pathname === '/admincontacts' ? 'active' : ''}`}>
                            <NavLink to="/admincontacts" className="nav-link">
                                Contact Messages
                            </NavLink>
                        </li>

                    </>
                ) : ""}
            </>

        }

        setNavBar(navbarlist)

    }, [dispatch, isstaff, location.pathname, logged, isDarkMode])


    const headerText = routeHeaders[location.pathname] || '';
    return (
        <div>
            <header className="bg-dark text-white">
                {logged ?
                    <img
                        src={imageSrc}
                        onError={handleImageError}
                        alt="Profile Logo"
                        className="navbar-brand img-fluid"
                        height="50px"
                        width="50px"
                        style={{
                            display: "block", // Added this line
                            borderRadius: "50%",
                            objectFit: "cover",
                            objectPosition: "center",
                            border: "2px solid white",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)"
                        }}
                    />
                    : <></>
                }


                <div className="container">
                    <h1>{headerText}</h1>
                    <nav>
                        <ul className="nav">
                            {NavBar}
                        </ul>
                    </nav>
                </div>
            </header>


            <Outlet />
        </div>
    );
};

export default Layout;
