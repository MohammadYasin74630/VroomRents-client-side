import { MdDirectionsCarFilled, MdCarRental, MdCarCrash } from "react-icons/md";

function Services() {
    return (
        <div className="w-11/12 mx-auto mt-7">
            <h2 className="font-bold text-teal-500 mt-16 text-center">What VroomRents Offers</h2>

            <p className="text-md sm:text-3xl md:text-4xl font-extrabold my-3 text-center">Car Booking & Earning Opportunities</p>

            <div className="grid lg:grid-cols-3 gap-4 pt-3">

                <div className="bg-teal-900 border border-teal-800 rounded-xl sm:max-lg:grid grid-cols-5 items-center">

                    <div className="col-span-2">
                        <MdDirectionsCarFilled className="text-teal-100 text-8xl mx-auto" />
                        <h3 className="text-xl font-bold text-center">Car Booking</h3>
                    </div>

                    <ul className="list-disc px-10 py-6 space-y-2 col-span-3 lg:w-max lg:mx-auto">
                        <li>
                            <span className="font-medium">Browse a Wide Selection of Cars</span>
                        </li>
                        <li>
                            <span className="font-medium">Instant Online Car Booking</span>
                        </li>
                        <li>
                            <span className="font-medium">Flexible Pickup & Drop-off</span>
                        </li>
                        <li>
                            <span className="font-medium">Exclusive Discounts on Booking</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-teal-900 border border-teal-800 rounded-xl sm:max-lg:grid grid-cols-5 items-center">

                    <div className="col-span-2">
                        <MdCarCrash className="text-teal-100 text-8xl mx-auto mt-2" />
                        <h3 className="text-xl font-bold text-center">Support Team</h3>
                    </div>


                    <ul className="list-disc px-10 py-6 space-y-2 col-span-3 lg:w-max lg:mx-auto">
                        <li>
                            <span className="font-medium">24/7 Roadside Assistance</span>
                        </li>
                        <li>
                            <span className="font-medium">Urgent Car Replacement</span>
                        </li>
                        <li>
                            <span className="font-medium">Hassle-Free Car Delivery & Pickup</span>
                        </li>
                        <li>
                            <span className="font-medium">Dedicated Customer Support</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-teal-900 border border-teal-800 rounded-xl sm:max-lg:grid grid-cols-5 items-center">

                    <div className="col-span-2">
                        <MdCarRental className="text-teal-100 text-8xl mx-auto mt-2" />
                        <h3 className="text-xl font-bold text-center">Car Rental</h3>
                    </div>


                    <ul className="list-disc px-10 py-6 space-y-2 col-span-3 lg:w-max lg:mx-auto">
                        <li>
                            <span className="font-medium">Easy Listing Process</span>
                        </li>
                        <li>
                            <span className="font-medium">Earn Passive Income</span>
                        </li>
                        <li>
                            <span className="font-medium">Full Controlled Rental</span>
                        </li>
                        <li>
                            <span className="mx-auto">Verified & Secure</span>
                        </li>
                    </ul>
                </div>

            </div>

        </div>
    )
}

export default Services