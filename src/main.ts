import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Versity Blend API')
    .setDescription(
      'REST API for Versity Blend — a university social networking backend for campus communities, groups, posts, notifications, and real-time chat.',
    )
    .setVersion('1.0.0')
    .setContact(
      'Versity Blend API Support',
      'https://versityblend.app/support',
      'api-support@versityblend.app',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Local development server')
    .addServer('https://api.versityblend.app', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter a valid JWT access token to authorize secured endpoints',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User registration, login, and session management')
    .addTag('Users', 'User profile and account management')
    .addTag('Universities', 'University catalog and campus metadata')
    .addTag('Groups', 'Student group creation and membership management')
    .addTag('Posts', 'Campus posts, global announcements, and attachments')
    .addTag('Comments', 'Commenting on posts and discussion threads')
    .addTag('Likes', 'Like and unlike actions for posts and comments')
    .addTag('Chat', 'Real-time messaging and media uploads')
    .addTag('Notifications', 'User notifications, read state, and delivery')
    .addTag('Election', 'University election workflows and voting')
    .addTag('Admin', 'Administrative access and role-protected actions')
    .addTag('Uploads', 'Media upload endpoints and file validation')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Expose OpenAPI JSON at /api/docs-json
  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.json(document);
  });

  // Scalar API Reference route
  const handler = apiReference({
    openApiUrl: '/api/docs-json',
  });
  app.getHttpAdapter().get('/api/reference', handler);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
