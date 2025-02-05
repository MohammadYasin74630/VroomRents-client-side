import { useRef } from "react"
import Login from "./Login"
import Register from "./Register"
import { Helmet, HelmetProvider } from "react-helmet-async"

function MyAccount() {

    const inputRef = useRef()

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Vroom Rents | Login/Register</title>
                </Helmet>
            </HelmetProvider>

            <div role="tablist" className="tabs tabs-lifted max-w-[600px] mx-auto my-10 p-2 md:p-4">
                <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    className="tab font-bold h-10" aria-label="LOGIN"
                    defaultChecked
                    ref={inputRef} />
                <div role="tabpanel" className="tab-content bg-teal-900 border-emerald-800 rounded-box md:p-6">
                    <Login />
                </div>

                <input
                    type="radio"
                    name="my_tabs_2"
                    role="tab"
                    className="tab font-bold h-10"
                    aria-label="REGISTER" />
                <div role="tabpanel" className="tab-content bg-teal-900 border-emerald-800 rounded-box md:p-6">
                    <Register inputRef={inputRef} />
                </div>

            </div>

        </>
    )
}

export default MyAccount