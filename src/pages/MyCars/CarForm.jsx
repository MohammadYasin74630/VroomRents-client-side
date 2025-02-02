import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast";
import { Tooltip } from 'react-tooltip';
import useAxios from "../../hook/useAxios";
import FeatureInput from "./FeatureInput";
import FileInput from "./FileInput";
import LoadingSpinner from "../../components/LoadingSpinner";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaRegSquareMinus, FaRegSquarePlus } from "react-icons/fa6";
import { BsFileEarmarkBreakFill } from "react-icons/bs";

function CarForm({ car, setCarArr, idx }) {

    const [btnLoading, setBtnLoading] = useState({})
    const [features, setFeatures] = useState({})
    const [files, setFiles] = useState({})
    const [uploadStatus, setUploadStatus] = useState({})
    let successNameList = useRef({})
    let successUrlList = useRef({})
    const [existingImg, setExistingImg] = useState({})
    const [updatedCar, setUpdatedCar] = useState({})
    const formRef = useRef()
    const myAxios = useAxios()

    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const toggleCheckbox = e => {

        if (e.code === "Space") {

            e.preventDefault()

            const input = e.target.querySelectorAll(`input`)

            for (let i = 0; i < input.length; i++) {
                if (!input[i].checked) {
                    input[i].checked = true
                    break;
                }
            }
        }
    }

    const removeExistingImg = idx => {
        setExistingImg(prev => {
            prev[car._id] = prev?.[car._id] || [];
            const exits = prev[car._id].includes(idx)
            if (!exits) {
                prev[car._id] = [...prev[car._id], idx];
                return { ...prev }
            }
            return prev
        })
    }

    const reAddExistingImg = idx => {
        setExistingImg(prev => {
            const newArr = prev[car._id].filter(itm => itm !== idx)
            prev[car._id] = [...newArr];
            return { ...prev }
        })
    }

    const removeFile = (name) => {

        successNameList.current[car._id] = successNameList.current[car._id] || []
        successNameList.current[car._id] = successNameList.current?.[car._id].filter(
            fname => fname !== name
        )

        successUrlList.current[car._id] = successUrlList.current[car._id] || []
        successUrlList.current[car._id] = successUrlList.current?.[car._id].filter(
            obj => obj.name !== name
        )

        setFiles(prev => {

            const newFiles = prev?.[car._id].filter(
                f => f.name !== name
            )

            prev[car._id] = newFiles;

            return { ...prev }
        })

    }

    const uploadFilesThenSubmit = async (obj) => {

        let imgFiles;

        successNameList.current[car._id] = successNameList.current?.[car._id] || []

        if (successNameList.current?.[car._id]?.length === 0) {

            imgFiles = files?.[car._id];

        } else {

            imgFiles = files?.[car._id].filter(
                f => !successNameList.current?.[car._id].includes(f.name)
            );
        }

        const filePromise = imgFiles.map(

            f => {

                setUploadStatus(prev => {

                    prev[car._id] = prev[car._id] || {};
                    prev[car._id][f.name] = "pending"

                    return { ...prev }
                })

                return myAxios
                    .postForm(
                        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgbbAPI}`,
                        { image: f }
                    )
                    .then(data => {
                        successNameList.current[car._id] = successNameList.current[car._id] || [];
                        successNameList.current[car._id].push(f.name)

                        setUploadStatus(prev => {

                            prev[car._id] = prev[car._id] || {};
                            prev[car._id][f.name] = "success"

                            return { ...prev }
                        })
                        return {
                            name: f.name,
                            url: data.data.data.display_url
                        }
                    })
                    .catch(() => {
                        setUploadStatus(prev => {

                            prev[car._id] = prev[car._id] || {};
                            prev[car._id][f.name] = "failed"

                            return { ...prev }
                        })
                        return null
                    })
            }
        )

        const imgList = await Promise.all(filePromise)

        let successfullImgUrls;

        const currentImgUrls = imgList.filter(obj => obj !== null)

        successUrlList.current[car._id] = successUrlList.current?.[car._id] || []

        if (successUrlList.current?.[car._id].length === files?.[car._id].length) {
            successfullImgUrls = currentImgUrls
        } else {
            successfullImgUrls = [...currentImgUrls, ...successUrlList.current[car._id]]
        }

        if (successfullImgUrls.length === files?.[car._id].length) {

            const imgArr = successfullImgUrls.map(
                obj => obj.url
            )

            obj.images = [...obj.images, ...imgArr]

            myAxios
                .patch(`/car/${car._id}`, obj)
                .then(val => {

                    if (val.data?.error) {
                        return error(val.data.error)
                    }

                    if (val.data?.acknowledged) {
                        success("update successful")
                    }

                    setFiles(prev => ({ ...prev, [car._id]: [] }))
                    setUploadStatus(prev => ({ ...prev, [car._id]: {} }))
                    setExistingImg(prev => {
                        prev[car._id] = []
                        return { ...prev }
                    })
                    successNameList.current[car._id] = []
                    successUrlList.current[car._id] = []

                    setCarArr(prev => {
                        prev[idx] = { ...prev[idx], ...obj }
                        return [...prev]
                    })

                })
                .catch(() => error("update failed !"))
                .finally(() => {
                    const obj = btnLoading
                    delete obj[car._id]
                    setBtnLoading({ ...obj })
                })

        } else if (successfullImgUrls.length === 0 && successNameList.current?.[car._id].length === 0) {

            if (uploadStatus?.[car._id]?.failedTimes === 3) {
                setUploadStatus(prev => {

                    prev[car._id] = prev[car._id] || {};
                    prev[car._id].failedTimes = 1

                    return { ...prev }
                })
                setBtnLoading(false)
                return error("if your network is ok, then it must be failing because of CORS issue. use vpn then try again !")
            } else {
                setUploadStatus(prev => {

                    prev[car._id] = prev[car._id] || {};
                    prev[car._id].failedTimes = uploadStatus?.[car._id]?.failedTimes ? uploadStatus[car._id].failedTimes++ : 1

                    return { ...prev }
                })
            }
            error("image upload failed !")
            setBtnLoading(false)

        } else {
            setBtnLoading(false)
            error("some image uploads failed, plz submit again !")
        }

        if (successfullImgUrls.length > 0) {
            successUrlList.current[car._id] = successfullImgUrls;
        }
    }

    const submitHandler = e => {
        e.preventDefault()

        let formAlright = true;
        const brand = e.target.brand;
        const model = e.target.model;
        const registrationNumber = e.target.registrationNumber;
        const location = e.target.location;
        const price = e.target.price;
        const availability = e.target.availability;
        const featuresEl = e.target.features;
        const description = e.target.description;
        const filesEl = e.target.files;

        if (!brand.value) {
            error("plz enter a brand name")
            brand.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { brand.style.outline = "" }

        if (!model.value) {
            error("plz enter a model name")
            model.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { model.style.outline = "" }

        if (!registrationNumber.value) {
            error("plz enter a registration number")
            registrationNumber.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { registrationNumber.style.outline = "" }

        if (!location.value) {
            error("plz enter a location")
            location.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { location.style.outline = "" }

        if (!price.value) {
            error("plz enter a price")
            price.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else if (Number(price.value) === 0) {
            error("price: free !!!")
            price.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { price.style.outline = "" }

        if (!availability.value) {
            error("plz select if car is availabile now")
            availability[0].parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { availability[0].parentElement.style.outline = "" }

        if (features?.[car._id].length === 0) {
            error("plz enter some car features")
            featuresEl.parentElement.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { featuresEl.parentElement.parentElement.style.outline = "" }

        if (!description.value) {
            error("plz enter a car description")
            description.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { description.style.outline = "" }

        files[car._id] = files?.[car._id] || []
        existingImg[car._id] = existingImg?.[car._id] || []

        if ((car.images.length - existingImg[car._id].length) + files?.[car._id].length < 5) {
            error("at least 5 car images must be uploaded !")
            filesEl.parentElement.style.outline = "2px dashed #f87171"
            formAlright = false;
        }
        else { filesEl.parentElement.style.outline = "" }

        if (formAlright) {

            const obj = {
                brand: brand.value,
                model: model.value,
                registrationNumber: registrationNumber.value,
                location: location.value,
                dailyPrice: Number(price.value),
                availability: Boolean(Number(availability.value)),
                features: features?.[car._id],
                images: car.images.filter((itm, idx) => {
                    const exist = existingImg[car._id].includes(idx)
                    return !exist
                }),
                description: description.value
            }

            setUpdatedCar(prev => {
                prev[car._id] = obj
                prev[car._id].availability = Number(availability.value)
                delete prev[car._id].features
                return { ...prev }
            })

            setBtnLoading(prev => ({ ...prev, [car._id]: true }))
            uploadFilesThenSubmit(obj, e.target)
        }

    }

    useEffect(
        () => {

            const form = formRef.current;

            if (!features?.[car._id]) {

                setFeatures(prev => {
                    prev[car._id] = car.features
                    return { ...prev }
                })
            }
            if (!updatedCar?.[car._id]) {

                setUpdatedCar(prev => {

                    prev[car._id] = {}
                    prev[car._id].brand = car.brand
                    prev[car._id].model = car.model
                    prev[car._id].registrationNumber = car.registrationNumber
                    prev[car._id].location = car.location
                    prev[car._id].dailyPrice = car.dailyPrice
                    prev[car._id].availability = Number(car.availability)
                    prev[car._id].description = car.description

                    return { ...prev }
                })

            }

            form.brand.value = updatedCar?.[car._id]?.brand || ""
            form.model.value = updatedCar?.[car._id]?.model || ""
            form.registrationNumber.value = updatedCar?.[car._id]?.registrationNumber || ""
            form.location.value = updatedCar?.[car._id]?.location || ""
            form.price.value = updatedCar?.[car._id]?.dailyPrice || ""
            form.availability.value = updatedCar?.[car._id]?.availability 
            form.description.value = updatedCar?.[car._id]?.description || ""

            form.brand.style.outline = ""
            form.model.style.outline = ""
            form.registrationNumber.style.outline = ""
            form.location.style.outline = ""
            form.price.style.outline = ""
            form.description.style.outline = ""
            form.availability[0].parentElement.style.outline = ""
            form.features.parentElement.parentElement.style.outline = ""
            form.files.parentElement.style.outline = ""

            return () => {

                form.brand.value = ""
                form.model.value = ""
                form.registrationNumber.value = ""
                form.location.value = ""
                form.price.value = ""
                form.availability.value = ""
                form.description.value = ""
                form.files.parentElement.style.outline = ""
            }

        }, [car, updatedCar]
    )

    return (
        <>
            <div className="max-w-[1000px] mx-auto">

                <div className="ml-2 mt-5 mb-2">
                    <h2 className="text-4xl font-bold">Update Your Car</h2>
                    <p className="font-semibold text-gray-200">Don't go to other page (on this site) when a car is updating</p>
                </div>

                <form className="p-2" onSubmit={submitHandler} noValidate ref={formRef}>

                    <fieldset className="" disabled={btnLoading[car?._id]}>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">

                            <input
                                type="text"
                                placeholder="Car Brand"
                                name="brand"
                                spellCheck={false}
                                className="input input-bordered w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white/90 disabled:bg-teal-600 disabled:text-white disabled:border-transparent" />

                            <input
                                type="text"
                                placeholder="Car Model"
                                name="model"
                                spellCheck={false}
                                className="input input-bordered w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white/90 disabled:bg-teal-600 disabled:text-white disabled:border-transparent" />

                            <input
                                type="text"
                                placeholder="Car Reg. No."
                                name="registrationNumber"
                                spellCheck={false}
                                className="input input-bordered w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white/90 disabled:bg-teal-600 disabled:text-white disabled:border-transparent" />

                            <input
                                type="text"
                                placeholder="Car Location"
                                name="location"
                                spellCheck={false}
                                className="input input-bordered w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white/90 disabled:bg-teal-600 disabled:text-white disabled:border-transparent" />

                            <input
                                type="number"
                                placeholder="Daily Rental Price"
                                name="price"
                                spellCheck={false}
                                className="input input-bordered w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white/90 disabled:bg-teal-600 disabled:text-white disabled:border-transparent" />

                            <div className={`w-full rounded-lg text-sm text-center bg-teal-600 focus:outline-none ${btnLoading?.[car?._id] ? "" : "focus:ring-2"} ring-teal-500/80 relative border border-teal-700`} tabIndex={0} onKeyDown={toggleCheckbox}>
                                <label className={`inline-block w-1/2 h-full py-[10px] relative z-10 mt-[2px] align-middle ${btnLoading?.[car?._id] ? "cursor-not-allowed" : "cursor-pointer"}`} htmlFor="available">
                                    Available
                                </label>
                                <input className="hidden" type="radio" name="availability" id="available" value={1} defaultChecked />

                                <label className={`inline-block w-1/2 h-full py-3 relative z-10 mt-[2px] ${btnLoading?.[car?._id] ? "cursor-not-allowed" : "cursor-pointer"}`} htmlFor="notAvailable">
                                    <span className="max-[320px]:hidden">Currently</span> N/A
                                </label>
                                <input className="hidden peer" type="radio" name="availability" id="notAvailable" value={0} />

                                <div className="w-1/2 h-[83.34%] absolute top-1 right-[48.7%] peer-checked:right-1 rounded-md bg-teal-500 pointer-events-none transition-[right]"></div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 mb-3">

                            <FeatureInput features={features?.[car._id] ?? []} setFeatures={setFeatures} btnLoading={btnLoading?.[car?._id]} id={car._id} />

                            <textarea className="textarea textarea-bordered [font-size:_1rem] w-full bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white/90 disabled:bg-teal-600 disabled:text-white disabled:border-transparent" placeholder="Car Description" name="description" rows={1}></textarea>

                        </div>

                        <div className={`max-h-48 overflow-y-scroll my-5 [scrollbar-width:_thin] [scrollbar-color:_#065f46_#022c22]`}>

                            <p>Images (Uploaded)</p>

                            <div className={`flex flex-wrap gap-x-3 gap-y-5 bg-emerald-900 rounded-lg py-4 ${btnLoading?.[car?._id] ? "cursor-not-allowed pointer-events-none" : null}`}>

                                {
                                    car?.images.map(
                                        (img, idx) => <div
                                            className="relative w-min"
                                            key={idx}>

                                            <div className='min-w-20 relative'>

                                                <img
                                                    className={`border border-teal-500 ${existingImg?.[car._id]?.includes(idx) && "opacity-50"}`}
                                                    src={car.images[idx]}
                                                    alt="" />

                                                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                                    {
                                                        existingImg?.[car._id]?.includes(idx) ? <BsFileEarmarkBreakFill className="text-3xl fill-red-500 rounded-sm" /> : null
                                                    }
                                                </div>

                                            </div>

                                            {
                                                existingImg?.[car._id]?.includes(idx) ? <FaRegSquarePlus className="text-2xl bg-teal-500 rounded-sm cursor-pointer absolute top-[2px] right-[2px]" onClick={() => reAddExistingImg(idx)} /> : <FaRegSquareMinus className="text-2xl bg-teal-500 rounded-sm cursor-pointer absolute top-[2px] right-[2px]" onClick={() => removeExistingImg(idx)} />
                                            }

                                        </div>
                                    )
                                }

                            </div>

                        </div>


                        <FileInput files={files?.[car._id] ?? []} setFiles={setFiles} btnLoading={btnLoading?.[car?._id]} id={car._id} />

                    </fieldset>

                    {
                        files?.[car._id]?.length > 0 ? <div className={`max-h-48 overflow-y-scroll mt-5 [scrollbar-width:_thin] [scrollbar-color:_#065f46_#022c22]`}>

                            <p className="text-sm mb-1">Selected (<span className="font-bold">{files?.[car._id].length}</span>)</p>

                            <div className={`flex flex-wrap gap-x-[14px] gap-y-5 bg-emerald-900 rounded-lg py-4 ${btnLoading?.[car?._id] ? "cursor-not-allowed pointer-events-none" : null}`}>

                                {
                                    files?.[car._id]?.map(
                                        img => <div
                                            className="relative w-min"
                                            key={img.name}
                                            data-tooltip-id="img-tooltip" data-tooltip-html={img.name} >

                                            <div className='min-w-20 relative'>

                                                <img
                                                    className="border border-teal-500"
                                                    src={img.previewUrl}
                                                    alt=""
                                                // onLoad={() => URL.revokeObjectURL(img.previewUrl)} 
                                                />

                                                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                                    {
                                                        uploadStatus?.[car._id]?.[img.name] === "pending" ? <span className="loading loading-dots loading-md text-teal-400"></span> : uploadStatus?.[car._id]?.[img.name] === "success" ? <FaCheckCircle className="text-3xl bg-green-500 rounded-full" /> : uploadStatus?.[car._id]?.[img.name] == "failed" ? <RiErrorWarningFill className="text-3xl bg-red-500 rounded-full" /> : null
                                                    }
                                                </div>

                                            </div>

                                            <IoCloseCircleSharp className="text-4xl bg-black rounded-full cursor-pointer absolute -top-4 -right-3" onClick={() => removeFile(img.name)} />

                                        </div>
                                    )
                                }

                            </div>

                        </div> : null
                    }

                    <button className="flex items-center justify-center gap-2 bg-teal-500 max-w-xs mx-auto w-full rounded-lg font-bold mt-5 hover:bg-teal-500/80 btn btn-ghost [--bc:red]" type="submit" disabled={btnLoading[car?._id]}>
                        {
                            btnLoading?.[car?._id] ? <LoadingSpinner /> : "UPDATE"
                        }
                    </button>

                </form>

            </div>

            <Tooltip id="img-tooltip" className="!bg-teal-500 max-w-72 overflow-hidden" />

            <Toaster />
        </>
    )
}

export default CarForm