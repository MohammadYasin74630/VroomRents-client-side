import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxios from "../../hook/useAxios";
import toast from "react-hot-toast";
import { FaCircleArrowRight } from "react-icons/fa6";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from 'sweetalert2'

function dateToStr(str) {

    const parsedDate = new Date(str);

    const year = parsedDate?.getFullYear();
    const month = (parsedDate?.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    const date = parsedDate?.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

    return `${year}-${month}-${date}`;
}

function BookingForm({ car }) {

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const myAxios = useAxios()
    const [schedules, setSchedules] = useState()
    let { current } = useRef([])
    const [btnLoading, setBtnLoading] = useState(false)

    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    useEffect(
        () => {
            const controller = new AbortController()

            myAxios.get(`/booking-schedules/${car._id}`, { signal: controller.signal })
                .then(val => setSchedules(val.data))
                .catch(err => {
                    if (err.name !== "CanceledError") {
                        error("fetching car schedules failed !");
                    }
                })

            return () => controller.abort()
        }, []
    )


    useEffect(
        () => {

            if (schedules) {

                schedules.forEach(
                    itm => {

                        const startDate = new Date(dateToStr(itm.pickupDate))
                        const endDate = new Date(dateToStr(itm.dropoffDate))

                        current.push(
                            {
                                start: new Date(startDate.setDate(startDate.getDate() - 1)),
                                // start: startDate,
                                end: endDate
                            }
                        )
                    }
                )
            }
            return () => current = []

        }, [schedules]
    )

    const submitHandler = (e) => {

        e.preventDefault()

        let formAlright = true;

        const pickLocation = e.target.pickLocation;
        const dropLocation = e.target.dropLocation;
        const rentalPeriod = e.target.rentalPeriod
        const phone = e.target.phone;

        if (!pickLocation.value) {
            error("plz enter a pickup location")
            pickLocation.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { pickLocation.style.outline = "" }

        if (!dropLocation.value) {
            error("plz enter a drop off location")
            dropLocation.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { dropLocation.style.outline = "" }

        if (!phone.value) {
            error("plz enter your phone number")
            phone.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else if (!/^\d+$/.test(phone.value)) {
            error("only numbers are allowed !") // willn't trigger 😆
            phone.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else if (phone.value.length !== 11) {
            error("phone number must be 11 characters only")
            phone.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { phone.style.outline = "" }

        if (startDate === null, endDate === null) {
            error("plz pick a date range for your rental")
            formAlright = false;
            return rentalPeriod.style.outline = "2px solid #f87171"
        }
        else { rentalPeriod.style.outline = "" }


        const pickDate = new Date(dateToStr(startDate))
        const dropDate = new Date(dateToStr(endDate))

        for (let i = 0; i < schedules.length; i++) {

            let curPickDate = new Date(schedules[i].pickupDate)
            let curDropDate = new Date(schedules[i].dropoffDate)

            if ((pickDate.getTime() <= curDropDate.getTime() && pickDate.getTime() >= curPickDate.getTime())) {

                rentalPeriod.style.outline = "2px solid #f87171"
                return error(`this car is already scheduled on ${pickDate.toDateString()} by someone`)
            }
            else if ((dropDate.getTime() >= curPickDate.getTime() && dropDate.getTime() <= curDropDate.getTime())) {

                rentalPeriod.style.outline = "2px solid #f87171"
                return error(`this car is already scheduled on ${dropDate.toDateString()} by someone`)
            }
            else if ((curPickDate.getTime() <= dropDate.getTime() && curPickDate.getTime() >= pickDate.getTime())) {

                rentalPeriod.style.outline = "2px solid #f87171"
                return error(`picked date range is overlapping with an booked schedule`)
            }

        }

        rentalPeriod.style.outline = ""

        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((pickDate - dropDate) / oneDay));

        let discount = 0;

        if (car.offerData) {

            const minRentalDays = car.offerData.minRentalDays;
            const maxRentalDays = car.offerData.maxRentalDays;
            const discountPercentage = car.offerData.discountPercentage

            if (minRentalDays && maxRentalDays) {

                if (diffDays >= minRentalDays && diffDays <= maxRentalDays) {
                    discount = discountPercentage
                }
            }
            else if (!minRentalDays && maxRentalDays) {

                if (diffDays <= maxRentalDays) {
                    discount = discountPercentage
                }
            }
            else if (minRentalDays && !maxRentalDays) {

                if (diffDays >= minRentalDays) {
                    discount = discountPercentage
                }
            }
            else {

                discount = discountPercentage
            }
        }

        let discountedTotal = 0;
        let totalPrice = car.dailyPrice * diffDays;

        if (discount) {

            let discountedPrice = car.dailyPrice * (discount / 100);
            let discountedDaily = car.dailyPrice - discountedPrice.toFixed(2)
            discountedTotal = Math.round(discountedDaily * diffDays)
        }


        if (formAlright) {

            let formObj = {};

            formObj.carId = car._id;
            formObj.pickupLocation = pickLocation.value;
            formObj.dropOffLocation = dropLocation.value;
            formObj.phone = parseInt(phone.value);
            formObj.pickupDate = pickDate;
            formObj.dropoffDate = dropDate;

            Swal.fire({

                imageUrl: car.images[0],
                imageWidth: "40%",
                html: ` <p><b>Booking For:</b> ${diffDays} ${diffDays > 1 ? "days" : "day"}</p>,
                        <p><b>Total Price:</b> ${discountedTotal ? "<del>$" + totalPrice + "</del>" + " $<ins style='text-decoration: none;'>" + discountedTotal + "</ins>" : "$" + totalPrice}</p >`,
                showCancelButton: true,
                confirmButtonText: "Book Now",
                background: "#042f2e",
                color: "#fff",
                confirmButtonColor: "#14b8a6",
                cancelButtonColor: "#d33",

            }).then((result) => {

                if (result.isConfirmed) {

                    setBtnLoading(true)

                    myAxios.post(`/booking`, formObj)
                        .then(val => {

                            setBtnLoading(false)

                            if (val.data.error) {
                                return error(val.data.error)
                            }

                            if (val.data.acknowledged) {

                                current.push(
                                    {
                                        start: new Date(pickDate.setDate(pickDate.getDate() - 1)),
                                        end: dropDate
                                    }
                                )
                                e.target.reset()
                                setDateRange([null, null]);
                                success("Booking successful")
                            }
                        })
                        .catch(err => {
                            setBtnLoading(false)
                            return error(err.message)
                        })
                }
            });

        }
    }

    return (
        <>
            <form onSubmit={submitHandler} noValidate>

                <fieldset disabled={btnLoading}>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Pickup Location</span>
                        </div>

                        <input type="text" placeholder="Enter Location (E.g. Airport)" name="pickLocation" spellCheck="false" className="input disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" />

                    </label>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Drop Off Location</span>
                        </div>

                        <input type="text" placeholder="Enter Location (E.g. Airport)" name="dropLocation" spellCheck="false" className="input disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" />

                    </label>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Phone Number</span>
                        </div>

                        <input type="number" placeholder="Enter Your Phone Number" name="phone" className="input disabled:bg-teal-600 disabled:text-white disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" />

                    </label>

                    <div className="grid">

                        <div className="label">
                            <span className="text-sm">Rental Period</span>
                        </div>

                        <DatePicker
                            className="bg-teal-600 disabled:cursor-not-allowed focus-within:outline-teal-500/50 w-full px-4 py-3 rounded-lg placeholder:text-white !z-50" name="rentalPeriod"
                            placeholderText="Select Pickup & Drop-Off Dates"
                            minDate={new Date()}
                            excludeDateIntervals={current}
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            disabled={btnLoading}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                            isClearable={true}
                        />
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/80 btn btn-ghost [--bc:red] mt-5" type="submit">
                        {
                            btnLoading ? <LoadingSpinner /> : <>
                                RENT
                                <FaCircleArrowRight /></>
                        }
                    </button>

                </fieldset>

            </form>
        </>
    );
}

export default BookingForm