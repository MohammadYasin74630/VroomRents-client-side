
function Details({ car }) {

    return (
        <>
            <div className="flex gap-1">
                <h3 className="font-semibold">Brand:</h3>
                <p>{car.brand}</p>
            </div>
            <div className="flex gap-1">
                <h3 className="font-semibold">Model:</h3>
                <p>{car.model}</p>
            </div>
            <div className="flex gap-1">
                <h3 className="font-semibold">Reg. No:</h3>
                <p>{car.registrationNumber}</p>
            </div>
            <div className="flex gap-1">
                <h3 className="font-semibold">Price:</h3>
                <p>${car.dailyPrice}/day</p>
            </div>
            <div className="flex gap-1">
                <h3 className="font-semibold">Discount:</h3>
                <p>{car?.offerData?.discountPercentage ? car?.offerData?.discountPercentage + "%" : "N/A"}</p>
            </div>
            <div className="flex gap-1">
                <h3 className="font-semibold">Booked:</h3>
                <p>{car.bookingCount} times</p>
            </div>
            <div className="flex gap-1">
                <h3 className="font-semibold">Location:</h3>
                <p>{car.location}</p>
            </div>
            <div className="flex gap-1">
                <h3 className="font-semibold">Added:</h3>
                <p>{new Intl.DateTimeFormat('en-GB').format(new Date(car.createdAt || Date.now()))}</p>
            </div>
            <h3 className='font-semibold my-1'>Overview:</h3>
            <p className="max-w-[75ch]">{car.description}</p>

            <h3 className='font-semibold my-1'>Features:</h3>
            <div className='grid grid-cols-2 md:max-lg:grid-cols-3 gap-2 text-sm'>

                {
                    car.features.map(
                        (itm, idx) => <p className='bg-teal-500 px-4 py-2 rounded-md' key={idx}>{itm}</p>
                    )
                }

            </div>
        </>
    )
}

export default Details