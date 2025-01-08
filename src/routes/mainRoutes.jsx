import ErrorPage from "../pages/Error-404/ErrorPage"
import Home from "../pages/Home/Home"


const mainRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/available-cars',
        element: <h1>all available 🚗</h1>
    },
    {
        path: '*',
        element: <ErrorPage />
    },
]

export { mainRoutes }