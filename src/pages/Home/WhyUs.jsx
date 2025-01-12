import quality from "../../assets/car-quality.png"
import insurance from "../../assets/car-insurance.png"
import schedule from "../../assets/car-schedule.png"
import cost from "../../assets/car-no-charge.png"
import service from "../../assets/car-service.png"

function WhyUs() {
    return (
        <>
            <h2 className="font-bold text-teal-500 text-center mt-16">Why Choose VroomRents</h2>
            <p className="text-md sm:text-3xl md:text-4xl font-extrabold text-center my-3">For Excellence and Reliability!</p>

            <div className="grid grid-cols-1 min-[450px]:grid-cols-2 min-[770px]:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 items-center justify-center w-11/12 mx-auto mt-7">

                <div className="border border-teal-800 px-2 py-10 rounded-2xl text-center bg-teal-900 h-full">
                    <img className="w-40 mx-auto rounded-2xl" src={quality} alt="" />
                    <p className="text-xl font-bold pt-2">Quality Assured</p>
                    <p className="pt-2 max-w-[30ch] mx-auto font-semibold text-gray-200">All vehicles undergo rigorous maintenance and safety checks.</p>
                </div>

                <div className="border border-teal-800 px-2 py-10 rounded-2xl text-center bg-teal-900 h-full">
                    <img className="w-40 mx-auto rounded-2xl" src={insurance} alt="" />
                    <p className="text-xl font-bold pt-2">Insurance Protect</p>
                    <p className="pt-2 max-w-[30ch] mx-auto font-semibold text-gray-200">Comprehensive insurance coverage for your peace of mind.</p>
                </div>

                <div className="border border-teal-800 px-2 py-10 rounded-2xl text-center bg-teal-900 h-full">
                    <img className="w-40 mx-auto rounded-2xl" src={schedule} alt="" />
                    <p className="text-xl font-bold pt-2">Flexible Rental </p>
                    <p className="pt-2 max-w-[30ch] mx-auto font-semibold text-gray-200">Choose daily, weekly, or monthly rentals to fit your plans.</p>
                </div>

                <div className="border border-teal-800 px-2 py-10 rounded-2xl text-center bg-teal-900 h-full min-[770px]:hidden xl:block">
                    <img className="w-40 mx-auto rounded-2xl" src={cost} alt="" />
                    <p className="text-xl font-bold pt-2">No Booking Charges</p>
                    <p className="pt-2 max-w-[30ch] mx-auto font-semibold text-gray-200">Transparent pricing with zero hidden fees at checkout.</p>
                </div>

                <div className="border border-teal-800 px-2 py-10 rounded-2xl text-center bg-teal-900 h-full max-2xl:hidden">
                    <img className="w-40 mx-auto rounded-2xl" src={service} alt="" />
                    <p className="text-xl font-bold pt-2">Best Services</p>
                    <p className="pt-2 max-w-[30ch] mx-auto font-semibold text-gray-200">Exceptional service tailored to your rental needs.</p>
                </div>

            </div>
        </>
    )
}

export default WhyUs