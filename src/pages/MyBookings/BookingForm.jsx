import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxios from "../../hook/useAxios";
import toast, { Toaster } from "react-hot-toast";
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

function BookingForm({ booking, setCars }) {

    const [dateRange, setDateRange] = useState([booking.pickupDate || null, booking.dropoffDate || null]);
    const [startDate, endDate] = dateRange;
    const myAxios = useAxios()
    const [schedules, setSchedules] = useState([])
    const [dateArr, setDateArr] = useState([])
    const [phoneNumber, setPhoneNumber] = useState(booking.phone || "")
    const [btnLoading, setBtnLoading] = useState(false)

    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    useEffect(
        () => {
            const controller = new AbortController()

            myAxios.get(`/booking-schedules/${booking.carData._id}`, { signal: controller.signal })
                .then(val => {

                    const scheduleList = val.data.filter(
                        itm => itm._id !== booking._id
                    )
                    return setSchedules(scheduleList)
                })
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

                        setDateArr(prev => {
                            prev.push(
                                {
                                    start: new Date(startDate.setDate(startDate.getDate() - 1)),
                                    end: endDate
                                }
                            )
                            return [...prev]
                        })

                    }
                )
            }
            return () => setDateArr([])

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

        if (booking.offerData) {

            const minRentalDays = booking.offerData.minRentalDays;
            const maxRentalDays = booking.offerData.maxRentalDays;
            const discountPercentage = booking.offerData.discountPercentage

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
        let totalPrice = booking.carData.dailyPrice * diffDays;

        if (discount) {

            let discountedPrice = booking.carData.dailyPrice * (discount / 100);
            let discountedDaily = booking.carData.dailyPrice - discountedPrice.toFixed(2)
            discountedTotal = Math.round(discountedDaily * diffDays)
        }


        if (formAlright) {

            let formObj = {};

            formObj.pickupLocation = pickLocation.value;
            formObj.dropOffLocation = dropLocation.value;
            formObj.phone = phoneNumber;
            formObj.pickupDate = pickDate;
            formObj.dropoffDate = dropDate;

            Swal.fire({

                imageUrl: booking.carData.image,
                imageWidth: "40%",
                html: ` <p><b>Update: booking to </b> ${diffDays} ${diffDays > 1 ? "days" : "day"}</p> <br/>
                        <p><b>Total Price:</b> ${discountedTotal ? "<del>$" + totalPrice + "</del>" + " $<ins style='text-decoration: none;'>" + discountedTotal + "</ins>" : "$" + totalPrice}</p >`,
                showCancelButton: true,
                confirmButtonText: "Update Now",
                background: "#042f2e",
                color: "#fff",
                confirmButtonColor: "#14b8a6",
                target: document.getElementById('modalComponent')

            }).then((result) => {

                if (result.isConfirmed) {
                    setBtnLoading(true)

                    myAxios.patch(`/booking/${booking._id}`, formObj)
                        .then(val => {

                            setBtnLoading(false)

                            if (val.data.error) {
                                return error(val.data.error)
                            }

                            if (val.data.acknowledged) {
                                setCars(prev => {
                                    const arr = [...prev]
                                    arr[booking.idx] = { ...arr[booking.idx], ...formObj }
                                    delete arr[booking.idx].idx
                                    return arr
                                })
                                success("Booking updated successfully")
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
            <form className="p-4" onSubmit={submitHandler} noValidate>

                <fieldset disabled={btnLoading}>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Pickup Location</span>
                        </div>

                        <input type="text" placeholder="Enter Location (E.g. Airport)" name="pickLocation" spellCheck="false" className="input disabled:bg-teal-600 disabled:text-white disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" defaultValue={booking.pickupLocation} />

                    </label>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Drop Off Location</span>
                        </div>

                        <input type="text" placeholder="Enter Location (E.g. Airport)" name="dropLocation" spellCheck="false" className="input disabled:bg-teal-600 disabled:text-white disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" defaultValue={booking.dropOffLocation} />

                    </label>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Phone Number</span>
                        </div>

                        <input type="number" placeholder="Enter Your Phone Number" name="phone" min="0" className="input disabled:bg-teal-600 disabled:text-white disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />

                    </label>

                    <div className="grid">

                        <div className="label">
                            <span className="text-sm">Rental Period</span>
                        </div>

                        <DatePicker
                            className="bg-teal-600 disabled:cursor-not-allowed outline-none w-full px-4 py-3 rounded-lg placeholder:text-white !z-50" name="rentalPeriod"
                            placeholderText="Select Pickup & Drop-Off Dates"
                            minDate={new Date()}
                            excludeDateIntervals={dateArr}
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
                                UPDATE
                                <FaCircleArrowRight /></>
                        }
                    </button>

                </fieldset>

            </form>
            <Toaster />
        </>
    );
}

export default BookingForm