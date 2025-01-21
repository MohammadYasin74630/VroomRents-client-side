import { Link, NavLink, useNavigate } from "react-router-dom"
import { FaRegUser } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { IoCarSportOutline } from "react-icons/io5";
import { BiSolidCarMechanic } from "react-icons/bi";
import { TbBrandBooking } from "react-icons/tb";
import { MdOutlineCarRental } from "react-icons/md";
import logo from "../assets/car logo (3).webp"
import { useContext } from "react";
import { authContext } from "../utils/AuthProvider";
import toast from "react-hot-toast";
import useAxios from "../hook/useAxios";
import Cookies from 'js-cookie';

function Nav() {

    const { user, logout } = useContext(authContext)
    const myAxios = useAxios()
    const navigate = useNavigate()

    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const links = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/available-cars">Available cars</NavLink></li>
        <li><Link to="#">Testimonials</Link></li>
        <li><Link to="#">About us</Link></li>
        <li><Link to="#">Contact us</Link></li>
    </>

    return (
        <>
            <div className="drawer sticky top-0 shadow-sm shadow-emerald-900 bg-teal-900 z-50 md:px-10 rounded-b-md border-b border-emerald-800">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="navbar">
                        <div className="navbar-start">
                            <div className="flex-none lg:hidden">
                                <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="inline-block h-6 w-6 stroke-current">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </label>
                            </div>
                            <Link className="btn btn-ghost text-lg lg:text-xl max-lg:-ml-4" to="/">VroomRents</Link>
                        </div>
                        <div className="navbar-center hidden lg:flex">
                            <ul className="menu menu-horizontal px-1">
                                {links}
                            </ul>
                        </div>
                        <div className="navbar-end relative ">

                            {
                                user ? <div className="group" tabIndex={0}>
                                    <div className="avatar placeholder cursor-pointer">
                                        <div className="bg-emerald-800 text-white w-12 rounded-full">
                                            <FaRegUser />
                                        </div>
                                    </div>

                                    <div className="text-white absolute top-14 right-0 rounded-xl border border-emerald-950 min-w-52 max-w-96 text-wrap overflow-hidden group-focus-within:visible invisible bg-emerald-900" tabIndex={0}>

                                        <div className="flex items-center gap-2 py-3 px-4 -mb-4">
                                            <div className="bg-teal-500 text-white w-12 h-12 rounded-full inline-flex items-center justify-center overflow-hidden">

                                                {
                                                    user?.photoURL ? <img className="h-full w-full object-cover" src={user?.photoURL} alt="" /> : <span>{user?.displayName?.[0].toUpperCase() || "A"}</span>
                                                }

                                            </div>

                                            <div className="text-sm w-9/12">
                                                <p className="line-clamp-1">{user?.displayName || "Anonymous"}</p>
                                                <p className="text-teal-500">{Cookies.get('role') === "vendor" ? "Seller" : "Buyer"}</p>
                                            </div>
                                        </div>

                                        <div className="divider before:bg-teal-500/30 after:bg-teal-500/30 mt-2"></div>

                                        <NavLink
                                            className="pt-3 pb-2 px-4 flex items-center gap-2 hover:bg-emerald-800 -mt-6"
                                            to="/update-account">
                                            <FaRegUserCircle className="text-2xl text-teal-500" /> Profile
                                        </NavLink>
                                        {
                                            Cookies.get("role") === "vendor" ? <>
                                                <NavLink
                                                    className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                                    to="/add-car">
                                                    <IoCarSportOutline className="text-2xl text-teal-500" /> Add cars
                                                </NavLink>
                                                <NavLink
                                                    className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                                    to="/my-cars">
                                                    <BiSolidCarMechanic className="text-2xl text-teal-500" /> My cars
                                                </NavLink>
                                                <NavLink
                                                    className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                                    to="/my-rentals">
                                                    <MdOutlineCarRental className="text-3xl -ml-1 text-teal-500" /> My rentals
                                                </NavLink>
                                            </> : <NavLink
                                                className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                                to="/my-bookings">
                                                <TbBrandBooking className="text-2xl text-teal-500" /> My bookings
                                            </NavLink>
                                        }

                                        <button className="py-2 px-4 w-full flex items-center gap-[7px] translate-x-[2px] hover:bg-emerald-800" onClick={
                                            () => {
                                                logout()
                                                    .then(() => {

                                                        myAxios.delete("http://localhost:3000/jwt")
                                                            .then(() => {
                                                                success("logout successfully")
                                                                navigate("/")
                                                            })
                                                    })
                                                    .catch(err => error(err))
                                            }
                                        }>
                                            <IoLogOutOutline className="text-2xl text-teal-500" /> Logout
                                        </button>
                                    </div>
                                </div> : <NavLink
                                    className="max-[284px]:w-min py-2 px-3 rounded-lg text-sm hover:bg-base-content/10"
                                    to="/my-account"> Login & Register
                                </NavLink>
                            }
                        </div>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-emerald-950 min-h-full w-64 md:w-80 p-4">
                        {/* Sidebar content here */}
                        <p className="text-center text-xl font-bold">VroomRents</p>
                        <img src={logo} alt="" />
                        <p className="text-center">Your Journey, Our Wheels!</p>

                        <p className="pl-1 pt-6 pb-3 text-lg font-semibold">Menu List:</p>
                        {links}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Nav