import { Link } from "react-router-dom"
import bg from "../../assets/404-bg-2.webp"

function ErrorPage() {
    return (
        <div className="">
            <div className="sticky z-10 w-full h-[70dvh]">
                <div className="max-w-96 text-center space-y-3 relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2">
                    <p className="text-9xl font-black [text-shadow:_0px_10px_0px_rgb(243_243_243),_1px_12px_3px_rgb(41_41_41)] [-webkit-text-stroke:_0.9px_#14b8a6;]">404</p>
                    <p className="font-bold text-2xl">Page Not Found</p>
                    <p className="font-semibold text-gray-200">The page you are looking for might have been removed had its name changed or temporarily unavailable.</p>
                    <Link className="btn btn-ghost flex bg-teal-500 hover:bg-teal-500/50 w-max mx-auto" to="/">BACK TO HOME</Link>
                </div>
            </div>
            <img src={bg} alt="" className="h-[100vh] w-full max-w-[1920px] mix-blend-overlay object-cover absolute top-0" />
        </div>
    )
}

export default ErrorPage