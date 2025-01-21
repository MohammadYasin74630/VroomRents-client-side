import PrivateRoute from "../pages/PrivateRoute/PrivateRoute";
import AddCar from "../pages/AddCar/AddCar";

export const userRoutes = [
    {
        path: "/add-car",
        element: <PrivateRoute> <AddCar /> </PrivateRoute>
    }
]