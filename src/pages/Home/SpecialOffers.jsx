import { Link, useAsyncValue } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import OfferDetails from '../../components/OfferDetails'

function SpecialOffers() {

    const data = useAsyncValue()
    const dialogRef = useRef()
    const [item, setItem] = useState(null)

    const showDialog = (item) => {
        setItem(item)
    }

    const closeDialog = () => {
        dialogRef.current.close()
        setItem(null)
    }

    useEffect(
        () => {

            if (item) {
                dialogRef.current.showModal()
            }

        }, [item]
    )

    return (
        <>
            <h2 className="font-bold text-teal-500 text-center mt-16">Special Offers</h2>
            <p className="text-md sm:text-3xl md:text-4xl font-extrabold text-center my-3 px-1">Unbeatable Deals for Your Next Adventure!</p>

            <div className={`w-11/12 mx-auto mt-6 ${data.data.length !== 0 ? " grid" : null} grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5  gap-4`}>

                {
                    data.data.map((item, idx) => <div key={item?._id} className={`border border-teal-800 bg-teal-900 p-3 sm:p-4 rounded-2xl ${idx + 1 === 9 ? "lg:hidden 2xl:block" : idx + 1 === 10 ? "min-[770px]:hidden 2xl:block" : null}`}>

                        <div className="relative rounded-2xl group">

                            <div className="rounded-2xl overflow-hidden relative">
                                <img className="w-96 h-40 object-cover object-center rounded-2xl mx-auto " src={item?.carImage} alt="" />

                                <div className="absolute bottom-0 p-3 w-full bg-black bg-opacity-80">
                                    <p className="font-bold line-clamp-1 text-center">{item?.title}</p>
                                    <p className="text-[0px] font-semibold text-gray-200 line-clamp-2 group-hover:text-sm transition-[font-size]">{item?.description}</p>
                                </div>
                            </div>

                            <span className="text-sm bg-teal-700 px-3 rounded-full font-semibold text-gray-100 absolute -bottom-[10px] left-1/2 -translate-x-1/2 z-10">{item.discountPercentage}% OFF</span>
                        </div>

                        <div className="flex items-center justify-between gap-[2px] mt-5 text-sm font-semibold text-nowrap">
                            <Link className="bg-teal-600 px-3 py-1 rounded-2xl focus:text-emerald-400 text-center">Book Now</Link>
                            <button className="bg-teal-600 px-3 py-1 rounded-2xl text-center" onClick={() => showDialog(item)}>Offer Detail</button>
                        </div>

                    </div>)
                }

                {
                    data.data.length === 0 ? <p className="text-center text-red-500 mt-5">No Offers Found !</p> : null
                }

            </div>

            <OfferDetails item={item} dialogRef={dialogRef} closeDialog={closeDialog} />

        </>
    )
}

export default SpecialOffers