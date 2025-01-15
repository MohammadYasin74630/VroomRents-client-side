import axios from "axios"
import ErrorPage from "../pages/Error-404/ErrorPage"
import Home from "../pages/Home/Home"
import AvailableCars from "../pages/AvailableCars/AvailableCars"


const mainRoutes = [
    {
        path: '/',
        element: <Home />,
        loader: () => {
            let recentCars = axios.get("http://localhost:3000/recent-listings?limit=10")

            let carOffers = axios.get("http://localhost:3000/special-offers?limit=10")

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

            if (brand) {

                let cars = axios.get(
                    `http://localhost:3000/available-cars`,
                    {
                        params: {
                            brand: brand,
                            date: date,
                            price: price,
                            limit: parseInt(limit),
                            page: parseInt(page)
                        }
                    }
                );
                return { cars }
            }
            else if (model) {

                let cars = axios.get(
                    `http://localhost:3000/available-cars`,
                    {
                        params: {
                            model: model,
                            date: date,
                            price: price,
                            limit: parseInt(limit),
                            page: parseInt(page)
                        }
                    }
                );
                return { cars }
            }
            else if (location) {

                let cars = axios.get(
                    `http://localhost:3000/available-cars`,
                    {
                        params: {
                            location: location,
                            date: date,
                            price: price,
                            limit: parseInt(limit),
                            page: parseInt(page)
                        }
                    }
                );
                return { cars }
            }

            let cars = axios.get(
                `http://localhost:3000/available-cars`,
                {
                    params: {
                        date: date,
                        price: price,
                        limit: parseInt(limit),
                        page: parseInt(page)
                    }
                }
            )

            return { cars }
        }
    },
    {
        path: '*',
        element: <ErrorPage />
    },
]

export { mainRoutes }