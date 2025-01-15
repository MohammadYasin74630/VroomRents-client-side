import { IoCheckmarkOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useAsyncValue } from "react-router-dom";


function CarsGrid() {

    const data = useAsyncValue()

    return (
        <>
            <div className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

                {
                    data.data.doc.map(
                        car => <div className="rounded-md p-2 space-y-3" key={car._id}>
                            <div className="relative">
                                <img className="w-full h-64 object-cover rounded-md mx-auto" src={car.images[0]} alt="" />
                                <p className="inline-flex items-center gap-1 line-clamp-1 text-xs bg-emerald-900 px-2 py-1 rounded-sm absolute bottom-2 left-2 font-medium"><FaLocationDot />{car.location}</p>
                            </div>

                            <h3 className="font-semibold">{car.brand + " " + car.model}</h3>
                            <p className="text-sm text-gray-100 font-medium line-clamp-3 !mt-1">{car.description}</p>

                            <hr className="border-teal-500 border-opacity-15" />

                            <div className="text-xs grid grid-cols-2 items-center justify-between px-1">
                                {
                                    car.features.slice(0, 6).map(
                                        (feature, idx) => <span className="inline-flex items-center gap-1" key={idx}><IoCheckmarkOutline className="text-lg font-bold" />{feature}</span>
                                    )
                                }
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="flex gap-1 leading-tight text-xl">$<span className={`text-5xl font-bold -mt-1 ${car.discount ? "text-teal-500" : null}`}>{car.discount ? Math.round(car.dailyPrice * (1 - car.discount / 100)) : car.dailyPrice} <span className="block text-[11px] font-medium ml-5 text-white">Per Day</span></span></p>

                                <Link className="border border-teal-500 py-2 px-4 rounded-sm font-semibold hover:bg-teal-500 active:scale-90 transition-[transform]">RENT IT</Link>
                            </div>

                            <hr className="border-teal-500 border-opacity-30" />

                        </div>
                    )
                }

            </div>

        </>
    )
}

export default CarsGrid