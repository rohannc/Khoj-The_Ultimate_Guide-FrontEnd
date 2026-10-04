# Khoj: The Ultimate Healthcare Platform (FrontEnd)

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-brightgreen.svg?logo=vuedotjs)](https://vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0-yellow.svg)](https://pinia.vuejs.org/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-4.5-blue.svg)](https://router.vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel-black.svg?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Khoj** is an enterprise-grade, multi-tenant digital healthcare management frontend designed for modern hospitals, clinics, practitioners, and patients. Built with **Vue 3 (Composition API)**, **Pinia**, **Tailwind CSS**, and **Axios**, it delivers role-tailored portals with real-time appointment booking, queue tracking, prescription management, health records, and clinic affiliation negotiations.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture & Portals](#️-system-architecture--portals)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔗 Live Backend & API Specs](#-live-backend--api-specs)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [☁️ Vercel Deployment Guide](#️-vercel-deployment-guide)
- [📜 Git Commit Message Convention](#-git-commit-message-convention)
- [📄 License](#-license)

---

## ✨ Key Features

- **🔐 Multi-Role Authentication & Onboarding:**
  - Dedicated sign-in and multi-step registration pipelines for **Patients**, **Doctors**, and **Clinics**.
  - Dynamic role theme accents (Blue for Patient, Teal for Doctor, Rose for Clinic).
- **🛡️ JWT Token Management & Auto-Rotation:**
  - Double interceptor architecture: proactive token expiration checks and silent `401 Unauthorized` token refresh with queued requests.
  - Safe, non-blocking asynchronous session termination with instant local storage wipe.
- **🚦 Role-Based Access Control (RBAC):**
  - Navigation guards guarding routes by role, active authentication state, and session validity.
- **🏥 Healthcare Directory & Search:**
  - Real-time directory to explore doctors and clinics filtered by medical specialization, city, pin code, and gender.
- **📅 Patient Portal:**
  - Immediate appointment scheduling, queue token tracking, vitals tracking, interactive prescriptions, and downloadable records.
- **🩺 Doctor Portal:**
  - Today's appointment schedules, patient history, medication management, and affiliation request management.
- **🏢 Clinic Portal:**
  - Centralized consultation tracking, affiliated doctor shift management, and facility queue administration.
- **🔔 Live Notifications:**
  - Interactive notification centre with unread counters, mark-as-read toggles, and status badges.

---

## 🏗️ System Architecture & Portals

```
                      ┌────────────────────────────┐
                      │    Khoj Landing Page &     │
                      │  Search Directory (/search)│
                      └──────────────┬─────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
            ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
            │   Patient    │  │   Doctor    │  │   Clinic    │
            │    Portal    │  │   Portal    │  │   Portal    │
            ├──────────────┤  ├──────────────┤  ├──────────────┤
            │ Appointments │  │ Appointments │  │ Consultation│
            │ Prescriptions│  │ Schedule     │  │ Doctors     │
            │ Records      │  │ Patients     │  │ Queue       │
            │ Profile      │  │ Affiliations │  │ Profile     │
            └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Vue.js 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| **Build Tool** | [Vite 7](https://vitejs.dev/) |
| **State Management** | [Pinia 3](https://pinia.vuejs.org/) |
| **Routing** | [Vue Router 4](https://router.vuejs.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + Scoped CSS |
| **HTTP Client** | [Axios](https://axios-http.com/) (with JWT Interceptors & Refresh Queue) |
| **Icons & Assets** | [@heroicons/vue](https://heroicons.com/), SVG Icons |

---

## 🔗 Live Backend & API Specs

- **Base URL:** `https://khoj-the-ultimate-guide.onrender.com`
- **Interactive Swagger Documentation:** [https://khoj-the-ultimate-guide.onrender.com/swagger-ui/index.html](https://khoj-the-ultimate-guide.onrender.com/swagger-ui/index.html)
- **OpenAPI Schema (JSON):** `https://khoj-the-ultimate-guide.onrender.com/v3/api-docs`

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (`>= 20.19.0` or `>= 22.12.0`)
- [npm](https://www.npmjs.com/) (bundled with Node)

### Local Setup
```bash
# 1. Clone the repository
git clone https://github.com/rohannc/Khoj-The_Ultimate_Guide-FrontEnd.git
cd Khoj-The_Ultimate_Guide-FrontEnd

# 2. Install dependencies
npm install

# 3. Create .env file with backend target
echo VITE_API_BASE_URL=https://khoj-the-ultimate-guide.onrender.com > .env

# 4. Start Vite development server
npm run dev
```

The app will be accessible at `http://localhost:5173`.

---

## ⚙️ Environment Configuration

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend REST service | `https://khoj-the-ultimate-guide.onrender.com` |

---

## ☁️ Vercel Deployment Guide

1. Push your latest code to your GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **"Add New..." > "Project"**.
3. Import `Khoj-The_Ultimate_Guide-FrontEnd`.
4. Under **Configure Project**:
   - **Framework Preset**: `Vite` (auto-detected).
   - **Root Directory**: `./`.
   - In **Environment Variables**, add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://khoj-the-ultimate-guide.onrender.com`
5. Click **Deploy**.
6. The included [`vercel.json`](file:///d:/Desktop/Khoj-The_Ultimate_Guide-FrontEnd/vercel.json) handles client-side routing rewrites (`/(.*) -> /index.html`) automatically.

---

## 📜 Git Commit Message Convention

This project strictly follows the **Capitalized Conventional Commit** standard:

```text
Type : Description
```

*Note: Type and Description must each have their first letter capitalized, with exactly one space on each side of the colon (`Type : Description`).*

### Supported Types:
- **`Feat :`** A new feature or user-facing functionality.
- **`Fix :`** A bug fix or error resolution.
- **`Style :`** Visual UI styling, color palettes, layouts, or CSS adjustments without logic changes.
- **`Chore :`** Configuration, dependencies, `.env`, tooling, or build scripts.
- **`Refactor :`** Code reorganization or optimization without behavioral changes.
- **`Docs :`** Documentation updates, guides, or README additions.
- **`Perf :`** Performance improvements or bundle size optimizations.

### Approved Examples:
- `Feat : Add step-by-step patient appointment booking modal`
- `Fix : Prevent logout hang and ensure immediate redirect`
- `Style : Refine All Genders select dropdown with custom chevron and icon`
- `Chore : Configure Vercel SPA routing and dynamic API URLs`
- `Docs : Update comprehensive project README with deployment guide`

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
