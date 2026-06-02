import { PartialType } from '@nestjs/swagger';
import { CreateTransactionRequest } from './create-transaction.request';

export class UpdateTransactionRequest extends PartialType(
  CreateTransactionRequest,
) {}
