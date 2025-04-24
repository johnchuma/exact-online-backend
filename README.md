# Exact Online Backend Project

This is a backend application designed to integrate with Exact Online, a cloud-based business software for accounting, CRM, and ERP. The project provides a robust API to interact with Exact Online's services, enabling seamless data synchronization and automation for business processes.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- Secure authentication with Exact Online OAuth 2.0.
- CRUD operations for key Exact Online entities (e.g., accounts, invoices, and transactions).
- Real-time data synchronization with Exact Online.
- Error handling and logging for robust operation.
- Scalable architecture for handling high request volumes.

## Technologies
- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for creating RESTful APIs.
- **PostgreSQL**: Relational database for storing application data.
- **Axios**: HTTP client for making requests to Exact Online APIs.
- **Winston**: Logging library for debugging and monitoring.
- **Jest**: Testing framework for unit and integration tests.
- **Docker**: Containerization for consistent development and deployment.

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- Exact Online developer account and API credentials
- Docker (optional, for containerized deployment)
- Git

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/exact-online-backend.git
   cd exact-online-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the PostgreSQL database:
   ```bash
   createdb exact_online_db
   npm run migrate
   ```

## Configuration
Create a `.env` file in the root directory and add the following environment variables:

```bash
# Exact Online API
EXACT_CLIENT_ID=your_client_id
EXACT_CLIENT_SECRET=your_client_secret
EXACT_REDIRECT_URI=http://localhost:3000/auth/callback

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exact_online_db
DB_USER=your_username
DB_PASSWORD=your_password

# Application
PORT=3000
NODE_ENV=development
```

Refer to Exact Online's [API documentation](https://developers.exactonline.com/) for obtaining API credentials.

## Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```

2. The application will be available at `http://localhost:3000`.

## API Endpoints
Below are some example endpoints. See the full API documentation in `/docs/api.md` for details.

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/api/accounts`              | Retrieve a list of accounts          |
| POST   | `/api/invoices`              | Create a new invoice                 |
| PUT    | `/api/invoices/:id`          | Update an existing invoice           |
| GET    | `/api/auth/exact-online`     | Initiate OAuth 2.0 authentication    |

Example request:
```bash
curl -X GET http://localhost:3000/api/accounts \
  -H "Authorization: Bearer your_access_token"
```

## Testing
Run the test suite to ensure the application works as expected:
```bash
npm test
```

This includes unit tests for services and integration tests for API endpoints.

## Deployment
To deploy the application to a platform like Heroku:
1. Install the Heroku CLI.
2. Log in to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create
   ```
4. Set environment variables on Heroku:
   ```bash
   heroku config:set EXACT_CLIENT_ID=your_client_id
   ```
5. Deploy the application:
   ```bash
   git push heroku main
   ```

For Docker-based deployment:
```bash
docker build -t exact-online-backend .
docker run -p 3000:3000 exact-online-backend
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
