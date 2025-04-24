# Exact Online Backend

The Exact Online Backend is a robust Node.js-based API server for an e-commerce mobile application. It powers key features such as phone number-based authentication, product and service listings, reels, real-time chat, and notifications. The backend integrates with PostgreSQL for data storage, uses Socket.IO for real-time communication, and provides Swagger-based API documentation.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Real-Time Features](#real-time-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Phone Number Authentication**: Secure user login using SMS-based authentication.
- **Product and Service Listings**: Manage products, categories, specifications, and service offerings.
- **Reels**: Support for short video content with statistics tracking.
- **Real-Time Chat**: In-app messaging with Socket.IO for seamless communication.
- **Notifications**: Push notifications for orders, promotions, and updates.
- **Shopping Cart and Orders**: Manage cart products, orders, and order history.
- **Shop Management**: Features for shop profiles, calendars, documents, and subscriptions.
- **Promotions and Ads**: Handle promoted products, banners, and ad dimensions.
- **Favorites and Reviews**: Allow users to favorite products and leave reviews.

## Technologies
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for building RESTful APIs.
- **PostgreSQL**: Relational database with Sequelize ORM.
- **Socket.IO**: Real-time communication for chat and notifications.
- **Swagger**: API documentation with `swagger-ui-express` and `swagger-autogen`.
- **Multer**: File uploads for product images, service images, and reels.
- **JWT and Bcrypt**: Secure authentication and password hashing.
- **Winston and Logtail**: Logging for debugging and monitoring.
- **Axios and Cheerio**: HTTP requests and web scraping utilities.
- **Fluent-FFmpeg**: Video processing for reels.
- **dotenv**: Environment variable management.

## Prerequisites
- **Node.js**: v16 or higher
- **PostgreSQL**: v13 or higher
- **Git**: For cloning the repository
- **SMS Service Account**: For phone number authentication (e.g., configured via `SMS_AUTH`)
- **Gmail Account**: For email notifications (configured via `GMAIL_USER` and `GMAIL_PASS`)
- **Google Cloud Credentials**: For specific integrations (configured via `GOOGLE_PRIVATE_KEY`)

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
   createdb exact_online
   npx sequelize-cli db:migrate
   ```

## Configuration
Create a `.env` file in the root directory with the following environment variables:

```bash
# Database
DB_USERNAME=postgres
DB_PASSWORD=ExactOnline@2025
DB_NAME=exact_online
DB_HOST=146.190.53.96

# Authentication
SMS_AUTH="smms"
ACCESS_TOKEN="token"
JWT_SECRET=your_jwt_secret

# Email
GMAIL_USER=email
GMAIL_PASS=password

# Application
PORT=5000
NODE_ENV=development

```

**Note**: Ensure sensitive data (e.g., `ACCESS_TOKEN`, `GMAIL_PASS`, `GOOGLE_PRIVATE_KEY`) is kept secure and not exposed in public repositories.

## Running the Application
1. Start the server:
   ```bash
   npm start
   ```

2. The application will be available at `http://localhost:5000`.

3. Access the API documentation at `http://localhost:5000/api-docs` or the hosted version at [https://api.exactonline.co.tz/api-docs](https://api.exactonline.co.tz/api-docs).

## API Endpoints
The backend exposes a wide range of RESTful APIs. Key endpoints include:

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/users`                     | Retrieve user profiles               |
| POST   | `/users/login`               | Authenticate via phone number        |
| GET    | `/products`                  | List all products                    |
| POST   | `/products`                  | Create a new product                 |
| GET    | `/services`                  | List all services                    |
| GET    | `/reels`                     | Retrieve reels for the app           |
| POST   | `/orders`                    | Create a new order                   |
| GET    | `/chats`                     | Retrieve user chat sessions          |

For a complete list of endpoints, refer to the [API documentation](https://api.exactonline.co.tz/api-docs).

Example request:
```bash
curl -X GET http://localhost:5000/products \
  -H "Authorization: Bearer your_jwt_token"
```

## Real-Time Features
The backend uses Socket.IO for real-time features such as:
- **Chat**: Real-time messaging between users (`/chats`, `/messages`).
- **Notifications**: Instant updates for order status, promotions, etc. (`/notifications`).

To connect to the Socket.IO server:
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('connect', () => {
  console.log('Connected to server');
});
```

## Testing
The test suite is not yet implemented. To add tests:
1. Install a testing framework like Jest:
   ```bash
   npm install --save-dev jest
   ```
2. Update the `package.json` test script:
   ```json
   "scripts": {
     "test": "jest"
   }
   ```
3. Create test files in a `__tests__` directory.

Run tests with:
```bash
npm test
```

## Deployment
To deploy the application (e.g., to a platform like Render or AWS):
1. Ensure the `.env` variables are set in the deployment environment.
2. Build and start the application:
   ```bash
   npm install
   node index.js
   ```

For Docker-based deployment:
1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:16
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```
2. Build and run:
   ```bash
   docker build -t exact-online-backend .
   docker run -p 5000:5000 --env-file .env exact-online-backend
   ```

**Note**: Update `DB_HOST` and other environment variables for production.

## Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please adhere to the following:
- Use ESLint for code formatting.
- Write clear commit messages.
- Test changes locally before submitting.

Report issues or suggest features via [GitHub Issues](https://github.com/your-username/exact-online-backend/issues).

## License
This project is licensed under the ISC License. See the [LICENSE](./LICENSE) file for details.
