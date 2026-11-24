# AITS Smart College Bus Tracking System

A full-stack, real-time college bus tracking application built for Annamacharya Institute of Technology and Sciences (AITS).

## Architecture

This project is built using a modern Next.js App Router architecture with Firebase serving as the backend.

### Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend & Auth**: Firebase (Authentication, Firestore, Realtime Database)
- **Maps**: Leaflet (`react-leaflet`)
- **PWA**: `next-pwa`

### Key Modules

- **Admin Portal (`/admin`)**: A comprehensive management dashboard for transport administrators. Handles CRUD operations for buses, drivers, routes, stops, and students.
- **Driver Portal (`/driver`)**: A highly optimized mobile PWA. Drivers log in, select their bus, and the portal transmits their GPS coordinates efficiently to Firebase Realtime Database.
- **Student Portal (`/student`)**: A live tracking interface where students can log in with their college Google account and monitor the location of their assigned bus on an interactive map.

### Data Flow

1. **Driver's Device**: Captures geolocation every few seconds. Validates accuracy and throttles polling based on speed to conserve battery.
2. **Firebase Realtime Database (RTDB)**: Receives high-frequency GPS ticks (`/live/$busId`).
3. **Student/Admin Dashboards**: Listeners subscribe to the RTDB node and dynamically animate Leaflet map markers without expensive page re-renders.

## Getting Started

Please see the following guides to get up and running:

- [INSTALL.md](./INSTALL.md) - For local development setup instructions.
- [DEPLOYMENT.md](./DEPLOYMENT.md) - For deploying the application to production.
- [CONTRIBUTING.md](./CONTRIBUTING.md) - For code structure and contribution guidelines.
