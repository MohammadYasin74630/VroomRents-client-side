import booking from "../../assets/booking.webp"
import renting from "../../assets/renting.webp"
import support from "../../assets/support.webp"

function Services() {
    return (
        <div className="w-11/12 mx-auto mt-7">
            <h2 className="font-bold text-teal-500 text-center mt-16">What VroomRents Offers</h2>

            <p className="text-md sm:text-3xl md:text-4xl font-extrabold text-center my-3">Car Booking & Earning Opportunities</p>

            <div className="grid xl:grid-cols-5 gap-4 py-6 ">

                <div className="grid gap-4 xl:col-span-3 justify-center xl:ml-auto">

                    <div className="flex max-[740px]:flex-col gap-4 border border-teal-800 p-4 rounded-xl bg-teal-900">
                        <img className="max-w-96 w-[80vmin] object-cover rounded-lg mix-blend-hard-light" src={booking} width={3000} height={2000} />
                        <div>
                            <h3 className="text-xl font-bold text-center">Car Booking</h3>
                            <ul className="pt-2 max-w-[30ch] grid min-[300px]:grid-cols-2 gap-3 justify-center mx-auto">
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="font-medium">Browse a Wide Selection of Cars</span>
                                </li>
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="font-medium">Instant Online Booking</span>
                                </li>
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="font-medium">Flexible Pickup & Drop-off</span>
                                </li>
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="font-medium">Exclusive Discounts on Booking</span>
                                </li>
                            </ul>
                        </div>
                    </div>


                    <div className="flex max-[740px]:flex-col gap-4 border border-teal-800 p-4 rounded-xl bg-teal-900 ">
                        <img className="max-w-96 w-[80vmin] object-cover rounded-lg mix-blend-hard-light" src={renting} width={3000} height={2000} />
                        <div>
                            <h3 className="text-xl font-bold text-center">Car Rental</h3>
                            <ul className="pt-2 max-w-[30ch] grid min-[300px]:grid-cols-2 gap-3 justify-center mx-auto">
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="font-medium">Easy Listing Process</span>
                                </li>
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="font-medium">Earn Passive Income</span>
                                </li>
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="font-medium">Full Control Over Your Rental</span>
                                </li>
                                <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                    <span className="mx-auto">Verified & Secure</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="flex flex-col min-[740px]:max-xl:flex-row gap-4 border border-teal-800 p-4 rounded-xl bg-teal-900 w-max xl:col-span-2 max-xl:mx-auto">
                    <img className="max-w-96 w-[80vmin] object-cover rounded-lg mix-blend-hard-light" src={support} width={3000} height={2000} />
                    <div>
                        <h3 className="text-xl font-bold text-center">Support Team</h3>
                        <ul className="pt-2 max-w-[30ch] grid min-[300px]:grid-cols-2 gap-3 justify-center mx-auto">
                            <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                <span className="font-medium">24/7 Roadside Assistance</span>
                            </li>
                            <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                <span className="font-medium">Emergency Car Replacement</span>
                            </li>
                            <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                <span className="font-medium">Hassle-Free Car Delivery & Pickup</span>
                            </li>
                            <li className='w-28 h-28 text-xs bg-teal-500 rounded-full text-center flex items-center'>
                                <span className="font-medium">Dedicated Customer Support</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Services