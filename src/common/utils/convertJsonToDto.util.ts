import { BadRequestException } from '@nestjs/common';
import { formatValidationErrors } from './formatValidationErrors.util';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export async function convertJsonToDto<T extends object>(
  data: string,
  dto: new () => T,
): Promise<T> {
  let parsedData: unknown;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    throw new BadRequestException('Invalid JSON format');
  }

  const body: T = plainToInstance(dto, parsedData);
  const err = await validate(body);
  if (err.length) throw new BadRequestException(formatValidationErrors(err));

  return body;
}
