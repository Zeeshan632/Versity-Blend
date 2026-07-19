# Versity Blend Backend

A scalable backend API for a university-focused social networking platform built with **NestJS**, **PostgreSQL**, and **TypeORM**.

The platform enables students from verified universities to connect, communicate, and engage through posts, comments, likes, groups, direct messaging, notifications, and university-specific communities.

The project follows a modular architecture and incorporates authentication, authorization, real-time communication, media uploads, and event-driven notifications.

---

## Project Overview

Versity Blend is designed to provide students with a dedicated social platform where interaction is restricted to verified university members.

Unlike traditional social media platforms, communities are automatically organized around universities, creating a secure and focused environment for academic collaboration and student engagement.

The backend exposes a REST API and WebSocket services that power features including authentication, user management, social interactions, messaging, notifications, and media management.

---
## Documentation

For a deeper understanding of the project's architecture and design decisions, refer to the following documents:

| Document | Description |
|----------|-------------|
| **[Architecture](./ARCHITECTURE.md)** | Detailed explanation of the backend architecture, request lifecycle, module interactions, WebSocket communication, and notification flow. |
| **[System Design](./SYSTEM_DESIGN.md)** | Scalability considerations, caching strategies, deployment architecture, and future improvements. |
| **API Reference** *(Coming Soon)* | Detailed API documentation and endpoint reference. |

## Features

### Authentication

- User Registration
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Login & Logout
- Secure User Sessions

### User Management

- User Profiles
- Profile Updates
- University Association
- Avatar Management

### Universities

- University Registration
- University Lookup
- University-based Communities

### Groups

- Create Groups
- Join Groups
- Group Management

### Posts

- Create Posts
- Update Posts
- Delete Posts
- Image Upload Support
- Feed Retrieval

### Comments

- Add Comments
- Delete Comments
- Retrieve Post Comments

### Likes

- Like Posts
- Unlike Posts
- Retrieve Likes

### Notifications

- Event-driven Notification System
- Like Notifications
- Comment Notifications
- Read/Unread Notifications

### Messaging

- One-to-One Conversations
- Group Conversations
- Real-time Messaging
- WebSocket Connections

### File Upload

- Cloudinary Integration
- Image Uploads
- Media Management

### Administration

- Administrative Endpoints
- Role-based Operations

---

## Technology Stack

### Backend

- NestJS
- TypeScript
- Node.js

### Database

- PostgreSQL
- TypeORM

### Authentication

- Passport
- JWT
- bcrypt

### Real-Time Communication

- Native WebSockets (`ws`)

### File Storage

- Cloudinary
- Multer

### Validation

- class-validator
- class-transformer

### Scheduling

- @nestjs/schedule

---

## Architecture

The project follows NestJS's modular architecture, where each business domain is encapsulated within its own module.

```
Controller
     │
     ▼
 Service
     │
     ▼
Repository (TypeORM)
     │
     ▼
 PostgreSQL
```

Each module contains its own:

- Controller
- Service
- Entity
- DTOs
- Repository Access

This separation keeps the codebase maintainable and scalable as the application grows.

---

## Core Modules

```
src
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

---

## Authentication Flow

```
Client
   │
   ▼
Login
   │
   ▼
JWT Generated
   │
   ▼
Protected Routes
   │
   ▼
JWT Guard
   │
   ▼
Controller
```

---

## Real-Time Messaging

The application uses native WebSockets (`ws`) instead of Socket.IO to provide real-time communication.

Connected users are managed through a dedicated connection service, allowing authenticated clients to exchange messages without polling.

---

## Notifications

The notification system follows an event-driven architecture.

Actions such as:

- Liking a Post
- Commenting on a Post

emit application events which are processed independently by notification listeners.

This keeps business modules loosely coupled and easier to maintain.

---

## Database

The application uses PostgreSQL with TypeORM for object-relational mapping.

Major entities include:

- User
- University
- Group
- Post
- Comment
- Like
- Conversation
- Message
- Notification

Relationships are implemented using TypeORM decorators including:

- OneToMany
- ManyToOne
- ManyToMany

---

## File Uploads

Media uploads are handled using:

- Multer
- Cloudinary

Uploaded images are stored remotely, allowing the backend to remain stateless.

---

## Validation

Incoming requests are validated using:

- class-validator
- class-transformer

ensuring data integrity before reaching business logic.

---

## Project Structure

```
src/
│
├── auth/
├── user/
├── universities/
├── groups/
├── posts/
├── likes/
├── comments/
├── notifications/
├── realtime/
├── chat/
├── upload/
├── admin/
└── election/
```

---

## Installation

```bash
git clone https://github.com/Zeeshan632/Versity-Blend.git

cd Versity-Blend

npm install
```

---

## Environment Variables

Create a `.env` file.

```env
DATABASE_HOST=

DATABASE_PORT=

DATABASE_USERNAME=

DATABASE_PASSWORD=

DATABASE_NAME=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## Running the Project

Development

```bash
npm run start:dev
```

Production

```bash
npm run build

npm run start:prod
```

---

## API Documentation

Swagger documentation is available after running the project.

```
/api/docs
```

---

## Future Improvements

- Redis Caching
- Horizontal Scaling
- Background Queues
- Email Notifications
- Push Notifications
- Rate Limiting
- API Versioning
- CI/CD Pipeline
- Docker Deployment
- Kubernetes Support

---

## Author

**Zeeshan Ali**

Backend Developer

GitHub:
https://github.com/Zeeshan632

---

## License

This project is licensed under the MIT License.