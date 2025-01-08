import { useContext } from "react"
import { authContext } from "../../utils/AuthProvider"
import { MdOutlinePrivacyTip } from "react-icons/md";
import { Link } from "react-router-dom";

function PrivateRoute({ children }) {

    const { user, loading } = useContext(authContext)

    if (loading) {
        return <>
            <p className="invisible">no data</p>
            <div className="flex items-end justify-center text-4xl font-bold absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                <p>loading</p>
                <span className="loading loading-dots loading-md"></span>
            </div>
        </>
    }

    if (user === null) {
        return <>
            <p className="invisible">no data</p>
            <div className="max-w-96 w-11/12 md:w-full bg-emerald-900/50 border border-teal-900 rounded-xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-4 space-y-3 shadow-sm">
                <MdOutlinePrivacyTip className="text-9xl mx-auto text-teal-500" />
                <p className="text-center text-2xl font-bold text-gray-200">PRIVATE ROUTE</p>
                <p className="text-center text-gray-200">YOU NEED TO LOGIN BEFORE ACCESSING PRIVATE PAGES</p>

                <Link className="btn btn-ghost flex bg-teal-500 hover:bg-teal-500/50" to="/my-account">Login</Link>
            </div>
        </>
    }

    return (children)
}

export default PrivateRoute