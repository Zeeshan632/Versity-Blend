# System Architecture

This document explains the architectural decisions behind the **Versity Blend Backend**, including module interactions, request lifecycle, authentication, real-time communication, and event-driven notifications.

---

# Table of Contents

- Overview
- High-Level Architecture
- Request Lifecycle
- Module Structure
- Authentication Flow
- WebSocket Architecture
- Notification Architecture
- Database Architecture
- File Upload Flow
- Design Principles
- Scalability

---

# Overview

Versity Blend follows a **modular layered architecture** using NestJS.

Business logic is organized into isolated feature modules, each responsible for a single domain of the application.

The backend exposes:

- REST APIs
- WebSocket Services
- Event-driven Notifications

All modules communicate through clearly defined service boundaries.

---

# High-Level Architecture

```mermaid
flowchart LR

Client["Client (Mobile/Web)"]

API["NestJS REST API"]

WS["WebSocket Server"]

Auth["Authentication"]

Services["Business Services"]

DB[(PostgreSQL)]

Cloudinary[(Cloudinary)]

Client --> API
Client --> WS

API --> Auth
API --> Services

WS --> Auth
WS --> Services

Services --> DB
Services --> Cloudinary
```

---

# Backend Layers

```mermaid
flowchart TD

Controller

Service

Repository

Database[(PostgreSQL)]

Controller --> Service

Service --> Repository

Repository --> Database
```

Each layer has a single responsibility.

| Layer | Responsibility |
|---------|----------------|
| Controller | Accept HTTP Requests |
| Service | Business Logic |
| Repository | Database Access |
| Database | Persistent Storage |

---

# Request Lifecycle

```mermaid
sequenceDiagram

participant Client

participant Controller

participant Service

participant Repository

participant PostgreSQL

Client->>Controller: HTTP Request

Controller->>Service: Validate DTO

Service->>Repository: Query

Repository->>PostgreSQL: SQL

PostgreSQL-->>Repository: Data

Repository-->>Service: Entity

Service-->>Controller: Response DTO

Controller-->>Client: JSON Response
```

---

# Project Modules

```text
src
│
├── admin
├── auth
├── chat
├── comments
├── config
├── election
├── groups
├── likes
├── notifications
├── posts
├── realtime
├── types
├── universities
├── upload
└── user
```

Each module encapsulates:

- Controller
- Service
- DTOs
- Entities
- Business Logic

This minimizes coupling and improves maintainability.

---

# Authentication Flow

```mermaid
flowchart TD

Login --> AuthController

AuthController --> AuthService

AuthService --> VerifyPassword

VerifyPassword --> GenerateJWT

GenerateJWT --> Client

Client --> ProtectedRoute

ProtectedRoute --> JwtAuthGuard

JwtAuthGuard --> Controller
```

Authentication is based on JWT.

Passwords are securely hashed using **bcrypt** before storage.

---

# WebSocket Architecture

Unlike many projects that rely on Socket.IO, Versity Blend uses the native **ws** package.

```mermaid
flowchart LR

ClientA

ClientB

Gateway["WebSocket Gateway"]

Connections["ConnectedClientsService"]

Chat["ChatService"]

Database[(PostgreSQL)]

ClientA --> Gateway

ClientB --> Gateway

Gateway --> Connections

Gateway --> Chat

Chat --> Database

Connections --> ClientA

Connections --> ClientB
```

The `ConnectedClientsService` maintains active user connections and enables direct communication between authenticated clients.

---

# Notification Architecture

Notifications follow an **event-driven** approach.

Instead of directly creating notifications inside feature modules, business events are emitted and processed independently.

```mermaid
flowchart LR

LikeService

CommentService

EventEmitter

NotificationListener

NotificationService

Database[(Notifications)]

LikeService --> EventEmitter

CommentService --> EventEmitter

EventEmitter --> NotificationListener

NotificationListener --> NotificationService

NotificationService --> Database
```

Benefits:

- Loose coupling
- Easier testing
- Independent business modules
- Better scalability

---

# File Upload Flow

```mermaid
flowchart LR

Client

PostController

UploadService

Cloudinary

Database

Client --> PostController

PostController --> UploadService

UploadService --> Cloudinary

Cloudinary --> UploadService

UploadService --> Database
```

Media files are uploaded to Cloudinary, allowing the backend to remain stateless.

---

# Database Architecture

The application uses PostgreSQL with TypeORM.

Core entities include:

- User
- University
- Group
- Post
- Comment
- Like
- Conversation
- Message
- Notification

Relationships are implemented using:

- OneToMany
- ManyToOne
- ManyToMany

---

# Design Principles

The backend follows several software engineering principles.

## Separation of Concerns

Each module owns its own business logic.

---

## Dependency Injection

NestJS Dependency Injection is used throughout the application.

---

## Layered Architecture

Controllers never access the database directly.

All business logic resides inside services.

---

## Event-Driven Communication

Modules communicate through events whenever possible instead of tight coupling.

---

## Stateless API

Application state is stored in PostgreSQL.

Uploaded files are stored externally using Cloudinary.

---

# Scalability Considerations

Current architecture supports future enhancements including:

- Redis caching
- Horizontal scaling
- Multiple WebSocket instances
- Background workers
- Message queues
- Docker deployment
- Kubernetes orchestration

The modular architecture allows individual domains to evolve independently without affecting the rest of the application.

---

# Future Improvements

- Distributed WebSocket communication using Redis Pub/Sub
- CQRS for complex business domains
- Event sourcing
- API versioning
- Distributed caching
- Monitoring and observability
- Rate limiting
- CI/CD pipeline