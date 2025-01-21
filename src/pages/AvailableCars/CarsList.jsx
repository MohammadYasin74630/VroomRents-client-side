import { IoCheckmarkOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useAsyncValue } from "react-router-dom";


function CarsList() {

  const data = useAsyncValue()

  if (data.data.error || data.data.totalItemCount === 0) {
    return <p className="text-center mt-5">No Data Found !</p>
  }

  return (
    <>
      <div className="md:w-11/12 mx-auto ">

        {
          data.data.doc.map(
            car => <div key={car._id}>
              <div className="md:space-y-3 flex p-4 justify-evenly">

                <div className="relative text-center overflow-hidden">
                  <div>
                    <div className="relative">
                      <img className="w-72 max-sm:xl:max-h-48 max-[1100px]:mt-8 xl:w-[450px] xl:h-60 object-cover rounded-md mx-autos" src={car.images[0]} alt="" />

                      <Link className="border border-teal-500 py-2 px-4 rounded-sm font-semibold bg-teal-500 active:scale-90 transition-[transform] mt-3 text-sm text-nowrap hidden sm:max-[1100px]:block absolute bottom-1 left-1/2 -translate-x-1/2" to={`/car-details/${car._id}`}>RENT IT</Link>
                    </div>
                    <p className="inline-flex items-center gap-1 line-clamp-1 text-xs bg-emerald-900 px-2 py-1 rounded-sm absolute max-[1100px]:top-0 left-0 min-[1100px]:bottom-2 min-[1100px]:left-2 font-medium"><FaLocationDot className="max-sm:hidden" />{car.location}</p>

                  </div>

                  <Link className="border border-teal-500 py-2 px-4 rounded-sm font-semibold hover:bg-teal-500 active:scale-90 transition-[transform] mt-3 text-xs text-nowrap hidden max-sm:inline-block" to={`/car-details/${car._id}`}>RENT IT</Link>
                </div>

                <div className="min-[1100px]:w-8/12 mx-autos">

                  <div className="flex justify-between px-4">

                    <div className="min-[880px]:max-[1100px]:mt-8">

                      <div className="flex justify-between">
                        <h3 className="font-semibold">{car.brand + " " + car.model}</h3>

                        <p className="inline-flex gap-1 min-[1100px]:hidden">$<span className={`text-xl font-bold -mt-[2px] ${car.discount ? "text-teal-500" : null}`}>{car.discount ? Math.round(car.dailyPrice * (1 - car.discount / 100)) : car.dailyPrice} <span className="text-[11px] font-medium -nowrap max-sm:hidden text-white">Per Day</span></span></p>
                      </div>

                      <p className="text-sm text-gray-100 font-medium line-clamp-3 sm:line-clamp-4 mt-1 max-w-[75ch]">{car.description}</p>
                    </div>

                    <div className="max-[1100px]:hidden mx-4">
                      <p className="flex gap-1 leading-tight text-xl">$<span className={`text-5xl font-bold -mt-1 ${car.discount ? "text-teal-500" : null}`}>{car.discount ? Math.round(car.dailyPrice * (1 - car.discount / 100)) : car.dailyPrice} <span className="block text-[11px] font-medium ml-5 text-white">Per Day</span></span></p>

                      <Link className="border border-teal-500 py-2 px-4 rounded-sm font-semibold mt-4 hover:bg-teal-500 active:scale-90 transition-[transform] text-nowrap block" to={`/car-details/${car._id}`}>RENT IT</Link>
                    </div>

                  </div>

                  <div className="px-4 p-4">
                    <hr className="border-teal-500 border-opacity-15" />
                  </div>

                  <div className="text-xs grid grid-cols-2 md:grid-cols-3 items-center justify-between gap-1 px-4">
                    {
                      car.features.map(
                        (feature, idx) => <span className="inline-flex items-center gap-1" key={idx}><IoCheckmarkOutline className="text-lg font-bold" />{feature}</span>
                      )
                    }
                  </div>

                </div>

              </div>

              <div className="p-4">
                <hr className="border-teal-500 border-opacity-30" />
              </div>

            </div>
          )
        }

      </div>
    </>
  )
}

export default CarsList