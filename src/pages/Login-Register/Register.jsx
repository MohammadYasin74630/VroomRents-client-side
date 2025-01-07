import { BiSolidImageAdd } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa"
import { RiUser5Fill } from "react-icons/ri"
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useContext, useState } from "react";
import toast from 'react-hot-toast';
import { authContext } from "../../utils/AuthProvider";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

function Register({ inputRef }) {

    const [passwordShown, setPasswordShown] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const navigate = useNavigate()
    const { register, updateUserInfo, googleLogin, logout, setUser, setRemember } = useContext(authContext)

    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const handleSubmit = (e) => {

        e.preventDefault();

        let formAlright = true;
        const name = e.target.name;
        const image = e.target.image;
        const fileType = image?.files[0]?.type;
        const email = e.target.email;
        const password = e.target.password;
        const role = e.target.role;

        if (!name.value) {
            error("plz enter a name")
            name.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { name.parentElement.style.outline = "" }

        if (!image.value) {
            error("plz select a image")
            image.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else if (fileType?.split("/")[0] !== "image") {
            error("plz select an image file !")
            image.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { image.parentElement.style.outline = "" }

        if (!email.value) {
            error("plz enter a email")
            email.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
            email.parentElement.style.outline = "2px solid #f87171"
            error("plz enter a valid email")
            formAlright = false;
        }
        else { email.parentElement.style.outline = "" }

        if (!password.value) {
            error("plz enter a password")
            password.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else if (!/[a-z]/.test(password.value)) {
            password.parentElement.style.outline = "2px solid #f87171"
            error("password must have a Lowercase letter")
            formAlright = false;
        }
        else if (!/[A-Z]/.test(password.value)) {
            password.parentElement.style.outline = "2px solid #f87171"
            error("password must have a Uppercase letter")
            formAlright = false;
        }
        else if (!/^\S*$/.test(password.value)) {
            password.parentElement.style.outline = "2px solid #f87171"
            error("whitespaces in the password is not allowed")
            formAlright = false;
        }
        else if (!/.{6,}/.test(password.value)) {
            password.parentElement.style.outline = "2px solid #f87171"
            error("password Length must be at least 6 character")
            formAlright = false;
        }
        else { password.parentElement.style.outline = "" }

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

            let formObj = {};
            formObj.role = role.value

            setBtnLoading(true)

            axios.postForm(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgbbAPI}`,
                { image: image.files[0] }
            )
                .then(data => {

                    register(email.value, password.value)
                        .then((userInfo) => {

                            formObj.email = userInfo.user.email
                            formObj.password = password.value
                            formObj.lastLoginAt = userInfo.user.metadata.lastLoginAt

                            return updateUserInfo(name.value, data.data.data.display_url)
                        })
                        .then(() => {

                            formObj.name = name.value
                            formObj.image = data.data.data.display_url

                            axios.post("http://localhost:3000/user", formObj)
                                .then(val => {
                                    setBtnLoading(false)

                                    if (val.data.error) {
                                        return error(val.data.error)
                                    }

                                    if (val.data.acknowledged) {
                                        logout()
                                            .then(() => inputRef.current.checked = true)
                                            .catch(err => error(err))

                                        e.target.reset()
                                        return success("account created, plz login now")
                                    }
                                })
                                .catch(err => {
                                    setBtnLoading(false)
                                    return error(err.message)
                                })
                        })
                        .catch(err => {

                            setBtnLoading(false)
                            if (err.message.includes("/")) {
                                return error(/\/(.+\w+)/.exec(err.message)[1].replaceAll("-", " "))
                            }

                            return error(err.message)
                        })
                })
                .catch((err) => {

                    if (err.message === "Request failed with status code 400") {
                        image.parentElement.style.outline = "2px solid #f87171"
                        error("image upload failed !")
                    } else {
                        error(err.message)
                    }
                    setBtnLoading(false)
                })
        }
    }

    const handleGoogleLogin = (e) => {

        setGoogleLoading(true)

        googleLogin()
            .then(userInfo => {

                setUser(userInfo.user)

                const formObj = {
                    "name": userInfo.user.displayName,
                    "email": userInfo.user.email,
                    "image": userInfo.user.photoURL,
                    "login": "google",
                    "lastLoggedIn": userInfo.user.metadata.lastLoginAt
                }

                axios.post("http://localhost:3000/user", formObj)
                    .then(val => {
                        setGoogleLoading(false)

                        if (val.data.error) {
                            return error(val.data.error)
                        }

                        if (val.data.message || val.data.acknowledged) {

                            if (!localStorage.getItem("remember")) {

                                setRemember(true)
                                localStorage.setItem("remember", true)
                            }

                            success("login successfull")
                            e.target.form.reset()
                            return navigate("/")
                        }
                    })
                    .catch(err => {
                        setGoogleLoading(false)
                        return error(err.message)
                    })

            })
            .catch(err => {
                setGoogleLoading(false)
                if (err.message.includes("/")) {
                    return error(/\/(.+\w+)/.exec(err.message)[1].replaceAll("-", " "))
                }

                return error(err.message)
            })
    }

    return (
        <>
            <form onSubmit={handleSubmit} noValidate method="post">

                <fieldset className="space-y-4 p-2 md:p-4 " disabled={btnLoading || googleLoading}>
                    <p className="flex items-center justify-center gap-2 text-3xl font-extrabold pb-4 text-center">Create an Account</p>

                    <label className="input input-bordered flex items-center gap-3 bg-teal-600 focus-within:outline-teal-500/50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70 scale-150">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" name="name" className="grow placeholder:text-white" placeholder="Username" spellCheck="false" />
                    </label>

                    <label className="input input-bordered flex items-center bg-teal-600 focus-within:outline-teal-500/50">
                        <BiSolidImageAdd className="text-2xl scale-110 opacity-70 -ml-[3px]" />

                        <input type="file" name="image" className="file-input file-input-ghost w-full -ml-2 focus:text-white" accept="image/*" />
                    </label>

                    <label className="input input-bordered flex items-center gap-[14px] bg-teal-600 focus-within:outline-teal-500/50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70 scale-150">
                            <path
                                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path
                                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input type="email" name="email" className="grow placeholder:text-white" placeholder="Email" />
                    </label>

                    <label className="input input-bordered flex items-center gap-3 bg-teal-600 focus-within:outline-teal-500/50 relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70 scale-150">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd" />
                        </svg>
                        <input type={passwordShown ? "text" : "password"} name="password" className="grow placeholder:text-white" placeholder="Password" />
                        <div className="absolute top-2 right-2 text-3xl" onClick={() => setPasswordShown(!passwordShown)}>
                            {
                                passwordShown ? <IoIosEyeOff /> : <IoIosEye />
                            }
                        </div>
                    </label>

                    <label className="user-type flex items-center gap-3" >
                        <RiUser5Fill className="text-xl opacity-70 -ml-4 scale-110" /> I am a customer
                        <input className="hidden" type="radio" name="role" value="customer" defaultChecked />
                    </label>
                    <label className="user-type flex items-center gap-3">
                        <FaUserTie className="text-xl opacity-70 -ml-4 scale-110" /> I am a vendor
                        <input className="hidden" type="radio" name="role" value="vendor" />
                    </label>

                    <button className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/80 btn btn-ghost [--bc:red]" type="submit">
                        {
                            btnLoading ? <LoadingSpinner /> : <>
                                REGISTER
                                <FaCircleArrowRight /></>
                        }
                    </button>

                    <div className="divider text-xs before:bg-teal-500 after:bg-teal-500 ">OR LOGIN WITH GOOGLE</div>

                    <button className="flex items-center justify-center gap-2 bg-white text-black w-full p-3 rounded-lg font-semibold hover:bg-white/80 btn btn-ghost [--bc:red]" type="button" onClick={handleGoogleLogin}>
                        {
                            googleLoading ? <LoadingSpinner /> : <>
                                <FcGoogle />
                                GOOGLE
                            </>
                        }
                    </button>
                </fieldset>

            </form>
        </>
    )
}

export default Register