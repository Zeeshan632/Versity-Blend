import {Module } from '@nestjs/common';
import { ConnectedClientsService } from './connected-clients.service';

@Module({
    providers: [ConnectedClientsService],
    exports: [ConnectedClientsService]
})

export class RealtimeModule {}