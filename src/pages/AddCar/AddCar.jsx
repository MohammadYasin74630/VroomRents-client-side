import { useRef, useState } from "react"
import FeatureInput from "./FeatureInput"
import FileInput from "./FileInput"
import { IoCloseCircleSharp } from "react-icons/io5";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FaCheckCircle } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { Tooltip } from 'react-tooltip';
import useAxios from "../../hook/useAxios";

function AddCar() {

    const [btnLoading, setBtnLoading] = useState(false)
    const [features, setFeatures] = useState([])
    const [files, setFiles] = useState([])
    const [uploadStatus, setUploadStatus] = useState({})
    let successNameList = useRef([])
    let successUrlList = useRef([])
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

    const removeFile = (name) => {

        successNameList.current = successNameList.current.filter(
            fname => fname !== name
        )

        successUrlList.current = successUrlList.current.filter(
            obj => obj.name !== name
        )

        setFiles(prev => prev.filter(
            f => f.name !== name
        ))

    }

    const uploadFilesThenSubmit = async (obj, form) => {

        let imgFiles;

        if (successNameList.current.length === 0) {
            imgFiles = files;
        } else {

            imgFiles = files.filter(
                f => !successNameList.current.includes(f.name)
            );
        }

        const filePromise = imgFiles.map(

            f => {

                setUploadStatus(prev => ({ ...prev, [f.name]: "pending" }))

                return myAxios
                    .postForm(
                        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgbbAPI}`,
                        { image: f }
                    )
                    .then(data => {
                        successNameList.current.push(f.name)
                        setUploadStatus(prev => ({ ...prev, [f.name]: "success" }))
                        return {
                            name: f.name,
                            url: data.data.data.display_url
                        }
                    })
                    .catch(() => {
                        setUploadStatus(prev => ({ ...prev, [f.name]: "failed" }))
                        return null
                    })
            }
        )

        const imgList = await Promise.all(filePromise)

        let successfullImgUrls;

        const currentImgUrls = imgList.filter(obj => obj !== null)


        if (successUrlList.current.length === files.length) {
            successfullImgUrls = currentImgUrls
        } else {
            successfullImgUrls = [...currentImgUrls, ...successUrlList.current]
        }

        if (successfullImgUrls.length === files.length) {

            obj.images = successfullImgUrls.map(
                obj => obj.url
            )

            myAxios
                .post("/car", obj)
                .then(val => {
                    
                    if (val.data?.error) {
                        return error(val.data.error)
                    }

                    form.reset()
                    setFeatures([])
                    setFiles([])
                    setUploadStatus({})
                    successNameList.current = []
                    successUrlList.current = []
                    setBtnLoading(false)

                    if (val.data?.acknowledged) {
                        success("submitting successful")
                    }
                })
                .catch(err => {
                    setBtnLoading(false)
                    error("submitting failed !")
                    console.log(err)
                })

        } else if (successfullImgUrls.length === 0 && successNameList.current.length === 0) {

            if (uploadStatus?.failedTimes === 3) {
                setUploadStatus(prev => ({ ...prev, failedTimes: 1 }))
                setBtnLoading(false)
                return error("if your network is ok, then it must be failing because of CORS issue. mail me & i will update the imgbb API key 😥")
            } else {
                setUploadStatus(prev => ({ ...prev, failedTimes: uploadStatus.failedTimes ? uploadStatus.failedTimes++ : 1 }))
            }
            error("image upload failed !")
            setBtnLoading(false)

        } else {
            setBtnLoading(false)
            error("some image uploads failed, plz submit again !")
        }

        if (successfullImgUrls.length > 0) {
            successUrlList.current = successfullImgUrls;
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

        if (features.length === 0) {
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


        if (files.length === 0) {
            error("plz select car images")
            filesEl.parentElement.style.outline = "2px dashed #f87171"
            formAlright = false;
        }
        else if (files.length < 5) {
            error("plz select at least 5 car images")
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
                features: features,
                description: description.value
            }
            setBtnLoading(true)
            uploadFilesThenSubmit(obj, e.target)
        }

    }

    return (
        <>
            <div className="max-w-[1000px] mx-auto">

                <div className="ml-2 mt-5 mb-2">
                    <h2 className="text-4xl font-bold">Add Your Car</h2>
                    <p className="font-semibold text-gray-200">Provide details about the car you want to rent out.</p>
                </div>

                <form className="p-2" onSubmit={submitHandler} noValidate>

                    <fieldset className="" disabled={btnLoading}>

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

                            <div className={`w-full rounded-lg text-sm text-center bg-teal-600 focus:outline-none focus:ring-2 ring-teal-500/80 relative border border-teal-700`} tabIndex={0} onKeyDown={toggleCheckbox}>
                                <label className={`inline-block w-1/2 h-full py-[10px] relative z-10 mt-[2px] align-middle ${btnLoading ? "cursor-not-allowed" : "cursor-pointer"}`} htmlFor="available">
                                    Available
                                </label>
                                <input className="hidden" type="radio" name="availability" id="available" value={1} defaultChecked />

                                <label className={`inline-block w-1/2 h-full py-3 relative z-10 mt-[2px] ${btnLoading ? "cursor-not-allowed" : "cursor-pointer"}`} htmlFor="notAvailable">
                                    <span className="max-[320px]:hidden">Currently</span> N/A
                                </label>
                                <input className="hidden peer" type="radio" name="availability" id="notAvailable" value={0} />

                                <div className="w-1/2 h-[83.34%] absolute top-1 right-[48.7%] peer-checked:right-1 rounded-md bg-teal-500 pointer-events-none transition-[right]"></div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 mb-3">

                            <FeatureInput features={features} setFeatures={setFeatures} btnLoading={btnLoading} />

                            <textarea className="textarea textarea-bordered [font-size:_1rem] w-full min-h-[53px] h-min bg-teal-600 focus-within:outline-teal-500/50 placeholder:text-white/90 disabled:bg-teal-600 disabled:text-white disabled:border-transparent" placeholder="Car Description" name="description" rows={1}></textarea>

                        </div>

                        <FileInput files={files} setFiles={setFiles} btnLoading={btnLoading} />

                    </fieldset>

                    {
                        files.length > 0 ? <div className={`max-h-48 overflow-y-scroll mt-5 [scrollbar-width:_thin] [scrollbar-color:_#065f46_#022c22]`}>

                            <p className="text-sm mb-1">Selected (<span className="font-bold">{files.length}</span>)</p>

                            <div className={`flex flex-wrap gap-x-[14px] gap-y-5 bg-emerald-900 rounded-lg py-4 pl-4 ${btnLoading ? "cursor-not-allowed pointer-events-none" : null}`}>

                                {
                                    files?.map(
                                        img => <div
                                            className="relative w-min"
                                            key={img.name}
                                            data-tooltip-id="img-tooltip" data-tooltip-html={img.name} >

                                            <div className='min-w-20 relative'>

                                                <img
                                                    className="border border-teal-500"
                                                    src={img.previewUrl}
                                                    alt=""
                                                    onLoad={() => URL.revokeObjectURL(img.previewUrl)} />

                                                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                                    {
                                                        uploadStatus?.[img.name] === "pending" ? <span className="loading loading-dots loading-md text-teal-400"></span> : uploadStatus?.[img.name] === "success" ? <FaCheckCircle className="text-3xl bg-green-500 rounded-full" /> : uploadStatus?.[img.name] == "failed" ? <RiErrorWarningFill className="text-3xl bg-red-500 rounded-full" /> : null
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

                    <button className="flex items-center justify-center gap-2 bg-teal-500 max-w-xs w-full mx-auto rounded-lg font-bold mt-5 hover:bg-teal-500/80 btn btn-ghost [--bc:red]" type="submit" disabled={btnLoading}>
                        {
                            btnLoading ? <LoadingSpinner /> : "SUBMIT"
                        }
                    </button>

                </form>

            </div>

            <Tooltip id="img-tooltip" className="!bg-teal-500 max-w-72 overflow-hidden" />
        </>
    )
}

export default AddCar