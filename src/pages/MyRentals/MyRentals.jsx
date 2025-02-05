import { FaRegListAlt } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { useCallback, useEffect, useRef, useState } from "react";
import useAxios from "../../hook/useAxios";
import { Tooltip } from "react-tooltip";
import "../../components/Table/table.css"
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

const headings = ["No", "Model", "(P) Location", "(D) Location", "(P) Date", "(D) Date", "Status", "Total", "Action"]

function MyRentals() {

    const detailsRef = useRef()
    const [view, setView] = useState(localStorage.getItem("pageView") || "table")
    const [show, setShow] = useState(
        headings.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
    )
    const [cars, setCars] = useState([])
    const [noData, setNoData] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const url = useRef("")
    const observer = useRef(null)
    const myAxios = useAxios()

    let [obj, setObj] = useState(
        {
            limit: parseInt(localStorage.getItem("limit")) || 10,
            filter: "",
            totalPage: null,
            estimatedViewCount: 0,
            page: 1
        }
    )

    const lastTrElement = useCallback(
        node => {
            if (loading) return
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                entries => {
                    if (entries[0].isIntersecting && obj.page < obj.totalPage) {
                        setLoading(true)
                        setObj(prev => ({ ...prev, page: obj.page + 1 }))
                    }
                }
            )
            if (node) observer.current.observe(node)
        }, [loading, obj.totalPage]
    )

    const setPageView = (mode) => {
        localStorage.setItem("pageView", mode)
        setView(localStorage.getItem("pageView"))
    }

    const onFilterChange = (e) => {
        obj.filter = e.target.value
        obj.page = 1
        setObj({ ...obj })
        setCars([])
    }

    useEffect(
        () => {

            const currentUrl = `/my-rentals?filter=${obj.filter}&limit=${obj.limit}&page=${obj.page}`
            const prevUrl = url.current;

            if (currentUrl !== prevUrl) {

                const controller = new AbortController();

                myAxios
                    .get("/my-rentals",
                        {
                            params: {
                                filter: obj.filter,
                                limit: obj.limit,
                                page: obj.page
                            },
                            signal: controller.signal
                        }
                    )
                    .then(
                        val => {

                            url.current = currentUrl
                            if (val.data.doc.length > 0) {
                                setCars(prev => [...prev, ...val.data.doc])
                                setNoData(false)
                            } else {
                                setNoData(true)
                            }
                            setObj(prevObj => (
                                {
                                    ...prevObj,
                                    totalPage: Math.ceil(val.data.totalItemCount / obj.limit),
                                    estimatedViewCount: val.data.estimatedViewCount
                                }
                            ))
                        }
                    ).catch(
                        (err) => {
                            if (err.name === "CanceledError" || err.message === "canceled") {
                                return
                            } else {
                                setError(true);
                            }
                        }
                    ).finally(() => setLoading(false))

                return () => controller.abort()
            }
        }, [obj.limit, obj.filter, obj.page]
    )

    const hideDetails = (event) => {

        const withinBoundaries = event.composedPath().includes(detailsRef.current)

        if (withinBoundaries) {

            detailsRef.current.querySelector("svg").classList.add("rotate-180")

            if (detailsRef.current.open) {
                detailsRef.current.querySelector("svg").classList.remove("rotate-180")

                if (event.target.tagName === "DETAILS") {
                    detailsRef.current.open = false
                }
            }

        } else {
            if (detailsRef.current?.open) {
                detailsRef.current.querySelector("svg").classList.remove("rotate-180")
                detailsRef.current.open = false
            }
        }
    }

    useEffect(
        () => {
            document.addEventListener('click', hideDetails)

            return () => document.removeEventListener("click", hideDetails)
        }, []
    )

    const changeHanlder = e => setShow(prev => ({ ...prev, [e.target.name]: e.target.checked }))

    return (
        <>

            <HelmetProvider>
                <Helmet>
                    <title>Vroom Rents | My Rentals</title>
                </Helmet>
            </HelmetProvider>

            <h2 className="ml-2 mt-10 text-center text-2xl font-bold">My Rent List</h2>

            <div className="mx-2">

                <div className="max-w-screen-xl mx-auto  my-4 bg-teal-500 rounded-lg p-4 relative">

                    <div className="flex items-center justify-between gap-2 flex-wrap">

                        <select className="select bg-teal-500 min-h-full focus:outline-none text-center font-medium max-[250px]:w-12" onChange={onFilterChange} value={obj.filter}>
                            <option value="">Filter</option>
                            <option value="pending">PENDING</option>
                            <option value="canceled">CANCELED</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="completed">COMPLETED</option>
                        </select>

                        <div>

                            <details className="absolute top-1/2 right-3" ref={detailsRef}>

                                <summary className="cursor-pointer list-none -translate-y-1/2 text-right bg-teal-400 px-2 py-2 rounded-md inline-flex items-center gap-2 absolute right-0">
                                    <span className="max-[360px]:hidden text-sm">Display</span>
                                    <FaAngleDown className="transition-[transform]" />
                                </summary>

                                <fieldset className="bg-teal-900 border border-emerald-950 relative top-6 z-50 p-4 rounded-md" onClick={(e) => e.stopPropagation()}>

                                    <div className="flex justify-between gap-2 mb-4">
                                        <button
                                            className={`${view === "list" ? "bg-teal-500" : ""} px-3 rounded-sm border border-teal-500 active:scale-95 transition-[transform]`}
                                            onClick={() => setPageView("list")}
                                        >List</button>
                                        <button
                                            className={`${view === "table" ? "bg-teal-500" : ""} px-3 rounded-sm border border-teal-500 active:scale-95 transition-[transform]`}
                                            onClick={() => setPageView("table")}
                                        >Table</button>
                                    </div>

                                    {
                                        headings.map(
                                            (itm, idx) => <label className="flex items-center gap-1 cursor-pointer" key={idx}>
                                                <input type="checkbox" className="[--chkbg:#14b8a6] border-teal-500 checkbox mr-1 scale-90" name={itm} checked={show[itm]} onChange={changeHanlder} />
                                                {itm}
                                            </label>
                                        )
                                    }

                                </fieldset>

                            </details>

                        </div>

                    </div>

                </div>

                {
                    cars.length > 0 && <div className={`car-${view} max-w-screen-xl mx-auto rounded-md`}>

                        <table className="w-full text-left">

                            <thead className="sticky top-0">
                                <tr>
                                    {
                                        headings.map(
                                            (itm, idx) => show[itm] && (<th className={`first:rounded-bl-lg first:rounded-tl-lg last:rounded-tr-lg last:rounded-br-lg`} key={idx}>
                                                {itm}
                                            </th>)
                                        )
                                    }
                                </tr>
                            </thead>

                            <tbody >

                                {
                                    cars?.map(
                                        (itm, idx) => <tr key={itm._id} ref={idx === cars.length - 1 ? lastTrElement : null}>
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
                                                        src={itm.carData.image} alt="" />
                                                    <div className="leading-tight inline-block">
                                                        <Link className={`font-medium block`} to={`/car-details/${itm._id}`}>{itm.carData.model}</Link>
                                                        <span className="text-sm text-gray-100 max-sm:hidden">{itm.carData.brand}</span>
                                                    </div>
                                                </td>
                                            }

                                            {
                                                show[headings[2]] && <td data-label={headings[2]}>{itm.pickupLocation}</td>
                                            }

                                            {
                                                show[headings[3]] && <td data-label={headings[3]}>{itm.dropOffLocation}</td>
                                            }

                                            {
                                                show[headings[4]] && <td data-label={headings[4]}>
                                                    <span data-tooltip-id="table-tooltip" data-tooltip-html={new Date(itm.pickupDate || Date.now()).toDateString()}>{new Intl.DateTimeFormat('en-GB').format(new Date(itm.pickupDate || Date.now()))}</span>
                                                </td>
                                            }

                                            {
                                                show[headings[5]] && <td data-label={headings[5]}>
                                                    <span data-tooltip-id="table-tooltip" data-tooltip-html={new Date(itm.dropoffDate || Date.now()).toDateString()}>{new Intl.DateTimeFormat('en-GB').format(new Date(itm.dropoffDate || Date.now()))}</span>
                                                </td>
                                            }

                                            {
                                                show[headings[6]] && <td data-label={headings[6]}>{itm.status}</td>
                                            }

                                            {
                                                show[headings[7]] && <td data-label={headings[7]}>
                                                    ${itm.totalPrice}
                                                </td>
                                            }

                                            {
                                                show[headings[8]] && <td data-label={headings[8]}>
                                                    <div className="inline-flex justify-center items-center align-top gap-2">
                                                        <button
                                                            className="text-[21px]"
                                                            data-tooltip-id="table-tooltip" data-tooltip-html="user details + change status"
                                                        >
                                                            <FaRegListAlt />
                                                        </button>
                                                        <button
                                                            className="text-[25px] mt-[2px]"
                                                            data-tooltip-id="table-tooltip" data-tooltip-html="cancel booking"
                                                        >
                                                            <MdCancelPresentation className="fill-red-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            }

                                        </tr>
                                    )
                                }

                            </tbody>

                        </table>

                    </div>
                }

                {
                    noData && <p className="text-center my-5">No Data Found!</p>
                }
                {
                    (loading || cars.length === 0) && !noData && !error && <p className="text-center my-5"><LoadingSpinner /></p>
                }
                {
                    error && <p className="text-center my-5 text-red-400">Fetching data failed !</p>
                }

            </div>

            <Tooltip id="table-tooltip" className="!bg-teal-700 z-10" openOnClick />
        </>
    )
}

export default MyRentals