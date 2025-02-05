import { Await, Link, useLoaderData } from "react-router-dom"
import banner from "../../assets/banner (3).webp"
import WhyUs from "./WhyUs"
import RecentListings from "./RecentListings"
import { Suspense } from "react"
import LoadingSpinner from "../../components/LoadingSpinner"
import SpecialOffers from "./SpecialOffers"
import Testimonial from "./Testimonial"
import { Helmet, HelmetProvider } from 'react-helmet-async';

function Home() {

    const { recentCars, carOffers, testimonial } = useLoaderData()

    return (

        <>
            <HelmetProvider>
                <Helmet>
                    <title>Vroom Rents | Home</title>
                </Helmet>
            </HelmetProvider>

            <div className="relative bg-gradient-to-b from-teal-900 to-emerald-950 p-2 md:p-4">
                <div className="absolute w-11/12 left-1/2 -translate-x-1/2 h-full rounded-3xl flex items-center justify-center z-10 ">
                    <div className="lg:max-w-[80%] xl:max-w-[55%] text-center space-y-2 sm:space-y-3 p-10 md:p-15">
                        <h1 className="font-bold text-teal-500">Welcome To VroomRents</h1>
                        <p className="text-md sm:text-3xl md:text-5xl font-extrabold">Need the perfect car for you<span className="max-sm:hidden">r next adventure</span>?</p>
                        <p className="max-w-[40ch] lg:max-w-[48ch] mx-auto leading-normal font-semibold sm:text-lg text-gray-200 max-sm:hidden">From spontaneous road trips to essential business travel, we provide a diverse selection of vehicles to match any occasion.</p>

                        <Link className="btn lg:text-lg font-bold btn-ghost rounded-full flex bg-teal-500 hover:bg-teal-600 hover:text-white/80 w-max mx-auto !mt-4 max-sm:min-h-[auto] max-sm:h-8 max-sm:px-3 px-10" to="/available-cars">View Cars</Link>
                    </div>
                </div>

                <img className="border border-teal-500 md:w-11/12 mx-auto rounded-3xl brightness-50 [--tw-brightness:_brightness(0.4);]" src={banner} alt="" width="1920" height="1034" />
            </div>

            <WhyUs />

            <Suspense fallback={<p className="text-center mt-5"><LoadingSpinner size="lg" /></p>}>
                <Await resolve={recentCars} errorElement={<p className="text-center text-red-500 mt-5">fetching recent listing failed !</p>}>
                    <RecentListings />
                </Await>
            </Suspense>

            <Suspense fallback={<p className="text-center mt-5"><LoadingSpinner size="lg" /></p>}>
                <Await resolve={carOffers} errorElement={<p className="text-center text-red-500 mt-5">fetching car offers failed !</p>}>
                    <SpecialOffers />
                </Await>
            </Suspense>

            <Suspense fallback={<p className="text-center mt-5"><LoadingSpinner size="lg" /></p>}>
                <Await resolve={testimonial} errorElement={<p className="text-center text-red-500 mt-5">fetching testimonial failed !</p>}>
                    <Testimonial />
                </Await>
            </Suspense>

        </>
    )
}

export default Home