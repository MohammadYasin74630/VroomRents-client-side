import { FaRegMinusSquare, FaRegPlusSquare } from "react-icons/fa";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react";
import useAxios from "../../hook/useAxios";
import { Tooltip } from "react-tooltip";
import "./table.css"
import LoadingSpinner from "../LoadingSpinner";

function Table({ endpoint, headings, makeRow, ifNoData }) {

  const detailsRef = useRef()
  const [view, setView] = useState(localStorage.getItem("pageView") || "table")
  const [show, setShow] = useState(
    headings.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
  )
  const [cars, setCars] = useState([])
  const url = useRef("")
  const observer = useRef(null)
  const [noData, setNoData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const myAxios = useAxios()

  let [obj, setObj] = useState(
    {
      limit: parseInt(localStorage.getItem("limit")) || 10,
      filter: localStorage.getItem("date") ? "date" : localStorage.getItem("price") ? "price" : "date",
      sort: localStorage.getItem("date") || localStorage.getItem("price") || "asc",
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

  const increaseCount = () => {
    obj.limit = obj.limit + 5
    obj.page = 1
    setCars([])
    setObj({ ...obj })
    localStorage.setItem("limit", obj.limit);
  }

  const decreaseCount = () => {
    if (obj.limit > 5) {
      obj.limit = obj.limit - 5
      obj.page = 1
      setCars([])
      setObj({ ...obj })
      localStorage.setItem("limit", obj.limit);
    }
  }

  const setFilter = () => {
    const filter = obj.filter === "date" ? "price" : "date"
    localStorage.removeItem("price");
    localStorage.removeItem("date");
    localStorage.setItem(filter, obj.sort);
    obj.filter = filter
    obj.page = 1
    setCars([])
    setObj({ ...obj })
  }

  const setSorting = () => {
    obj.sort = obj.sort === "asc" ? "desc" : "asc"
    obj.page = 1
    localStorage.setItem(obj.filter, obj.sort);
    setCars([])
    setObj({ ...obj })
  }

  useEffect(
    () => {

      const currentUrl = `${endpoint}?${obj.filter}=${obj.sort}&limit=${obj.limit}&page=${obj.page}`
      const prevUrl = url.current;

      if (currentUrl !== prevUrl) {

        const controller = new AbortController();

        myAxios
          .get(endpoint,
            {
              params: {
                [obj.filter]: obj.sort,
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
    }, [obj.limit, obj.filter, obj.sort, obj.page, obj.estimatedViewCount]
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
      <div className="mx-2">

        {
          !noData && <div className="max-w-screen-xl mx-auto  my-4 bg-teal-500 rounded-lg p-4 relative">

            <div className="flex items-center justify-between gap-2 flex-wrap">

              <div className="flex gap-2 items-center flex-wrap pr-10">

                <div className="inline-flex items-center gap-2">

                  <FaRegMinusSquare className="border border-teal-400 text-4xl p-2 rounded-sm bg-teal-400 active:scale-90 transition-[transform] cursor-pointer" onClick={decreaseCount} />

                  <span className="text-lg select-none cursor-pointer" data-tooltip-id="table-tooltip" data-tooltip-html={`Show ${obj.limit} Items <br/> on Page`}>{obj.limit}</span>

                  <FaRegPlusSquare className="border border-teal-400 text-4xl p-2 rounded-sm bg-teal-400 active:scale-90 transition-[transform] cursor-pointer" onClick={increaseCount} />

                </div>

                <div className="cursor-pointer" onClick={setFilter}
                  data-tooltip-id="table-tooltip" data-tooltip-html={`Filtered by ${obj.filter === "date" ? "Date" : "Price"}`}
                >
                  {
                    obj.filter === "date" ? <MdDateRange className="border border-teal-400 text-4xl p-2 rounded-sm bg-teal-400 active:scale-90 transition-[transform]" /> : <RiMoneyDollarBoxLine className="border border-teal-400 text-4xl p-2 rounded-sm bg-teal-400 active:scale-90 transition-[transform]" />
                  }

                </div>

                <div className="cursor-pointer" onClick={setSorting}
                  data-tooltip-id="table-tooltip" data-tooltip-html={`Sorted in ${obj.sort === "asc" ? "Ascending" : "Descending"} Order`}
                >
                  {
                    obj.sort === "asc" ? <AiOutlineSortAscending className="border border-teal-400 text-4xl p-2 rounded-sm bg-teal-400 active:scale-90 transition-[transform]" /> : <AiOutlineSortDescending className="border border-teal-400 text-4xl p-2 rounded-sm bg-teal-400 active:scale-90 transition-[transform]" />
                  }

                </div>

              </div>

              <div>

                <details className="absolute top-[34px] right-3" ref={detailsRef}>

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
        }

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
                    (itm, idx) => makeRow(itm, idx, cars, setCars, obj, setObj, lastTrElement, show, headings, setNoData)
                  )
                }

              </tbody>

            </table>

          </div>
        }

        {
          noData && (
            ifNoData ? ifNoData : <p className="text-center my-5">No Data Found!</p>
          )
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

export default Table