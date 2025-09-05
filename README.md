# Khoj: A Modern Healthcare Platform Frontend - In Progress

![Vue.js](https://img.shields.io/badge/vue.js-3.x-brightgreen.svg)
![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow.svg)
![Vue Router](https://img.shields.io/badge/Vue_Router-4.x-blue.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

Khoj is a comprehensive, multi-role frontend application for a modern healthcare management system. Built with Vue.js 3 (Composition API) and Pinia for state management, it provides tailored dashboard experiences for patients, doctors, and clinic administrators, ensuring a secure and intuitive user journey.


## ✨ Key Features

* **🔐 Multi-Role Authentication:** Secure, distinct login and registration flows for three user types:
    * **Patients:** Manage health records, appointments, and prescriptions.
    * **Doctors:** View schedules, manage patient queues, and handle administrative tasks.
    * **Clinics:** Oversee operations, manage staff, and view clinic-wide analytics.
* **🛡️ JWT-based Secure Sessions:** Utilizes JSON Web Tokens (JWT) for authentication, with session persistence in `localStorage` for a seamless user experience.
* **🚦 Role-Based Access Control (RBAC):** A robust navigation guard system built with Vue Router protects routes and ensures users can only access dashboards and features appropriate for their role.
* **📊 Three Distinct Dashboards:** Each role is presented with a unique, feature-rich dashboard tailored to their specific needs and workflows.
* **📝 Dynamic & Reusable UI Components:** A clean and modern UI built with custom, reusable Vue components, including forms with validation, dropdowns, calendars, and data visualization widgets.
* **📱 Responsive Design:** Styled with scoped CSS for maintainability, ensuring a consistent and accessible experience on both desktop and mobile devices.
* **🔔 User Notifications:** Integrated alert banners for important actions like email verification and other critical updates.

## 🛠️ Technology Stack

* **Frontend Framework:** [Vue.js 3](https://vuejs.org/) (Composition API with `<script setup>`)
* **State Management:** [Pinia](https://pinia.vuejs.org/)
* **Routing:** [Vue Router](https://router.vuejs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **API Communication:** Native Fetch API


## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher)
* A package manager like [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/khoj-frontend.git](https://github.com/your-username/khoj-frontend.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd khoj-frontend
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```

### Environment Variables

This project requires a backend API to function correctly. You need to specify the base URL for the API in an environment file.

1.  Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
2.  Open the `.env` file and set the `VITE_API_BASE_URL` to your backend server's address.
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```

### Running the Application

1.  **Start the development server:**
    ```sh
    npm run dev
    ```
2.  Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

## 🔗 API Backend

This repository contains the **frontend application only**. For full functionality, it needs to be connected to a backend API that provides the necessary endpoints for:

* User registration (`/auth/register/...`)
* User login (`/auth/login/...`)
* Fetching role-specific dashboard data

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is distributed under the MIT License. See `LICENSE.txt` for more informat
