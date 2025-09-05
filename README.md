# Paris Indoor Soccer League

A modern web application for tracking and displaying the standings of a local indoor soccer league. Built with the MERN stack and Vite.

## Tech Stack

### Frontend

-   **React 18** - Modern UI library with hooks
-   **Vite** - Fast build tool and development server
-   **Tailwind CSS** - Utility-first CSS framework
-   **Headless UI** - Unstyled, accessible UI components
-   **React Icons** - Popular icon library

### Backend

-   **Node.js** - JavaScript runtime
-   **Express.js** - Web application framework
-   **MongoDB** - NoSQL database
-   **Mongoose** - MongoDB object modeling

### Additional Tools

-   **Axios** - HTTP client for API requests
-   **Local Storage** - Client-side token storage

## Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or cloud instance)
-   npm or yarn package manager

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/carvnich/paris-indoor-soccer
    cd paris-indoor-soccer
    ```

2. **Install frontend dependencies**

    ```bash
    cd frontend
    npm install
    cd ..
    ```

3. **Install backend dependencies**

    ```bash
    cd backend
    npm install
    cd ..
    ```

4. **Environment Setup**

    Create a `.env` file in the frontend directory:

    ```env
    VITE_BACKEND_URL=http://localhost:8000
    ```

    Create a `.env` file in the backend directory:

    ```env
    MONGODB_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret-key
    PORT=8000
    ```

5. **Start the development servers**

    Terminal 1 (Backend):

    ```bash
    cd backend
    npm run dev
    ```

    Terminal 2 (Frontend):

    ```bash
    cd frontend
    npm run dev
    ```

6. **Open your browser**

    Navigate to `http://localhost:5173`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the Paris Indoor Soccer League community.
