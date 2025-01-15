import { Suspense, useEffect, useState } from "react"
import { Await, Form, useLoaderData, useSearchParams } from "react-router-dom"
import { FaRegMinusSquare, FaRegPlusSquare, FaList } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { IoGridOutline } from "react-icons/io5";
import CarsList from "./CarsList";
import CarsGrid from "./CarsGrid";
import { Tooltip } from 'react-tooltip';
import LoadingSpinner from "../../components/LoadingSpinner";

function AvailableCars() {

    const [view, setView] = useState("grid")
    const [inputVal, setInputVal] = useState("")
    const [searchParams, setSearchParams] = useSearchParams()
    const { cars } = useLoaderData();

    let [obj, setObj] = useState(
        {
            type: searchParams.get("brand") ? "brand" : searchParams.get("model") ? "model" : searchParams.get("location") ? "location" : "brand",
            limit: parseInt(searchParams.get("limit")) || 10,
            filter: searchParams.get("date") ? "date" : searchParams.get("price") ? "price" : "date",
            sort: searchParams.get("date") || searchParams.get("price") || "asc",
            totalPage: null,
            page: 1
        }
    )


    const goPrev = () => {

        if (obj.page > 1) {

            obj.page = obj.page - 1
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", obj.page);
            setSearchParams(newParams)
        }
    }

    const goNext = () => {

        if (obj.page < obj.totalPage) {

            obj.page = obj.page + 1
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", obj.page);
            setSearchParams(newParams)
        }
    }

    const onPageChange = (e) => {

        const selectedPage = parseInt(e.target.value)

        if (selectedPage <= obj.totalPage) {

            obj.page = selectedPage
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", obj.page);
            setSearchParams(newParams)
        }

    }



    const increaseCount = () => {
        obj.limit = obj.limit + 5
        obj.page = 1
        setObj({ ...obj })
        const newParams = new URLSearchParams(searchParams);
        newParams.set("limit", obj.limit);
        newParams.set("page", obj.page);
        setSearchParams(newParams)
    }

    const decreaseCount = () => {
        if (obj.limit > 5) {
            obj.limit = obj.limit - 5
            obj.page = 1
            setObj({ ...obj })
            const newParams = new URLSearchParams(searchParams);
            newParams.set("limit", obj.limit);
            newParams.set("page", obj.page);
            setSearchParams(newParams)
        }
    }

    const setFilter = () => {
        const filter = obj.filter === "date" ? "price" : "date"
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(obj.filter);
        newParams.set(filter, obj.sort);
        obj.filter = filter
        setObj({ ...obj })
        setSearchParams(newParams)
    }

    const setSorting = () => {
        obj.sort = obj.sort === "asc" ? "desc" : "asc"
        const newParams = new URLSearchParams(searchParams);
        newParams.set(obj.filter, obj.sort);
        setObj({ ...obj })
        setSearchParams(newParams)
    }

    const setSearch = (e) => {

        e.preventDefault()
        obj.page = 1
        setObj({ ...obj })

        const newParams = new URLSearchParams(searchParams);
        newParams.delete("brand");
        newParams.delete("model");
        newParams.delete("location");
        newParams.set("page", 1);
        newParams.set(obj.type, e.target.search.value);
        setSearchParams(newParams)
    }

    const onTypeChange = (e) => {
        obj.type = e.target.value
        setObj({ ...obj })
    }

    const onValChange = (e) => {
        setInputVal(e.target.value)
    }

    useEffect(() => {
        if (searchParams.has("brand")) {
            setInputVal(searchParams.get("brand"));
            setObj(prevObj => ({ ...prevObj, type: "brand" }));
        } else if (searchParams.has("model")) {
            setInputVal(searchParams.get("model"));
            setObj(prevObj => ({ ...prevObj, type: "model" }));
        } else if (searchParams.has("location")) {
            setInputVal(searchParams.get("location"));
            setObj(prevObj => ({ ...prevObj, type: "location" }));
        }
    }, [searchParams]);

    useEffect(
        () => {
            cars.then(
                val => {
                    setObj(prevObj => ({ ...prevObj, totalPage: Math.ceil(val.data.totalItemCount / obj.limit) }))
                }
            ).catch(() => setObj(prevObj => ({ ...prevObj, totalPage: null })))
        }, [cars]
    )

    return (
        <>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center my-5 lg:my-10 ">Discover Your Perfect Vehicle</h2>

            <Form className="flex items-center gap-2 justify-center flex-wrap px-4" onSubmit={setSearch}>

                <div className="border border-teal-500 flex rounded-md overflow-hidden bg-teal-500 w-full max-w-[360px] md:max-w-[600px]">

                    <input className="p-3 text-gray-800 bg-gray-100 caret-black font-medium min-w-0 w-full" type="text" id="search" value={inputVal} spellCheck={false} onChange={onValChange} />

                    <select className="select bg-teal-500 min-h-full focus:outline-none text-center font-medium max-[250px]:w-12" onChange={onTypeChange} value={obj.type}>
                        <option value="brand">Brand</option>
                        <option value="model">Model</option>
                        <option value="location">Location</option>
                    </select>

                </div>

                <input className="btn bg-teal-500 border-teal-500 text-white hover:bg-teal-600 hover:border-teal-600 hover:text-opacity-90 py-[17px] px-5 rounded-md h-min max-[490px]:w-full max-w-[360px]" type="submit" value="Search" />

            </Form>


            <div className="w-11/12 mx-auto my-10 bg-emerald-900 rounded-lg p-4">

                <div className="flex items-center justify-between gap-2 flex-wrap">

                    <div className="flex gap-2 items-center flex-wrap">

                        <div className="inline-flex items-center gap-2">

                            <FaRegMinusSquare className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" onClick={decreaseCount} />

                            <span className="text-lg select-none" data-tooltip-id="filter-tooltip" data-tooltip-html={`Show ${obj.limit} Items <br/> on Page`}>{obj.limit}</span>

                            <FaRegPlusSquare className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" onClick={increaseCount} />

                        </div>

                        <div onClick={setFilter}
                            data-tooltip-id="filter-tooltip" data-tooltip-html={`Filtered by ${obj.filter === "date" ? "Date" : "Price"}`}
                        >
                            {
                                obj.filter === "date" ? <MdDateRange className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" /> : <RiMoneyDollarBoxLine className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" />
                            }

                        </div>

                        <div onClick={setSorting}
                            data-tooltip-id="filter-tooltip" data-tooltip-html={`Sorted in ${obj.filter === "asc" ? "Ascending" : "Descending"} Order`}
                        >
                            {
                                obj.sort === "asc" ? <AiOutlineSortAscending className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" /> : <AiOutlineSortDescending className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" />
                            }

                        </div>

                    </div>

                    <div onClick={() => setView(view === "list" ? "grid" : "list")}
                        data-tooltip-id="filter-tooltip" data-tooltip-html={`Show in <br/> ${view === "list" ? "Grid" : "List"} View`}
                    >

                        {
                            view === "list" ? <IoGridOutline className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" /> : <FaList className="border border-teal-500 text-4xl p-2 rounded-sm bg-teal-500 active:scale-90 transition-[transform]" />
                        }


                    </div>

                </div>

            </div>

            <Suspense
                key={searchParams.toString()}
                fallback={<p className="text-center mt-5"><LoadingSpinner size="lg" /></p>}>
                <Await resolve={cars} errorElement={<p className="text-center text-red-500 mt-5">fetching available cars failed !</p>}>
                    {
                        view === "list" ? <CarsList obj={obj} /> : <CarsGrid obj={obj} />
                    }
                </Await>
            </Suspense>

            {
                obj.totalPage ? <div className="text-center space-x-2 mt-5">

                    <button className="btn text-white bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600 hover:text-opacity-70" onClick={goPrev} disabled={obj.page === 1}>Prev</button>

                    <select className="select bg-teal-500" value={obj.page} onChange={onPageChange}>

                        {
                            [...Array(obj.totalPage)].map(
                                (i, idx) => <option key={idx} value={idx + 1}>{idx + 1}</option>
                            )
                        }

                    </select>

                    <button className="btn text-white bg-teal-500 border-teal-500 hover:bg-teal-600 hover:border-teal-600 hover:text-opacity-70" onClick={goNext} disabled={obj.page === obj.totalPage}>Next</button>
                </div> : null
            }


            <Tooltip id="filter-tooltip" openOnClick />
        </>
    )
}

export default AvailableCars