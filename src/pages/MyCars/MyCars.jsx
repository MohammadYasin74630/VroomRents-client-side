import Table from "../../components/Table/Table"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2'
import useAxios from "../../hook/useAxios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import Dialog from "../../components/Dialog";
import OfferForm from "./OfferForm";
import CarForm from "./CarForm";

function MyCars() {

    const myAxios = useAxios()
    const controller = useRef()
    const [disableBtn, setDisableBtn] = useState({})
    const [car, setCar] = useState()
    const [modal, setModal] = useState({})
    const dialogRef = useRef()
    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const showModal = (itm, content , func, idx) => {
        setModal(prev => ({...prev, current: content, set: func, id: idx}))
        setCar(itm)
        dialogRef.current.showModal()
    }

    const closeModal = () => dialogRef.current.close()

    const deleteCar = (id, model, setArr, obj, setObj, setNoData) => {

        if (controller.current) {
            controller.current.abort()
        }
        controller.current = new AbortController()
        const signal = controller.current.signal

        Swal.fire({
            title: `Delete ${model}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            background: "#042f2e",
            color: "#fff",
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                setDisableBtn(prev => ({ ...prev, [id]: true }))
                myAxios
                    .delete(`/car/${id}`)
                    .then(
                        val => {
                            if (val.data?.acknowledged) {
                                success("Deleted successfully")
                                myAxios
                                    .get(`/my-cars`,
                                        {
                                            params: {
                                                [obj.filter]: obj.sort,
                                                limit: obj.estimatedViewCount,
                                                page: 1
                                            },
                                            signal
                                        }
                                    )
                                    .then(val => {
                                        controller.current = null
                                        delete disableBtn[id]
                                        const btnObj = { ...disableBtn }

                                        if (val.data.totalItemCount === 0) {
                                            setNoData(true)
                                        }
                                        setDisableBtn(btnObj)
                                        setArr(val.data.doc)
                                        setObj(prev => ({ ...prev, totalPage: Math.ceil(val.data.totalItemCount / obj.limit) }))

                                    })
                                    .catch(err => {

                                        if (err.name === "CanceledError") {
                                            console.log("Fetch aborted!");
                                        } else {
                                            error("UI update failed!");
                                        }
                                    })
                                    .finally(() => {
                                        delete disableBtn[id]
                                        const btnObj = { ...disableBtn }
                                        setDisableBtn(btnObj)
                                    })
                            }
                            if (val.data?.error) {
                                error(val.data.error)
                            }
                        }
                    )
                    .catch(
                        err => {
                            error(err.message)
                            delete disableBtn[id]
                            const btnObj = { ...disableBtn }
                            setDisableBtn(btnObj)
                        }
                    )
            }
        });
    }

    return (
        <>
            <Dialog dialogRef={dialogRef}>
                {
                    modal.current === "offerForm" && <OfferForm offer={car} setOffer={setCar} closeModal={closeModal} />
                }
                {
                    modal.current === "carForm" && <CarForm car={car} setCarArr={modal.set} idx={modal.id} />
                }
            </Dialog>

            <h2 className="ml-2 mt-10 text-center text-2xl font-bold">My Car List</h2>
            <Table
                endpoint="/my-cars"
                headings={["No", "Model", "Reg", "City", "Status", "Price", "Booked", "Added", "Offer", "Action"]}
                makeRow={
                    (itm, idx, arr, setArr, obj, setObj, lastTrElement, show, headings, setNoData) => <tr key={itm._id} ref={idx === arr.length - 1 ? lastTrElement : null}>
                        {
                            show[headings[0]] && <td data-label={headings[0]}>
                                {idx + 1}
                            </td>
                        }
                        {
                            show[headings[1]] && <td
                                className={`model-td flex gap-2 flex-wrap`}
                                data-label={headings[1]}>
                                <img
                                    className={`w-12 h-12 object-cover rounded-md max-sm:hidden`}
                                    src={itm.images[0]} alt="" />
                                <div className="leading-tight inline-block">
                                    <Link className={`font-medium block`} to={`/car-details/${itm._id}`}>{itm.model}</Link>
                                    <span className="text-sm text-gray-100 max-sm:hidden">{itm.brand}</span>
                                </div>
                            </td>
                        }

                        {
                            show[headings[2]] && <td data-label={headings[2]}>{itm.registrationNumber}</td>
                        }

                        {
                            show[headings[3]] && <td data-label={headings[3]}>{itm.location}</td>
                        }

                        {
                            show[headings[4]] && <td data-label={headings[4]}>{itm.availability ? "Available" : "Rented"}</td>
                        }

                        {
                            show[headings[5]] && <td data-label={headings[5]}>${itm.dailyPrice}</td>
                        }

                        {
                            show[headings[6]] && <td data-label={headings[6]}>{itm.bookingCount} times</td>
                        }

                        {
                            show[headings[7]] && <td data-label={headings[7]}>
                                <span data-tooltip-id="table-tooltip" data-tooltip-html={new Date(itm.createdAt).toDateString()}>{new Intl.DateTimeFormat('en-GB').format(new Date(itm.createdAt))}</span>
                            </td>
                        }

                        {
                            show[headings[8]] && <td data-label={headings[8]}>
                                <button className={`bg-teal-400 px-3 rounded-full text-sm font-medium active:scale-95 transition-[transform]`} onClick={() => showModal(itm, "offerForm")}>
                                    {
                                        itm?.offerData ? itm.offerData.discountPercentage + "%" : "ADD"
                                    }
                                </button>
                            </td>
                        }

                        {
                            show[headings[9]] && <td data-label={headings[9]}>

                                <fieldset className={`inline-flex gap-3 items-center text-xl align-text-bottom`} disabled={disableBtn[itm._id]}>
                                    <button className={`active:scale-95 transition-[transform] ${disableBtn[itm._id] ? "cursor-not-allowed" : ""}`} onClick={() => showModal(itm, "carForm", setArr, idx)}>
                                        <FaRegEdit />
                                    </button>
                                    <button className={`text-red-50 active:scale-90 transition-[transform] ${disableBtn[itm._id] ? "cursor-not-allowed" : ""}`} onClick={() => deleteCar(itm._id, itm.model, setArr, obj, setObj, setNoData)}>
                                        <RiDeleteBin6Line />
                                    </button>
                                </fieldset>

                            </td>
                        }

                    </tr>
                }
                ifNoData={
                    <div className="font-bold text-xl text-center my-5">
                        <p>No cars added. Start by adding a car!</p>
                        <Link className="btn btn-ghost flex bg-teal-500 hover:bg-teal-500/50 w-max mx-auto my-4" to="/add-car">Add Car</Link>
                    </div>
                }
            />
        </>
    )
}

export default MyCars