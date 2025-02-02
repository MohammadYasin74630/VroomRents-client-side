import axios from "axios"
import ErrorPage from "../pages/Error-404/ErrorPage"
import Home from "../pages/Home/Home"
import AvailableCars from "../pages/AvailableCars/AvailableCars"
import CarDetails from "../pages/CarDetails/CarDetails"
import PrivateRoute from "../pages/PrivateRoute/PrivateRoute"


const mainRoutes = [
    {
        path: '/',
        element: <Home />,
        loader: () => {
            let recentCars = axios.get("https://b10-a11-server-side-beryl.vercel.app/recent-listings?limit=10")

            let carOffers = axios.get("https://b10-a11-server-side-beryl.vercel.app/special-offers?limit=10")

            let testimonial = axios.get("/testimonial.json")

            return ({ recentCars, carOffers, testimonial })
        }
    },
    {
        path: '/available-cars',
        element: <AvailableCars />,
        loader: ({ request }) => {

            const url = new URL(request.url)
            const date = url.searchParams.get('date') || "asc";
            const price = url.searchParams.get('price') || "asc";
            const limit = url.searchParams.get('limit') || 10;
            const page = url.searchParams.get('page') || 1;

            const brand = url.searchParams.get('brand');
            const model = url.searchParams.get('model');
            const location = url.searchParams.get('location');
            const dealer = url.searchParams.get('dealer');

            const filter = {}

            if (url.searchParams.get('date') !== null) {
                filter.date = date
            }
            else if (url.searchParams.get('price') !== null) {
                filter.price = price
            } else {
                filter.price = "asc"
            }

            if (brand) {

                let cars = axios.get(
                    `https://b10-a11-server-side-beryl.vercel.app/available-cars`,
                    {
                        params: {
                            brand: brand,
                            ...filter,
                            limit: parseInt(limit),
                            page: parseInt(page)
                        }
                    }
                );
                return { cars }
            }
            else if (model) {

                let cars = axios.get(
                    `https://b10-a11-server-side-beryl.vercel.app/available-cars`,
                    {
                        params: {
                            model: model,
                            ...filter,
                            limit: parseInt(limit),
                            page: parseInt(page)
                        }
                    }
                );
                return { cars }
            }
            else if (location) {

                let cars = axios.get(
                    `https://b10-a11-server-side-beryl.vercel.app/available-cars`,
                    {
                        params: {
                            location: location,
                            ...filter,
                            limit: parseInt(limit),
                            page: parseInt(page)
                        }
                    }
                );
                return { cars }
            }
            else if (dealer) {

                let cars = axios.get(
                    `https://b10-a11-server-side-beryl.vercel.app/available-cars`,
                    {
                        params: {
                            dealer: dealer,
                            ...filter,
                            limit: parseInt(limit),
                            page: parseInt(page)
                        }
                    }
                );
                return { cars }
            }

            let cars = axios.get(
                `https://b10-a11-server-side-beryl.vercel.app/available-cars`,
                {
                    params: {
                        ...filter,
                        limit: parseInt(limit),
                        page: parseInt(page)
                    }
                }
            )

            return { cars }
        }
    },
    {
        path: "/car-details/:id",
        element: <PrivateRoute> <CarDetails /> </PrivateRoute>,
    },
    {
        path: '*',
        element: <ErrorPage />
    },
]

export { mainRoutes }