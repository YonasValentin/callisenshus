# Callisenshus (callisenshus)

**A washing machine reservation system for Callisenshus**, built with Quasar (Vue 3, Typescript, Vite), designed for managing bookings of laundry facilities with dynamic time slot availability based on existing reservations.

## Project Setup

This project was generated with Quasar CLI using the following setup:

- **Quasar Version**: v2 (Vue 3 | latest and greatest)
- **Script Type**: Typescript
- **Build Tool**: Vite
- **Package Name**: callisenshus
- **Product Name**: Callisenshus

## Features

- **Booking System**: Allows users to select machines, dates, and time slots for laundry reservation.
- **Dynamic Time Slot Availability**: Time slots are dynamically disabled based on existing reservations for the selected date.
- **Responsive Design**: Works seamlessly across devices (desktop, tablet, mobile).
- **Supabase Integration**: Backend powered by Supabase for managing reservations.
- **Validation**: Users can only select valid dates (within the next 7 days) and available time slots.
- **Real-Time Reservation Updates**: The system automatically fetches the latest reservations when a date is selected or a new booking is made.

## Install the Dependencies

Run the following command to install the project dependencies:

```bash
yarn
# or
npm install
```

## Start the App in Development Mode

Start the development server with hot-code reloading, error reporting, etc.:

```bash
quasar dev
```

## Lint the Files

To run the linter for identifying and fixing code issues:

```bash
yarn lint
# or
npm run lint
```

## Format the Files

Automatically format the code files to maintain consistency:

```bash
yarn format
# or
npm run format
```

## Build the App for Production

Compile the app for production with optimized performance:

```bash
quasar build
```

## Customize the Configuration

To customize Quasar's configuration, see the official documentation: [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
