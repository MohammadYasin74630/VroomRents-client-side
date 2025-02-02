import { FaCircleArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ContactInfo({ owner }) {
    return (
        <div className="max-w-96 border border-teal-800 bg-teal-900 -m-4 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-4">Listed by</h2>

            <div className="flex flex-wrap items-start gap-2">
                <img className="w-16 h-16 object-cover rounded-sm" src={owner.image} alt="" referrerPolicy="no-referrer" />

                <div>
                    <h3 className="font-bold capitalize">{owner.name}</h3>
                    <p className="text-sm font-medium text-gray-100">{owner.location ? owner.location : "Unknown"}</p>
                </div>
            </div>

            <hr className="border-teal-500 border-opacity-30 mt-4 mb-2" />

            <div className="flex flex-wrap gap-1 mt-1">
                <h3 className="font-semibold">Email:</h3>
                <p><span>{owner?.email.split('@')[0]}</span><wbr />@<span>{owner?.email.split('@')[1]}</span></p>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
                <h3 className="font-semibold">Mobile:</h3>
                <p>01234567890</p>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
                <h3 className="font-semibold">WhatsApp:</h3>
                <p>01234567890</p>
            </div>

            <Link className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-semibold  hover:bg-teal-500/80 btn btn-ghost [--bc:red] mt-3 h-max" type="submit" to={`/available-cars?dealer=${owner._id}`}>
                All cars by this dealer <FaCircleArrowRight />
            </Link>

        </div>
    )
}

export default ContactInfo