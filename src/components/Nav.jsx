import { Link, NavLink } from "react-router-dom"
import { FaRegUser } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { IoCarSportOutline } from "react-icons/io5";
import { BiSolidCarMechanic } from "react-icons/bi";
import { TbBrandBooking } from "react-icons/tb";
import { MdOutlineCarRental } from "react-icons/md";
import logo from "../assets/car logo (3).webp"

function Nav() {

    const links = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/available-cars">Available cars</NavLink></li>
        <li><Link to="#">Testimonials</Link></li>
        <li><Link to="#">About us</Link></li>
        <li><Link to="#">Contact us</Link></li>
    </>

    return (
        <>
            <div className="drawer sticky top-0">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="navbar ">
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
                            <Link className="btn btn-ghost text-xl" to="/">VroomRents</Link>
                        </div>
                        <div className="navbar-center hidden lg:flex">
                            <ul className="menu menu-horizontal px-1">
                                {links}
                            </ul>
                        </div>
                        <div className="navbar-end relative">

                            <div className="group" tabIndex={0}>
                                <div className="avatar placeholder cursor-pointer">
                                    <div className="bg-emerald-800 text-white w-12 rounded-full">
                                        <FaRegUser />
                                    </div>
                                </div>

                                <div className="text-white absolute top-14 right-0 rounded-xl border border-teal-900 overflow-hidden group-focus-within:visible invisible" tabIndex={0}>

                                    <div className="flex items-center gap-2 py-3 px-4 -mb-4">
                                        <div className="bg-emerald-800 text-white w-12 h-12 rounded-full inline-flex items-center justify-center">
                                            <span>SY</span>
                                        </div>

                                        <div className="text-sm">
                                            <p>Mohammad yasin</p>
                                            <p className="text-teal-500">Seller</p>
                                        </div>
                                    </div>

                                    <div className="divider before:bg-teal-900 after:bg-teal-900 "></div>

                                    <NavLink
                                        className="pt-3 pb-2 px-4 flex items-center gap-2 hover:bg-emerald-800 -mt-6"
                                        to="/profile">
                                        <FaRegUserCircle className="text-2xl text-teal-500" /> Profile
                                    </NavLink>
                                    <NavLink
                                        className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                        to="/add-cars">
                                        <IoCarSportOutline className="text-2xl text-teal-500" /> Add cars
                                    </NavLink>
                                    <NavLink
                                        className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                        to="/my-cars">
                                        <BiSolidCarMechanic className="text-2xl text-teal-500" /> My cars
                                    </NavLink>
                                    <NavLink
                                        className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                        to="/my-bookings">
                                        <TbBrandBooking className="text-2xl text-teal-500" /> My bookings
                                    </NavLink>
                                    <NavLink
                                        className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800"
                                        to="/my-rentals">
                                        <MdOutlineCarRental className="text-3xl -ml-1 text-teal-500" /> My rentals
                                    </NavLink>
                                    <Link className="py-2 px-4 flex items-center gap-2 hover:bg-emerald-800">
                                        <IoLogOutOutline className="text-2xl text-teal-500" /> Logout
                                    </Link>
                                </div>
                            </div>
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