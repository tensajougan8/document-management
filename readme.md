# Document Management System

This is a **Document Management System (DMS)** built with a microservice architecture. The system is designed to manage document processing, uploading, and tracking. It is containerized using **Docker**, with **NestJS** as the backend framework, **PostgreSQL** as the database, and **RabbitMQ** as the message broker to facilitate event-driven communication between services.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Run the Project](#run-the-project)
4. [API Documentation](#api-documentation)
5. [Architecture and Design Decisions](#architecture-and-design-decisions)
6. [Benefits and Drawbacks](#benefits-and-drawbacks)
7. [Technologies Used](#technologies-used)
8. [License](#license)

---

## Overview

The **Document Management System (DMS)** is built to handle document uploads, process them, and track their status in a decoupled and scalable manner. The architecture follows a **microservices** approach to divide the system into smaller, independently deployable services. 

- **RabbitMQ** is used as a message broker to enable asynchronous event-driven communication between services.
- **PostgreSQL** serves as the relational database for storing document metadata.
- **NestJS** is used as the backend framework for building RESTful APIs, providing a modular and scalable architecture.
  
At present, the system is missing an **API Gateway**. This means that each service can be directly accessed via its own URL, but an API Gateway (such as Kong or Nginx) can be integrated later to handle routing, load balancing, and security.

---

## Prerequisites

To run this project locally, you'll need the following:

1. **Docker**: Version 20 or above. Docker will containerize the entire stack (NestJS, PostgreSQL, RabbitMQ).
2. **Node.js (v20 or above)**: Required to run the NestJS backend.
3. **PostgreSQL**: Relational database for storing document metadata.
4. **Docker Compose**: To orchestrate the Docker containers for running the services (NestJS, PostgreSQL, RabbitMQ).

Make sure all dependencies are installed and up-to-date before proceeding with the setup.

---

## Run the Project

Follow these steps to set up and run the project locally:

### 1. Clone the repository

Start by cloning the project to your local machine:

```bash
git clone https://github.com/your-username/document-management-system.git
cd document-management-system
docker-compose build
docker-compose up
The server will be running on localhost 80
URL http://localhost:80/auth-service/auth/register

```

## api-documentation

The API documentation for this project is provided via Swagger. The system uses NestJS with integrated Swagger support for API documentation.

### Viewing the API Documentation
1. Once the application is running, navigate to https://editor.swagger.io/ in your browser.
2. You'll see the Swagger interface displaying all the available API endpoints.
3. Copy paste the file here.
### Importing Swagger into Postman
1. Open Postman.
2. Click on the Import button in the top left.
3. Select File and upload the downloaded swagger.yaml file, or select Link if you have a hosted version of the file.
4. Postman will parse the Swagger file and automatically create a collection with all the API endpoints defined in the documentation.
This will allow you to interact with the APIs directly from Postman.

## architecture-and-design-decisions
### Microservices Architecture
The project follows a microservices architecture to separate different domains of functionality. Each microservice handles a specific part of the system and communicates with others via RabbitMQ (message broker). The system is designed to be loosely coupled, allowing for scalability and flexibility.

### Event-Driven Design
To ensure efficient communication between services, we leverage RabbitMQ as a message broker. This allows services to publish and consume events asynchronously. For instance, when a document is uploaded, a message may be sent to the RabbitMQ queue, notifying other services (e.g., document processing) of the event. This decouples the services and ensures non-blocking, parallel processing.

### PostgreSQL Database
We use PostgreSQL as the relational database to store metadata related to the documents being processed. PostgreSQL was chosen due to its scalability, robustness, and support for complex queries. It handles the relational data efficiently while maintaining strong ACID compliance.

### Missing API Gateway
Currently, the system does not include an API Gateway. An API Gateway would centralize routing, user authentication, rate limiting, and security. In the absence of this, each microservice can be accessed directly via its specific route, though this makes managing service calls more complex as the system scales.

In the future, adding an API Gateway (such as Kong, Nginx, or AWS API Gateway) will improve routing, load balancing, and centralized authentication across the system.

## benefits-and-drawbacks
### Benefits
1. Scalability: The microservice architecture allows each service to be scaled independently based on demand. For example, the document processing service can be scaled without affecting other parts of the system.
2. Asynchronous Processing: RabbitMQ facilitates asynchronous communication between services, ensuring non-blocking operations and better handling of high loads.
3. Flexibility: With microservices, each service can use different technologies and can be deployed independently, providing flexibility in the development process.
4. Fault Tolerance: The event-driven design provides a level of fault tolerance. If one service fails, other services can continue processing their tasks without being impacted.
### Drawbacks
1. Increased Complexity: Managing multiple services introduces complexity in terms of deployment, monitoring, and communication between services. Each service has its own lifecycle and versioning.
2. Operational Overhead: Running RabbitMQ and PostgreSQL alongside multiple microservices requires careful monitoring and scaling. This may increase the operational cost and complexity.
3. Missing API Gateway: Without an API Gateway, routing requests to individual services is more difficult, especially as the number of microservices grows. It also makes it harder to centralize security mechanisms (like JWT authentication) and logging.
## technologies-used
1. NestJS: A progressive Node.js framework for building efficient and scalable server-side applications.
2. PostgreSQL: Relational database for storing structured document metadata.
3. RabbitMQ: Message broker for asynchronous communication between microservices.
4. Docker: Containerization tool for creating isolated environments for each service.
5. Docker Compose: Tool for defining and running multi-container Docker applications.
6. Swagger: API documentation tool to automatically generate and serve API documentation for the project.