import { BiSolidImageAdd } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa"
import { RiUser5Fill } from "react-icons/ri"
import { FaCircleArrowRight, FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import userImg from "../../assets/user.jpeg"
import { useContext, useState } from "react";
import { authContext } from "../../utils/AuthProvider";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxios from "../../hook/useAxios";
import Cookies from 'js-cookie';

function UpdateProfile() {

    const { user, setUser, setRemember, setRole, updateUserInfo } = useContext(authContext)
    const [btnLoading, setBtnLoading] = useState(false)
    const myAxios = useAxios();

    if (Cookies.get('role') === undefined) {
        Cookies.set('role', 'customer')
    }

    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const handleSubmit = async (e) => {

        e.preventDefault();

        let formAlright = true;
        const name = e.target.name;
        const image = e.target.image;
        const fileType = image?.files[0]?.type;
        const role = e.target.role;
        const location = e.target.location;

        if (!name.value) {
            error("plz enter a name")
            name.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { name.parentElement.style.outline = "" }

        if (!location.value) {
            error("plz enter a location")
            location.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { location.parentElement.style.outline = "" }

        if (image.value) {

            if (fileType?.split("/")[0] !== "image") {
                error("plz select an image file !")
                image.parentElement.style.outline = "2px solid #f87171"
                formAlright = false;
            }
            else { image.parentElement.style.outline = "" }
        }

        if (!role.value) {
            error("plz select a role")
            role.forEach(el => {
                el.parentElement.style.outline = "2px solid #f87171"
            })
            formAlright = false;
        }
        else {
            role.forEach(el => {
                el.parentElement.style.outline = ""
            })
        }

        if (formAlright) {

            const formObj = {}
            formObj.role = role.value

            setBtnLoading(true)

            if (image.value) {

                try {
                    const data = await myAxios.postForm(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgbbAPI}`, {
                        image: image.files[0]
                    })
                    formObj.image = data.data.data.display_url
                }
                catch (err) {

                    if (err.message === "Request failed with status code 400") {
                        image.parentElement.style.outline = "2px solid #f87171"
                        error("image upload failed !")
                    } else {
                        error(err.message)
                    }

                    return setBtnLoading(false)
                }
            }

            if (name.value !== user?.displayName) {
                formObj.name = name.value
            }

            if (location.value !== Cookies.get("location")) {
                formObj.location = location.value
            }

            if ((name.value !== user?.displayName) || image.value || location.value !== Cookies.get("location")) {
                const userObj = {};

                try {

                    if (name.value !== user?.displayName) {
                        userObj.displayName = name.value
                    }

                    if (formObj.image) {
                        userObj.photoURL = formObj.image
                    }

                    await myAxios.patch("/user", formObj)
                    await updateUserInfo(name.value, formObj.image);

                    e.target.reset()
                    setBtnLoading(false)
                    setUser({ ...user, ...userObj })
                    success('updated successfully')
                }
                catch (err) {
                    setBtnLoading(false)
                    if (err.message.includes("/")) {
                        return error(/\/(.+\w+)/.exec(err.message)[1].replaceAll("-", " "))
                    }

                    return error(err.message)
                }
            } else {
                setBtnLoading(false)
                error("nothing to update")
            }

        }
    }

    const onRoleChange = (e) => {

        if (Cookies.get('role') !== e.target.value) {
            setRole(e.target.value)
            Cookies.set('role', e.target.value)
        }
    }

    const changeHandler = (e) => {
        if (e.target.checked) {

            if (!localStorage.getItem("remember")) {
                setRemember(true)
                localStorage.setItem("remember", true)
            }
        }
        else {

            if (localStorage.getItem("remember")) {
                setRemember(false)
                localStorage.removeItem("remember")
            }
        }
    }

    return (
        <>
            <form className="space-y-4 max-w-[600px] mx-4 md:mx-auto my-20 p-4 md:p-10 bg-teal-900 border-emerald-800 rounded-box" onSubmit={handleSubmit} noValidate method="post">

                {/* bypass: 403. That’s an error - Rate-limit exceeded */}
                <img src={user?.photoURL || userImg} alt="" className="w-40 h-40 rounded-full object-cover mx-auto" referrerPolicy="no-referrer" />

                <p className="text-center"><span>{user?.email.split('@')[0]}</span><wbr />@<span>{user?.email.split('@')[1]}</span></p>

                <p className="flex items-center justify-center gap-2 text-2xl font-extrabold pb-4 text-center">Update Your Profile</p>

                <fieldset className="space-y-4 p-2 md:p-4 " disabled={btnLoading}>

                    <label className="input input-bordered flex items-center gap-3 bg-teal-600 focus-within:outline-teal-500/50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70 scale-150">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" name="name" className="grow w-full placeholder:text-white" placeholder="Username" spellCheck="false" defaultValue={user?.displayName} />
                    </label>

                    <label className="input input-bordered flex items-center bg-teal-600 focus-within:outline-teal-500/50">
                        <BiSolidImageAdd className="text-2xl scale-110 opacity-70 -ml-[3px]" />

                        <input type="file" name="image" className="file-input file-input-ghost w-full -ml-2 focus:text-white" accept="image/*" />
                    </label>

                    <label className="input input-bordered flex items-center bg-teal-600 focus-within:outline-teal-500/50">
                        <FaLocationDot className="text-xl scale-110 opacity-70 -ml-[3px] mr-2" />

                        <input type="text" name="location" className="grow w-full placeholder:text-white" placeholder="City Name" spellCheck="false" defaultValue={Cookies.get('location')} />
                    </label>

                    <button className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/80 btn btn-ghost [--bc:red]" type="submit">
                        {
                            btnLoading ? <LoadingSpinner /> : <>
                                UPDATE
                                <FaCircleArrowRight /></>
                        }
                    </button>
                </fieldset>


                <fieldset className="space-y-4 px-2 md:px-4 " disabled={btnLoading}>

                    <div className="divider text-xs before:bg-teal-500 after:bg-teal-500 ">STATUS</div>

                    <label className="user-type flex items-center gap-3" onChange={onRoleChange}>
                        <RiUser5Fill className="text-xl opacity-70 -ml-4 scale-110" /> I am a customer
                        <input className="hidden" type="radio" name="role" value="customer" defaultChecked={Cookies.get('role') === "customer"} />
                    </label>
                    <label className="user-type flex items-center gap-3" onChange={onRoleChange}>
                        <FaUserTie className="text-xl opacity-70 -ml-4 scale-110" /> I am a vendor
                        <input className="hidden" type="radio" name="role" value="vendor" defaultChecked={Cookies.get('role') === "vendor"} />
                    </label>

                    <div className="flex items-center justify-between text-sm select-none">
                        <label className="inline-flex items-center gap-1 cursor-pointer" onChange={changeHandler}>
                            <input type="checkbox" defaultChecked={localStorage.getItem("remember") === "true"} className="[--chkbg:#14b8a6] border-teal-500 checkbox mr-1 scale-90" />
                            Remember me
                        </label>
                        <Link className="hover:text-teal-400" to="/forgot-password">Forgot password ?</Link>
                    </div>

                </fieldset>

            </form>
        </>
    )
}

export default UpdateProfile