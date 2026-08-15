export interface IPaymentGateway {
  processPayment(amount: number, currency: string, data: any): Promise<any>;
  refundPayment(transactionId: string): Promise<any>;
  getTransactionStatus(transactionId: string): Promise<any>;
}
