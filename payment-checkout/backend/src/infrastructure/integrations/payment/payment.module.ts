import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentGateway } from './payment.gateway';
import { WompiGateway } from './wompi.gateway';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: PaymentGateway,
      useClass: WompiGateway,
    },
  ],
  exports: [PaymentGateway],
})
export class PaymentModule {}