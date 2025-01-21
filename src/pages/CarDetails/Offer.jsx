
function Offer({ offer }) {

    const postedDate = new Date(offer.createdAt);
    const pDate = `${postedDate.getFullYear()}-${(postedDate.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}-${(postedDate.getDate()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;

    const validUnitlDate = new Date(offer.validUntil);
    const vDate = `${validUnitlDate.getFullYear()}-${(validUnitlDate.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}-${(validUnitlDate.getDate()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;

    const note = `Rentals must be ${offer.minRentalDays ? `at least ${offer.minRentalDays} days` : ""} ${offer.minRentalDays && offer.maxRentalDays ? "and" : ""} ${offer.maxRentalDays ? `no more than ${offer.maxRentalDays} days` : ""} to qualify for this discount.`

    return (
        <>

            <div className="max-w-72">

                <div className="flex justify-between">
                    <div>
                        <h3 className="font-semibold">Discount:</h3>
                        {
                            offer.minRentalDays ? <h3 className="font-semibold">Min<span className="max-[320px]:hidden">imum Rental Days</span>:</h3> : null
                        }
                        {
                            offer.maxRentalDays ? <h3 className="font-semibold">Max<span className="max-[320px]:hidden">imum Rental Days</span>:</h3> : null
                        }
                        <h3 className="font-semibold">Posted<span className="max-[320px]:hidden"> On</span>:</h3>
                        <h3 className="font-semibold"><span className="max-[320px]:hidden">Offer </span>Valid <span className="max-[320px]:hidden">Un</span>til:</h3>
                    </div>
                    <div >
                        <p className="text-nowrap">{offer.discountPercentage}% off</p>
                        {offer.minRentalDays ? <p className="text-nowrap">{offer.minRentalDays} days</p> : null}
                        {offer.maxRentalDays ? <p className="text-nowrap">{offer.maxRentalDays} days</p> : null}
                        <p className="text-nowrap">{pDate}</p>
                        <p className="text-nowrap">{vDate}</p>
                    </div>
                </div>

            </div>

            <div className="max-w-[75ch]">
                <h3 className="font-semibold mt-2">Title:</h3>
                <p>{offer.title}</p>

                <h3 className="font-semibold mt-2">Description:</h3>
                <p>{offer.description}</p>
                {
                    offer.minRentalDays || offer.maxRentalDays ? <>
                        <h3 className="font-semibold mt-2">Requirement:</h3>
                        <p>{note}</p>
                    </> : null
                }

            </div>
        </>
    )
}

export default Offer