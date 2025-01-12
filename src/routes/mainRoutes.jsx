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

            return ({recentCars, carOffers, testimonial})
        }
    },
    {
        path: '/available-cars',
        element: <AvailableCars/>
    },
    {
        path: '*',
        element: <ErrorPage />
    },
]

export { mainRoutes }