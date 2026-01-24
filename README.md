# NightTalk

NightTalk is a real-time chat application built with a modern full-stack architecture, featuring a Django backend, React frontend, and Kafka for robust message processing.

## 🚀 Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Django & Django Channels (presumed for async chat)
- **Messaging**: Apache Kafka & Zookeeper
- **Database**: PostgreSQL (NeonDB) / SQLite (for development)
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx

## 📂 Project Structure

```
nightTalk/
├── backend/            # Django backend application
├── frontend/           # React frontend application (Vite)
├── nginx/              # Nginx configuration
├── docker-compose.yml  # Container orchestration
└── README.md           # Project documentation
```

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) (for local frontend dev)
- [Python 3.x](https://www.python.org/) (for local backend dev)

## ⚡ Getting Started

### Using Docker (Recommended)

The easiest way to run NightTalk is using Docker Compose.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nightTalk
    ```

2.  **Configure Environment:**
    Ensure you have the necessary environment variables set up (Database URLs, Kafka brokers, etc.).

3.  **Start the services:**
    ```bash
    docker-compose up --build
    ```
    This will spin up the backend, frontend, and Nginx services.

4.  **Access the application:**
    - Frontend: `http://localhost:3000` (or local port mapping)
    - Backend API: `http://localhost:8000`

### Local Development

#### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies (ensure you have a `requirements.txt`):
    ```bash
    pip install -r requirements.txt
    ```
4.  Run migrations and start the server:
    ```bash
    python manage.py migrate
    python manage.py runserver
    ```

#### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📝 Features

- **Real-time Chat**: fast and reliable messaging.
- **Scalable Architecture**: decoupled services using Kafka.
- **Modern UI**: built with React.

## 🤝 Contributing

<<<<<<< HEAD
Contributions are welcome! Please fork the repository and submit a pull request.
=======
Contributions are welcome! Please fork the repository and submit a pull request.
>>>>>>> e5b20b2680aec9494cb21320d5a3df4b9c746e52
