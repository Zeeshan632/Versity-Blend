# API Documentation Guide

## Overview

The Versity Blend API now includes comprehensive Swagger/OpenAPI documentation with minimal code intrusion. The documentation is automatically generated from TypeScript types and decorators.

---

## 📚 Accessing Documentation

### Swagger UI
Interactive API testing interface: **http://localhost:3000/api/docs**

**Features:**
- Try out API endpoints directly
- View request/response schemas
- Automatic authentication with JWT tokens
- Persistent authorization (tokens saved during session)

### OpenAPI JSON
Raw OpenAPI specification: **http://localhost:3000/api/docs-json**

Useful for:
- API client generation
- Integration with external tools
- Programmatic access to API schema

### Scalar API Reference
Modern, interactive API documentation: **http://localhost:3000/api/reference**

**Features:**
- Clean, modern UI
- Code examples in multiple languages
- Search functionality
- Keyboard shortcuts
- Beautiful schema visualization

---

## 🔐 Authentication

### JWT Bearer Token

Protected endpoints require JWT Bearer authentication.

**In Swagger UI:**
1. Click the "Authorize" button (top-right)
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click "Authorize"
4. Tokens persist for the browser session

**API Request Example:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/docs-json
```

---

## 📋 API Tags

All endpoints are organized into the following tags:

| Tag | Description |
|-----|-------------|
| **Authentication** | User registration and login |
| **Users** | User profile management |
| **Universities** | University information and management |
| **Groups** | Group creation and member management |
| **Posts** | Post creation, retrieval, and management |
| **Comments** | Comment creation and management |
| **Likes** | Like/unlike functionality for posts and comments |
| **Chat** | Real-time messaging and media sharing |
| **Notifications** | User notifications and alerts |
| **Election** | Campus elections and voting |
| **Admin** | Administrative operations |
| **Uploads** | File upload and media management |

---

## 🎯 Key Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login (returns JWT token)

### Users
- `GET /user/:id` - Get user profile
- `PATCH /user/profile-picture` - Upload profile picture

### Posts
- `POST /posts/create` - Create a post (supports file uploads)
- `GET /posts/global` - Get global posts
- `GET /posts/user/:userId` - Get posts from a user
- `PATCH /posts/update/:postId` - Update a post

### Comments
- `POST /comments/create/:postId` - Create a comment
- `PATCH /comments/update/:commentId` - Update a comment
- `DELETE /comments/delete/:commentId` - Delete a comment

### Likes
- `POST /likes/post/:postId` - Like a post
- `POST /likes/comment/:commentId` - Like a comment
- `GET /likes/post/:postId` - Get post likes

---

## 📤 File Upload Endpoints

The following endpoints support file uploads via `multipart/form-data`:

- **User Profile Picture:** `PATCH /user/profile-picture`
  - Field: `file` (binary)
  
- **Post Creation:** `POST /posts/create`
  - Field: `files` (array of binaries, up to 5 files)
  
- **Chat Image Upload:** `POST /chat/send-image`
  - Field: `image` (binary)

### Upload Example
```bash
curl -X POST http://localhost:3000/posts/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@image1.jpg" \
  -F "files=@image2.jpg" \
  -F "content=Check out these images!"
```

---

## 🔧 Configuration Details

### Swagger Setup (main.ts)

The Swagger configuration is defined in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Versity Blend API')
  .setDescription('University social networking platform...')
  .setVersion('1.0.0')
  .addBearerAuth(...)
  .addTag('Authentication', '...')
  // ... more tags
  .build();
```

**Key Features:**
- Automatic OpenAPI 3.0 generation
- JWT Bearer authentication configured globally
- Organized endpoints by tags
- Clean, minimal decorators

---

## 📝 Documentation Philosophy

The documentation follows these principles:

### 1. **Minimal Decorators**
- `@ApiTags()` - Groups endpoints by feature
- `@ApiBearerAuth()` - Marks protected endpoints
- `@ApiOperation()` - Clarifies endpoint purpose
- `@ApiOkResponse()` / `@ApiCreatedResponse()` - Documents successful responses

### 2. **Controller-Level Decorators**
- Tags and authentication are applied at the controller level
- Reduces code duplication
- Maintains clean, readable controllers

### 3. **Smart Type Inference**
- TypeScript types are automatically inferred
- DTOs are introspected for response schemas
- Validation decorators provide additional type hints

### 4. **File Upload Documentation**
- Documented using `@ApiConsumes()` and `@ApiBody()`
- Enables interactive testing in Swagger UI
- Provides schema information for client generation

---

## 🚀 Development Workflow

### Starting the Development Server

```bash
npm run start:dev
```

Then access documentation at:
- Swagger UI: http://localhost:3000/api/docs
- Scalar: http://localhost:3000/api/reference
- OpenAPI JSON: http://localhost:3000/api/docs-json

### Building for Production

```bash
npm run build
npm run start:prod
```

---

## 🔄 Updating Documentation

To update API documentation:

1. **Update Controller Decorators:**
   ```typescript
   @ApiTags('MyTag')
   @ApiBearerAuth('JWT-auth')
   @Controller('my-endpoint')
   ```

2. **Update Endpoint Operations:**
   ```typescript
   @ApiOperation({ summary: 'Clear description of what this does' })
   @ApiCreatedResponse({ description: 'Resource created successfully' })
   ```

3. **Document File Uploads:**
   ```typescript
   @ApiConsumes('multipart/form-data')
   @ApiBody({
     schema: {
       type: 'object',
       properties: {
         file: { type: 'string', format: 'binary' },
       },
     },
   })
   ```

4. **Rebuild and verify:**
   ```bash
   npm run build
   npm run start:dev
   ```

---

## 📚 Useful Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Scalar API Reference](https://scalar.com/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

---

## ✅ What's Included

✅ Clean Swagger UI at `/api/docs`  
✅ Scalar API Reference at `/api/reference`  
✅ OpenAPI JSON export at `/api/docs-json`  
✅ JWT Bearer authentication  
✅ Organized endpoints by tags  
✅ File upload documentation  
✅ Minimal code decoration  
✅ Type-safe responses  
✅ Interactive endpoint testing  

---

## 🎓 Example: Testing an Endpoint in Swagger UI

1. Navigate to http://localhost:3000/api/docs
2. Click "Authorize" and enter your JWT token
3. Find the endpoint (e.g., `POST /posts/create`)
4. Click "Try it out"
5. Fill in parameters and request body
6. Click "Execute"
7. View the response

---

Generated with Swagger & Scalar for Versity Blend API
