import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaCircleArrowRight } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Form, Link, useSubmit } from "react-router-dom";
import { useState } from "react";
import toast from 'react-hot-toast';

function Login() {

    const [passwordShown, setPasswordShown] = useState(false)
    const submit = useSubmit()
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const handleSubmit = (e) => {

        e.preventDefault();

        let formAlright = true;
        const name = e.target.name;
        const password = e.target.password;
        const remember = e.target.remember;

        if (!name.value) {
            error("plz enter a name")
            name.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { name.parentElement.style.outline = "" }

        if (!password.value) {
            error("plz enter a password")
            password.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { password.parentElement.style.outline = "" }

        if (remember.checked) {

            if (!localStorage.getItem("remember")) {
                localStorage.setItem("remember", true)
            }
        }
        else {

            if (localStorage.getItem("remember")) {
                localStorage.removeItem("remember")
            }
        }

        if (formAlright) {

            const formData = new FormData(e.target)
            formData.delete("remember")
            submit(formData, { method: "post" })
        }
    }

    return (
        <>
            <Form className="space-y-4 p-2 md:p-4" onSubmit={handleSubmit} noValidate method="post">

                <p className="flex items-center justify-center gap-2 text-3xl font-extrabold pb-4">Welcome back </p>

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

                <button className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/80 btn btn-ghost" type="submit">
                    LOGIN
                    <FaCircleArrowRight />
                </button>

                <div className="divider text-xs before:bg-teal-500 after:bg-teal-500 ">OR LOGIN WITH GOOGLE</div>

                <button className="flex items-center justify-center gap-2 bg-white text-black w-full p-3 rounded-lg font-semibold hover:bg-white/80 btn btn-ghost" type="button">
                    <FcGoogle />
                    GOOGLE
                </button>

            </Form>
        </>
    )
}

export default Login