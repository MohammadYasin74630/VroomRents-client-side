import PrivateRoute from "../pages/PrivateRoute/PrivateRoute";
import AddCar from "../pages/AddCar/AddCar";
import MyCars from "../pages/MyCars/MyCars";
import MyBookings from "../pages/MyBookings/MyBookings";

export const userRoutes = [
    {
        path: "/add-car",
        element: <PrivateRoute> <AddCar /> </PrivateRoute>
    },
    {
        path: "/my-cars",
        element: <PrivateRoute> <MyCars /> </PrivateRoute>
    },
    {
        path: "/my-bookings",
        element: <PrivateRoute> <MyBookings/> </PrivateRoute>
    },
]