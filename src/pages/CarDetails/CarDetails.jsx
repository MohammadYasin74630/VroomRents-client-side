import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAxios from '../../hook/useAxios'
import ImageSlides from './ImageSlides'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Details from './Details'
import Offer from './Offer'
import ContactInfo from './ContactInfo'
import BookingForm from './BookingForm'
import LoadingSpinner from '../../components/LoadingSpinner'

function CarDetails() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { id } = useParams()
    const myAxios = useAxios()

    useEffect(
        () => {
            const controller = new AbortController()

            myAxios.get(`/car/${id}`, { signal: controller.signal })
                .then(val => {
                    setData(val.data)
                    setLoading(false)
                })
                .catch(err => {
                    if (err.name === "CanceledError" || err.message === "canceled") {
                        return 
                    } else {
                        setLoading(false);
                        setError(true);
                    }
                })

            return () => controller.abort()
        }, []
    )

    if (loading) {
        return <div className='text-center mt-5'>
            <LoadingSpinner />
        </div>
    }

    if (error) {
        return <p className="text-center text-red-500 mt-5">fetching car details failed !</p>
    }

    return (
        <>
            <div className='md:w-11/12 mx-auto lg:grid grid-cols-[3.3fr_1.7fr] max-xl:gap-4'>
                <div className='overflow-hidden'>
                    <div className='flex items-center justify-between xl:!w-5/6'>
                        <h2 className='text-xl font-bold my-4 max-md:ml-4'> {data?.brand + " " + data?.model} </h2>
                        <span className="text-sm border border-teal-800 bg-emerald-900 px-2 py-1 rounded-sm font-semibold text-gray-100 max-[767px]:mr-4">{data?.availability ? "Available" : "Booked"}</span>
                    </div>
                    {data ? <ImageSlides images={data.images} /> : null}
                </div>
                <aside className='max-md:w-11/12 mx-auto overflow-hidden w-full'>
                    <h2 className='text-xl font-bold my-4 text-center'>Car Information</h2>
                    <Tabs>
                        <TabList>
                            <Tab>Detail</Tab>
                            <Tab>Offer</Tab>
                            <Tab>Book</Tab>
                            <Tab>Contact</Tab>
                        </TabList>

                        <TabPanel style={{ width: "100%", maxWidth: "780px", border: "1px solid #115e59" }}>
                            {data ? <Details car={data} /> : <p>Loading...</p>}
                        </TabPanel>

                        <TabPanel style={{ width: "100%", maxWidth: "780px", border: "1px solid #115e59" }}>
                            {data?.offerData ? <Offer offer={data.offerData} /> : <p className='max-w-[75ch]'>No special offers are available for this car.</p>}
                        </TabPanel>

                        <TabPanel style={{ width: "100%", maxWidth: "780px", border: "1px solid #115e59" }}>
                            {data ? <BookingForm car={data} /> : <p>Loading...</p>}
                        </TabPanel>

                        <TabPanel style={{ width: "100%", maxWidth: "780px", backgroundColor: "transparent" }}>
                            {data?.ownerData ? <ContactInfo owner={data.ownerData} /> : <p className='bg-teal-900 rounded-md -m-4 p-4'>Not found !</p>}
                        </TabPanel>
                    </Tabs>
                </aside>
            </div>
        </>
    )
}

export default CarDetails