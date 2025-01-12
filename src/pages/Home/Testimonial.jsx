import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { useAsyncValue } from "react-router-dom";

function Testimonial() {

    const data = useAsyncValue();
    const [num, setNum] = useState(4)

    return (
        <>
            <h2 className="font-bold text-teal-500 text-center mt-16">Testimonials</h2>
            <p className="text-md sm:text-3xl md:text-4xl font-extrabold text-center my-3 px-1">Transforming Travel with Exceptional Service</p>

            <div className="w-11/12 mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">

                {
                    data.data.slice(0, num).map((item, idx) => <div className={`border border-teal-800 space-y-2 bg-teal-900 p-4 rounded-2xl ${num === 4 && idx === 2 ? "lg:hidden xl:block" : idx === 8 ? "lg:hidden" : idx === 9 ? "xl:hidden" : null}`} key={item._id}>

                        <div className="flex items-center gap-2 mb-4">
                            <img className="w-16 rounded-full" src={item.image} alt="" />

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

                    </div>)
                }

            </div>

            {
                num === 4 ? <button className="btn font-semibold btn-ghost rounded-full flex bg-teal-500 hover:bg-teal-600 hover:text-white/80 w-max mx-auto !mt-5 max-sm:min-h-[auto] max-sm:h-8 max-sm:px-3 px-10" onClick={() => setNum(10)}>Load More</button> : null
            }

        </>
    )
}

export default Testimonial