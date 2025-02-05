# VroomRents Frontend
This is the frontend repository for the *VroomRents* website, a user-friendly platform for renting cars, managing bookings and offers. The project is built with React.js and focuses on delivering an intuitive user experience across all devices.

🚀 **Live Site URL:** [https://vroom-rents.web.app/](https://vroom-rents.web.app/)

> Make sure to enable "third party cookies" from chrome setting, if you are facing auto logout issue. also disable all the browser extensions (Ex: ublock origin) if logout issue persists.

**Test account:**

Email: mohammadyasin74630@gmail.com <br/>
Password: Mess@sess

**Note:** To access the "**Add Car**" page, please ensure you have selected the "**I am a vendor**" option on your profile page. The link will remain **hidden** until this option is selected.

## 🎯 Project Purpose
*VroomRents* aims to simplify the process of renting cars by providing a feature-rich, responsive, and interactive platform. It supports user authentication, ~~real-time~~ car availability updates, and streamlined booking functionalities.

## 🌟 Key Features

### General Features
- **Responsive Design:** Optimized for mobile, tablet, and desktop screens.
- **Dynamic Navigation:** Tailored menus based on type of user.
- **Error Handling:** Custom 404 error page with navigation back to the homepage.

### Pages & Functionalities

1. **Home Page:**

    - Full-width banner with a call-to-action button.
    - Recent car listings displayed as cards with hover effects.
    - Highlight of platform benefits with a grid layout.

2. **Available Cars Page:**

    - Search and filter cars by model, brand, or location.
    - Toggle between grid and list views.
    - Sort by price or date added.

3. **Car Details Page (Private):**

    - Car image slides with availability status.
    - Detailed car information with Booking feature.

4. **Add Car Page (Private):**

    - Form to add cars with fields like model, price, availability, and images.
    - Supports file uploads using `react-dropzone`.

5. **My Cars Page (Private):**

    - Table view of all cars added by the user.
    - Features to update or delete cars with real-time table updates.
    - Sorting and infinite scroll pagination.

6. **My Bookings Page (Private):**

    - Detailed view of user bookings in a tabular layout.
    - ~~Modify or cancel bookings directly from this page.~~

7. **Login and Registration:**

    - Secure login with Firebase Authentication (Email/Password and Google).
    - JWT-based private route protection.
    - Input validation and error handling.

## 🛠️ Technology Stack

### Core Libraries

- **React.js:** For building a component-based UI.
- **React Router:** For navigation and route protection.
- **Tailwind CSS:** For styling the application.
- **Daisy UI:** For accessible pre made components.
- **Firebase Authentication:** For secure user login and registration.
- **Axios:** For efficient data fetching.

### Optional Libraries
- React Dropzone
- React Datepicker
- React Hot Toast
- React Tooltip
- React Icons
- React Tab
- Sweetalert2
- React Framer Motion
- ~~ReCharts~~

## 📝 Setup Instructions

1. Clone the repository:

    ```bash
    git clone https://github.com/mes-shahadat/B10A11-client-side.git
    cd B10A11-client-side
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure .env.local file (for firebase):

    ```bash
    VITE_apiKey=creadential
    VITE_authDomain=creadential
    VITE_projectId=creadential
    VITE_storageBucket=creadential
    VITE_messagingSenderId=creadential
    VITE_appId=creadential
    VITE_ImgbbAPI=creadential
    ```
4. Start the development server:

    ```bash
    npm run dev
    ```

**Note:** This git repo is corrupted, so cloning might cause failiure