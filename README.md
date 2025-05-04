# **Invoice and Email Sender Microservices**

This repository contains two microservices built with **NestJS**:

1. **Invoice Service**: Manages the creation and retrieval of invoices.
2. **Email Sender Service**: Consumes daily sales reports from a RabbitMQ queue and sends an email with the summary.

These services are designed to work together to process invoices, generate daily sales reports, and send them via email.


## **Project Structure**
- **apps/**
  - **invoice-service/**
  - **email-sender/**
- **docker/**
  - **invoice-service.Dockerfile**
  - **email-sender.Dockerfile**
- **docker-compose.yml/**
- **.env.production/**
- **...**
### **Prerequisites (for local development)**

Before setting up the project, make sure you have the following tools installed:

- **Node.js** (>= 18.0.0)
- **Docker** (for containerizing the services)
- **Docker Compose** (for managing multi-container Docker applications)
- **RabbitMQ** (for message queuing, can be run via Docker)
- **MongoDB** (self-hosted or via Docker)
- **SendGrid API Key**: For sending emails




### **Run Localy**

```bash
  cd invoice-service
  npm install --save

  # start invoice-service
  npm run start:invoice-service

  # start email-sender
  npm run start:email-sender
```
    
### **Run with Docker (Recommended)**
```bash
  cd invoice-service
  docker compose up --build
```

### **Access Services**

**Invoice Service**: http://localhost:5000

**RabbitMQ UI:** http://localhost:15672
(Default login: guest / guest)

**MongoDB:** mongodb://localhost:27017