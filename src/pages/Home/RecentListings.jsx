import { MdOutlineBookmarkAdded } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { Link, useAsyncValue } from "react-router-dom";

function RecentListings() {

    const data = useAsyncValue()

    return (
        <>
            <h2 className="font-bold text-teal-500 text-center mt-16">Recent Listings</h2>
            <p className="text-md sm:text-3xl md:text-4xl font-extrabold text-center my-3 px-1">Explore Our Recently Added Car Rentals</p>

            <div className={`w-11/12 mx-auto mt-6 ${data.data.length !== 0 ? "grid" : null} grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5  gap-4`}>

                {
                    data.data.map((item, idx) => <div key={item._id} className={`border border-teal-800 bg-teal-900 p-3 sm:p-4 rounded-2xl ${idx + 1 === 9 ? "lg:hidden 2xl:block" : idx + 1 === 10 ? "min-[770px]:hidden 2xl:block" : null}`}>
                        <div className="relative overflow-hidden rounded-2xl">
                            <img className="w-96 h-40 object-cover object-center rounded-2xl mx-auto hover:scale-110 transition-[transform]" src={item.image} alt="" />
                            <span className="text-sm bg-emerald-950 px-3 rounded-full font-semibold text-gray-100 absolute top-2 left-2 z-10">{item.availability ? "Available" : "N/A"}</span>
                        </div>

                        <div className="flex items-center justify-between mt-3 text-sm">
                            <Link className="text-lg font-bold focus:text-emerald-400" to="/car/:id">{item.model}</Link>
                            <p className="text-xs font-medium bg-teal-600 px-3 rounded-full py-[2px]">${item.dailyPrice}/<span className="text-xs">Day</span></p>
                        </div>

                        <div className="font-semibold text-gray-100 text-sm flex items-center justify-between mt-1">

                            <p className="inline-flex items-center gap-1 ">
                                <CiCalendarDate className="text-lg" /> {Math.round(Math.abs((new Date(item.createdAt) - new Date()) / 86400000))} days ago
                            </p>
                            <p className="inline-flex items-center gap-1 ">
                                <MdOutlineBookmarkAdded className="text-lg" /> {item.bookingCount}
                            </p>
                        </div>
                    </div>)
                }

                {
                    data.data.length === 0 ? <p className="text-center text-red-500 mt-5">Recent Listing Not Found !</p> : null
                }

            </div>
        </>
    )
}

export default RecentListings