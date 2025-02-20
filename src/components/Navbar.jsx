import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout()
            .then(() => {
                navigate('/login')
                Swal.fire({
                    title: "Logged Out!",
                    text: "Sign Out Successfully",
                    icon: "success"
                });
            })
    }

    return (
        <div className="bg-blue-700 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to={'/'}>
                    <h3 className="font-bold text-2xl">Task<span className="text-orange-200">s</span></h3>
                </Link>
                {
                    user ?
                        <>
                            <ul className="flex items-center gap-2 md:gap-6">
                                <li>
                                    <NavLink to={'/'}>
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/tasks'}>
                                        Tasks
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/addTask'}>
                                        Add a Task
                                    </NavLink>
                                </li>
                            </ul>
                            <button onClick={handleLogout} className="btn btn-outline text-white">Logout</button>
                        </>
                        :
                        <Link to={'/login'}>
                            <button className="btn btn-secondary">Login</button>
                        </Link>
                }
            </div>
        </div>
    );
};

export default Navbar;