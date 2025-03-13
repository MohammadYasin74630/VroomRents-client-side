import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import toast from 'react-hot-toast';
import { authContext } from "../../utils/AuthProvider";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAxios from "../../hook/useAxios";
import Cookies from 'js-cookie';

function Login() {

    const [passwordShown, setPasswordShown] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const myAxios = useAxios();
    const navigate = useNavigate()
    const { login, googleLogin, setUser, setRemember, setRole } = useContext(authContext)

    const success = (msg) => toast.success(msg, { position: "top-right" });
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const buyerLogin = (e) => {
        const email = e.target.form.email;
        const password = e.target.form.password;

        email.value = "mohammadyasin74630@gmail.com";
        password.value = "Mess@sess";

        email.parentElement.style.outline = ""
        password.parentElement.style.outline = ""
    }

    const sellerLogin = (e) => {
        const email = e.target.form.email;
        const password = e.target.form.password;

        email.value = "binodonprojukti@gmail.com";
        password.value = "Mess@sess";

        email.parentElement.style.outline = ""
        password.parentElement.style.outline = ""
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        let formAlright = true;
        const email = e.target.email;
        const password = e.target.password;
        const remember = e.target.remember;

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
        else { password.parentElement.style.outline = "" }

        if (remember.checked) {

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

        if (formAlright) {

            setBtnLoading(true)

            login(email.value, password.value)
                .then((userInfo) => {

                    setUser(userInfo.user)

                    myAxios.get(`/user/${email.value}`)
                        .then(val => {

                            setBtnLoading(false)

                            if (val.data.error) {
                                return error(val.data.error)
                            }

                            if (val.data.message) {

                                setRole(Cookies.get('role'))
                                e.target.reset()
                                success("login successfull")
                                return navigate("/")
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

                myAxios.post("/user", formObj)
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

                            setRole(Cookies.get('role'))
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
            <form className="space-y-4 p-2 md:p-4" onSubmit={handleSubmit} noValidate>

                <fieldset className="space-y-4 p-2 md:p-4 " disabled={btnLoading || googleLoading}>

                    <p className="flex items-center justify-center gap-2 text-3xl font-extrabold pb-4">Welcome back </p>

                    <button className="flex items-center justify-center gap-2 bg-teal-500/80 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/60 btn btn-ghost [--bc:red]" type="button" onClick={buyerLogin}>
                        BUYER ACCOUNT
                    </button>

                    <button className="flex items-center justify-center gap-2 bg-teal-500/80 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/60 btn btn-ghost [--bc:red]" type="button" onClick={sellerLogin}>
                        SELLER ACCOUNT
                    </button>

                    <div className="divider text-xs before:bg-teal-500 after:bg-teal-500 ">OR</div>

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

                    <div className="flex items-center justify-between text-sm select-none">
                        <label className="inline-flex items-center gap-1 cursor-pointer">
                            <input type="checkbox" defaultChecked className="[--chkbg:#14b8a6] border-teal-500 checkbox mr-1 scale-90" name="remember" value="true" />
                            Remember me
                        </label>
                        <Link className="hover:text-teal-400" to="/forgot-password">Forgot password ?</Link>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/80 btn btn-ghost [--bc:red]" type="submit">
                        {
                            btnLoading ? <LoadingSpinner /> : <>
                                LOGIN
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

export default Login