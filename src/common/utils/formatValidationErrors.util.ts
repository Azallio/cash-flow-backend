import { ValidationError } from 'class-validator';

export const formatValidationErrors = (errors: ValidationError[]): string[] => {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    if (error.children && error.children.length > 0) {
      messages.push(...formatValidationErrors(error.children));
    }
  }

  return messages;
};
