import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {

    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    return (

        <header className="navbar">

            <div className="logo">

                <Link
                    to="/"
                    style={{
                        textDecoration: "none",
                        color: "inherit"
                    }}
                >

                    <h2>

                        Jua Kali <span>Connect</span>

                    </h2>

                </Link>

            </div>

            <nav>

                <ul className="nav-links">

                    <li>

                        <Link to="/">

                            Home

                        </Link>

                    </li>

                    <li>

                        <Link to="/artisans">

                            Find Artisan

                        </Link>

                    </li>

                    <li>

                        <Link to="/training">

                            Training

                        </Link>

                    </li>

                    <li>

                        <Link to="/pricing">

                            Pricing

                        </Link>

                    </li>

                    <li>

                        <Link to="/about">

                            About

                        </Link>

                    </li>

                    <li>

                        <Link to="/contact">

                            Contact

                        </Link>

                    </li>

                </ul>

            </nav>

            <div className="nav-buttons">

                {user ? (

                    <>

                        <span
                            style={{
                                marginRight: "15px",
                                fontWeight: "600"
                            }}
                        >

                            Welcome, {user.name}

                        </span>

                        <Link

                            to={user.role === "customer"
                                ? "/dashboard"
                                : "/admin"}

                            className="btn-outline"

                        >

                            Dashboard

                        </Link>
                        <button

    onClick={toggleTheme}

    className="btn-outline"

>

    {theme === "light"

        ? "🌙 Dark"

        : "☀️ Light"}

</button>

                        <button

                            className="btn-primary"

                            onClick={handleLogout}

                            style={{
                                marginLeft: "10px",
                                cursor: "pointer"
                            }}

                        >

                            Logout

                        </button>

                    </>

                ) : (

                    <>

                        <Link

                            to="/login"

                            className="btn-outline"

                        >

                            Login

                        </Link>

                        <Link

                            to="/register-artisan"

                            className="btn-primary"

                        >

                            Join as Artisan

                        </Link>

                    </>

                )}

            </div>

        </header>

    );

}

export default Navbar;