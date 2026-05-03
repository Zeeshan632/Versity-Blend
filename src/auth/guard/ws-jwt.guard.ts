// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class WsJwtGuard extends AuthGuard('jwt') {
//   getRequest(context: ExecutionContext) {
//     const client: Socket = context.switchToWs().getClient();

//     return {
//       headers: {
//         authorization: `Bearer ${client.handshake.auth?.token}`,
//       },
//     };
//   }
// }
