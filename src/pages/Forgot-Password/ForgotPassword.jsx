import { FaCircleArrowRight } from "react-icons/fa6";
import { Form, useSubmit } from "react-router-dom";
import toast from 'react-hot-toast';

function ForgotPassword() {

    const submit = useSubmit()
    const error = (msg) => toast.error(msg, {position : "top-right"});

    const handleSubmit = (e) => {

        e.preventDefault();

        let formAlright = true;
        const email = e.target.email;

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

        if (formAlright) { submit(e.target) }
    }

    return (
        <>
            <Form className="space-y-4 max-w-[600px] mx-4 md:mx-auto my-20 p-4 md:p-10 bg-teal-900 border-emerald-800 rounded-box" onSubmit={handleSubmit} noValidate method="post">

                <p className="flex items-center justify-center gap-2 text-3xl font-extrabold text-center">Reset password</p>

                <p className="text-center pb-4 max-w-[40ch] mx-auto">Enter your email address so we can send you an email to reset your password.</p>

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

                <button className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/80 btn btn-ghost" type="submit">
                    CONTINUE
                    <FaCircleArrowRight />
                </button>

            </Form>
        </>
    )
}

export default ForgotPassword