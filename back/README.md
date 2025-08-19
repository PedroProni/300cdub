<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">300cdub API</h1>

<p align="center">
  A robust NestJS API for product management with MongoDB integration, built using Clean Architecture and Domain-Driven Design (DDD) principles.
</p>

<p align="center">
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-20+-green.svg" alt="Node.js Version" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-11.0+-red.svg" alt="NestJS Version" /></a>
  <a href="https://www.mongodb.com/" target="_blank"><img src="https://img.shields.io/badge/MongoDB-8.0+-green.svg" alt="MongoDB Version" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5.7+-blue.svg" alt="TypeScript Version" /></a>
</p>

## 📋 Description

The 300cdub-API is a comprehensive product management system built with NestJS and MongoDB. It follows Clean Architecture principles with Domain-Driven Design (DDD) to ensure maintainability, testability, and scalability. The API provides complete CRUD operations for products with associated images, robust authentication, and comprehensive security measures.

## 🏗️ Architecture

- **Clean Architecture** with Domain-Driven Design (DDD)
- **Layered Architecture**: Domain, Application, Infrastructure, and Presentation
- **Repository Pattern** for data abstraction
- **Command Pattern** for business operations
- **Mapper Pattern** for data transformation between layers

### 📁 Project Structure

```
src/
├── application/           # Application layer (Use Cases, Commands, Mappers)
│   ├── commands/         # Command objects
│   ├── mappers/          # Application-level mappers
│   └── use-cases/        # Business use cases
├── common/               # Shared utilities and configurations
│   ├── env/              # Environment configuration
│   └── helpers/          # Helper functions and utilities
├── domain/               # Domain layer (Entities, Repositories, Business Logic)
│   ├── entities/         # Domain entities
│   ├── mappers/          # Domain-level mappers
│   ├── repositories/     # Repository interfaces
│   └── tokens/           # Dependency injection tokens
├── infrastructure/       # Infrastructure layer (Database, External Services)
│   ├── auth/             # Authentication services
│   ├── database/         # Database configurations and persistence
│   ├── documentation/    # API documentation setup
│   ├── health/           # Health check endpoints
│   └── http-security/    # Security configurations
├── presentation/         # Presentation layer (Controllers, DTOs)
│   └── controllers/      # API controllers
└── shared/               # Shared DTOs and interfaces
    ├── dtos/             # Data Transfer Objects
    └── interfaces/       # Shared interfaces
```

## 🚀 Features

- ✅ **Complete Product Management** - CRUD operations for products
- ✅ **Image Management** - Multiple images per product with positioning
- ✅ **Pagination Support** - Efficient data retrieval with pagination
- ✅ **Advanced Filtering** - Filter products by ID or other criteria
- ✅ **Token-based Authentication** - Secure API access
- ✅ **Input Validation** - Robust data validation with class-validator
- ✅ **API Documentation** - Comprehensive Swagger/OpenAPI documentation
- ✅ **Health Checks** - Application and database health monitoring
- ✅ **Security Headers** - Helmet, CORS, CSRF protection
- ✅ **Error Handling** - Structured error responses
- ✅ **Docker Support** - Containerized deployment

## 🛠️ Technologies

- **Framework**: NestJS 11.0+
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript 5.7+
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, CSRF protection
- **Health Checks**: @nestjs/terminus
- **Authentication**: Token-based authentication
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📦 Installation

### Prerequisites

- Node.js 20+
- MongoDB 8.0+
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/pedro-proni/300cdub-api.git
   cd 300cdub-api/application
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/300cdub

   # Authentication
   AUTH_TOKEN=your-secret-token-here

   # CORS Configuration
   LOCAL_DOMAIN=http://localhost:3000
   PROD_DOMAIN=https://your-production-domain.com

   # Application
   PORT=3000
   NODE_ENV=development
   ```

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Once the application is running, visit:

- **Swagger UI**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

### 🔗 Main Endpoints

| Method   | Endpoint           | Description                  |
| -------- | ------------------ | ---------------------------- |
| `POST`   | `/product`         | Create a new product         |
| `GET`    | `/product`         | Get products with pagination |
| `GET`    | `/product?id={id}` | Get product by ID            |
| `PUT`    | `/product/{id}`    | Update an existing product   |
| `DELETE` | `/product/{id}`    | Delete a product             |
| `GET`    | `/health`          | Health check endpoint        |

## 🧪 Testing

### 🐳 Run with Docker Compose (Recommended)

```yaml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/300cdub
      - AUTH_TOKEN=your-token-here
    depends_on:
      - mongo

  mongo:
    image: mongo:8.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

To start the services, run:

```bash
docker-compose up
```

## 🔒 Security Features

- **Helmet**: Security headers configuration
- **CORS**: Cross-origin resource sharing protection
- **CSRF**: Cross-site request forgery protection
- **Input Validation**: Strict input validation and sanitization
- **Authentication**: Token-based API authentication
- **Rate Limiting**: Configurable rate limiting (can be added)

## 👨‍💻 Author

- **Pedro Proni** - [GitHub Profile](https://github.com/pedro-proni)

## 📞 Support

For support and questions:

- 📧 Create an issue on GitHub
- 📖 Check the [API Documentation](http://localhost:3000/api)
- 🔍 Review the project structure and code examples

---

<p align="center">Made with ❤️ using NestJS and TypeScript</p>
