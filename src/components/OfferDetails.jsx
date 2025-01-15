import { MdInfoOutline } from "react-icons/md";
import { Tooltip } from 'react-tooltip';
import { IoCloseCircleOutline } from "react-icons/io5";

function OfferDetails({ item, dialogRef, closeDialog }) {


    return (
        <>
            <dialog className="bg-transparent pt-4 backdrop:bg-emerald-900 backdrop:bg-opacity-50 backdrop:blur-sm z-50 overflow-x-hidden" ref={dialogRef} >

                <div className="border border-teal-800 relative text-white bg-emerald-900 rounded-2xl shadow-sm">

                    <img className=" min-[440px]:max-w-96  min-[440px]:max-h-96 object-cover object-center rounded-2xl " src={item?.carImage} alt="" />

                    <div className="rounded-2xl absolute bottom-0 p-2 min-[310px]:p-4  bg-black bg-opacity-50 w-full h-full flex items-end overflow-hidden">

                        <div className="space-y-1 min-[354px]:space-y-4 mt-4">

                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">{item?.title}</h3>
                                <MdInfoOutline className="text-xl" data-tooltip-id="my-tooltip" data-tooltip-html="Discount will apply after <br />( min & max rental days ) <br />conditions are met" />
                            </div>
                            <p className="font-medium text-gray-200 line-clamp-6">{item?.description}</p>

                            <div className="flex justify-between items-center flex-wrap gap-1 min-[350px]:gap-4">
                                <div className="leading-tight">
                                    <p className="font-semibold">DISCOUNT</p>
                                    <p className=" font-medium text-gray-200"> {item?.discountPercentage}%</p>
                                </div>
                                <div className="leading-tight">
                                    <p className="font-semibold">OFFER EXPIRE DAY</p>
                                    <p className=" font-medium text-gray-200"> {new Date(item?.validUntil).toDateString()}</p>
                                </div>
                            </div>


                            <div className="flex justify-between items-center flex-wrap gap-1 min-[350px]:gap-4">
                                <div className="leading-tight">
                                    <p className="font-semibold w-max">MINIMUM RENTAL</p>
                                    <p className=" font-medium text-gray-200"> {item?.minRentalDays} DAYS</p>
                                </div>
                                <div className="leading-tight">
                                    <p className="font-semibold w-max">MAXIMUM RENTAL</p>
                                    <p className=" font-medium text-gray-200"> {item?.maxRentalDays} DAYS</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <button className="text-3xl text-teal-500 absolute -top-3 -right-[3px]  z-10" onClick={closeDialog}>
                        <IoCloseCircleOutline />
                    </button>

                </div>

                <Tooltip className="z-50" id="my-tooltip" positionStrategy="fixed" />
                
            </dialog>

        </>
    )
}

export default OfferDetails