import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import useAxios from "../../hook/useAxios";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast, { Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";

function OfferForm({ offer, setOffer, closeModal }) {

    const [startDate, setStartDate] = useState(new Date());
    const [discount, setDiscount] = useState(10)
    const formRef = useRef()
    const [btnLoading, setBtnLoading] = useState({})

    const myAxios = useAxios()
    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const handleSubmit = e => {
        e.preventDefault()
        let formAlright = true;

        const title = e.target.title;
        const description = e.target.description;
        const discount = e.target.discount;
        const validUntil = e.target.validUntil;
        const minDays = e.target.minDays;
        const maxDays = e.target.maxDays;

        if (!title.value) {
            error("plz enter a short title for the offer")
            title.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { title.style.outline = "" }

        if (!description.value) {
            error("plz enter a short description for the offer")
            description.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { description.style.outline = "" }

        if (Number(discount.value) < 1) {
            error("plz specify a discount percentage for the offer")
            discount.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { discount.style.outline = "" }

        if (startDate === null) {
            error("plz choose an expiration date for how many days the offer will be available.")
            validUntil.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { validUntil.style.outline = "" }

        if (!minDays.value) {
            minDays.value = 0
        }

        if (!maxDays.value) {
            maxDays.value = 0
        }

        if (formAlright) {

            const obj = {};
            obj.discountedCarId = offer._id
            obj.title = title.value
            obj.description = description.value
            obj.discountPercentage = Number(discount.value)
            obj.validUntil = startDate
            obj.minRentalDays = Number(minDays.value)
            obj.maxRentalDays = Number(maxDays.value)

            setBtnLoading(prev => ({ ...prev, [offer._id]: true }))

            if (offer?.offerData) {

                let patchAlright = 0;
                const carObj = {};

                if (obj.title !== offer.offerData.title) {
                    carObj.title = obj.title
                    patchAlright++;
                }
                if (obj.description !== offer.offerData.description) {
                    carObj.description = obj.description
                    patchAlright++;
                }
                if (obj.discountPercentage !== offer.offerData.discountPercentage) {
                    carObj.discountPercentage = obj.discountPercentage
                    patchAlright++;
                }
                if (obj.validUntil !== offer.offerData.validUntil) {
                    carObj.validUntil = obj.validUntil
                    patchAlright++;
                }
                if (obj.minRentalDays !== offer.offerData.minRentalDays) {
                    carObj.minRentalDays = obj.minRentalDays
                    patchAlright++;
                }
                if (obj.maxRentalDays !== offer.offerData.maxRentalDays) {
                    carObj.maxRentalDays = obj.maxRentalDays
                    patchAlright++;
                }

                if (patchAlright > 0) {
                    myAxios
                        .patch(`/special-offer/${offer.offerData._id}`, carObj)
                        .then(val => {

                            if (val.data?.error) {
                                return error(val.data.error)
                            }
                            if (val.data?.modifiedCount === 1) {
                                success("offer update successfull !")
                            }

                            const updatedOffer = { ...offer.offerData, ...carObj }
                            offer.offerData = updatedOffer
                            setOffer({ ...offer })

                            e.target.reset()
                            setStartDate(null)
                            setDiscount(10)
                            closeModal()
                        })
                        .catch(err => {
                            error(err.message)
                        })
                        .finally(() => {
                            const obj = btnLoading
                            delete obj[offer._id]
                            setBtnLoading({ ...obj })
                        })
                } else {
                    error("nothing to update !")
                    setBtnLoading(prev => ({ ...prev, [offer._id]: false }))
                }

            } else {
                myAxios
                    .post(`/special-offer`, obj)
                    .then(val => {

                        if (val.data?.error) {
                            return error(val.data.error)
                        }

                        if (val.data?.acknowledged) {
                            success("offer added successfully")
                            obj._id = val.data.insertedId
                            offer.offerData = obj
                            setOffer({ ...offer })

                            e.target.reset()
                            setStartDate(null)
                            setDiscount(10)
                            closeModal()
                        }
                    })
                    .catch(err => {
                        error(err.message)
                    })
                    .finally(() => {
                        const obj = btnLoading
                        delete obj[offer._id]
                        setBtnLoading({ ...obj })
                    })
            }

        }

    }

    const deleteOffer = () => {

        Swal.fire({
            title: `Delete ${offer.model} Offer?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            background: "#042f2e",
            color: "#fff",
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            target: document.getElementById('modalComponent')
        }).then((result) => {
            if (result.isConfirmed) {

                setBtnLoading(prev => ({ ...prev, delObj: { ...prev.delObj, [offer._id]: true } }))

                myAxios
                    .delete(`/special-offer/${offer.offerData._id}`)
                    .then(val => {

                        if (val.data?.error) {
                            return error(val.data.error)
                        }

                        if (val.data?.deletedCount === 1) {
                            success("offer deleted successfully")
                            delete offer.offerData
                            setOffer({ ...offer })
                            closeModal()
                        }
                    })
                    .catch(err => {
                        error(err.message)
                    })
                    .finally(() => {
                        setBtnLoading(prev => {

                            const obj = prev
                            delete obj.delObj[offer._id]

                            return { ...obj }
                        })
                    })
            }

        });

    }

    useEffect(
        () => {
            if (offer?.offerData) {
                setDiscount(offer?.offerData?.discountPercentage)
                setStartDate(offer?.offerData?.validUntil)

                formRef.current.title.value = offer.offerData.title
                formRef.current.description.value = offer.offerData.description
                formRef.current.minDays.value = offer.offerData.minRentalDays
                formRef.current.maxDays.value = offer.offerData.maxRentalDays

                formRef.current.title.style.outline = ""
                formRef.current.description.style.outline = ""
                formRef.current.discount.style.outline = ""
                formRef.current.validUntil.style.outline = ""
                formRef.current.minDays.style.outline = ""
                formRef.current.maxDays.style.outline = ""


            } else {
                setDiscount(10)
                setStartDate(null)

                formRef.current.title.value = ""
                formRef.current.description.value = ""
                formRef.current.minDays.value = ""
                formRef.current.maxDays.value = ""
            }
        }, [offer]
    )

    return (
        <>
            <form className="p-4 " id="boot" onSubmit={handleSubmit} noValidate ref={formRef}>

                <h3 className="font-medium text-center mb-2">{offer?.model}</h3>

                <fieldset className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3" disabled={btnLoading[offer?._id]}>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Title</span>
                        </div>

                        <input type="text" placeholder="Offer Title" name="title" spellCheck="false" defaultValue={offer?.offerData?.title} className="input disabled:bg-teal-600 disabled:text-white disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" />

                    </label>

                    <div className="grid">

                        <div className="label">
                            <span className="text-sm">Description</span>
                        </div>

                        <textarea className="textarea [font-size:_1rem] w-full min-h-[50px] bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white disabled:bg-teal-600 disabled:text-white disabled:border-transparent" placeholder="Offer Description" name="description" rows={1}></textarea>
                    </div>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Discount: {discount}%</span>
                        </div>

                        <input type="range" min={1} max="100" value={discount} className="range range-accent bg-teal-600 rounded-md h-full min-h-6 disabled:cursor-not-allowed " name="discount" onChange={e => setDiscount(e.target.value)} />

                    </label>

                    <div className="grid">

                        <div className="label">
                            <span className="text-sm">Valid Until</span>
                        </div>

                        <DatePicker
                            className="bg-teal-600 disabled:cursor-not-allowed focus-within:outline-teal-500/50 w-full px-4 py-3 rounded-lg placeholder:text-white !z-50" name="validUntil"
                            placeholderText="Offer Expiry Date"
                            minDate={new Date()}
                            selected={startDate}
                            disabled={btnLoading[offer?._id]}
                            onChange={(date) => {
                                setStartDate(date);
                            }}
                            isClearable={true}
                            withPortal
                        />
                    </div>


                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Minimum Days</span>
                        </div>

                        <input type="number" placeholder="Minimum day Required" name="minDays" spellCheck="false" min={0} defaultValue={offer?.offerData?.minRentalDays} className="input disabled:bg-teal-600 disabled:text-white disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" />

                    </label>

                    <label className="form-control w-full">

                        <div className="label">
                            <span className="text-sm">Maximum Days</span>
                        </div>

                        <input type="number" placeholder="Maximum day Required" name="maxDays" spellCheck="false" min={0} defaultValue={offer?.offerData?.maxRentalDays} className="input disabled:bg-teal-600 disabled:text-white disabled:border-transparent w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white" />

                    </label>

                </fieldset>

                {
                    offer?.offerData ? <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
                        <button className="flex items-center justify-center gap-2 mt-3 bg-teal-500 w-full mx-auto rounded-lg font-bold hover:bg-teal-500/80 btn btn-ghost [--bc:red]" type="submit" disabled={btnLoading[offer?._id]}>
                            {
                                btnLoading[offer?._id] ? <LoadingSpinner /> : "UPDATE OFFER"
                            }
                        </button>
                        <button className="flex items-center justify-center gap-2 mt-3 bg-red-500 w-full mx-auto rounded-lg font-bold hover:bg-red-500/80 btn btn-ghost [--bc:red]" type="button" disabled={btnLoading?.delObj?.[offer?._id]} onClick={deleteOffer}>
                            {
                                btnLoading?.delObj?.[offer?._id] ? <LoadingSpinner /> : "DELETE OFFER"
                            }
                        </button>
                    </div> : <button className="flex items-center justify-center gap-2 mt-3 bg-teal-500 w-full mx-auto rounded-lg font-bold hover:bg-teal-500/80 btn btn-ghost [--bc:red]" type="submit" disabled={btnLoading[offer?._id]}>
                        {
                            btnLoading[offer?._id] ? <LoadingSpinner /> : "ADD OFFER"
                        }
                    </button>
                }

            </form>

            <Toaster />
        </>
    )
}

export default OfferForm