# Khoj: A Modern Healthcare Platform Frontend

![Vue.js](https://img.shields.io/badge/vue.js-3.x-brightgreen.svg)
![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow.svg)
![Vue Router](https://img.shields.io/badge/Vue_Router-4.x-blue.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

Khoj is a comprehensive, multi-role frontend application for a modern healthcare management system. Built with Vue.js 3 (Composition API) and Pinia for state management, it provides tailored dashboard experiences for patients, doctors, and clinic administrators, ensuring a secure and intuitive user journey.

**[Live Demo (Link to your deployed application)]**

![Khoj Dashboard Showcase] In Progress

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

## 📂 Project Structure

The project follows a standard Vue 3 application structure to ensure maintainability and scalability.
