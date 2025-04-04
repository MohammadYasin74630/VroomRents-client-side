import React, { Suspense } from "react";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { Await, useAsyncValue, useLoaderData } from "react-router-dom";
import { motion } from "motion/react"
import { Helmet, HelmetProvider } from "react-helmet-async";
import LoadingSpinner from "../../components/LoadingSpinner";

function Testimonial() {
    const { testimonial2 } = useLoaderData()

    return (

        <>
            <HelmetProvider>
                <Helmet>
                    <title>Vroom Rents | Testimonials</title>
                </Helmet>
            </HelmetProvider>

            <Suspense fallback={<p className="text-center mt-5"><LoadingSpinner size="lg" /></p>}>
                <Await resolve={testimonial2} errorElement={<p className="text-center text-red-500 mt-5">fetching testimonial failed !</p>}>
                    <Cards />
                </Await>
            </Suspense>
        </>
    )
}

function Cards() {

    const data = useAsyncValue();

    return (
        <>
            <h2 className="font-bold text-teal-500 text-center mt-16">More Reviews</h2>
            <p className="text-md sm:text-3xl md:text-4xl font-extrabold text-center my-3 px-1">Real Experiences from VroomRents Customers</p>

            <div className="w-11/12 mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">

                {
                    data.data.map((item, idx) => <motion.div className={`border border-teal-800 space-y-2 bg-teal-900 p-4 rounded-2xl `} key={idx}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                    >

                        <div className="flex items-center gap-2 mb-4">
                            <img className="w-16 rounded-full" src={item.image} alt="" width="320" height="320" />

                            <div className="w-full">
                                <h3 className="font-bold line-clamp-1">{item.username}</h3>

                                <div className="flex items-center justify-between">

                                    <p className="text-sm font-semibold text-gray-200 line-clamp-1">{item.userType}</p>

                                    <ReactStars
                                        char={<FaStar />}
                                        count={5}
                                        value={item.rating}
                                        size={22}
                                        activeColor="#14b8a6"
                                        edit={false}
                                    />
                                </div>

                            </div>

                        </div>

                        <hr className="border-teal-500 border-opacity-50 block" />

                        <p className="max-w-[50ch] font-medium text-gray-100 mx-auto">
                            {item.testimonial.split("\n").map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                    <span className="block mt-2"></span>
                                </React.Fragment>
                            ))}
                        </p>

                    </motion.div>)
                }

            </div>

        </>
    )
}

export default Testimonial