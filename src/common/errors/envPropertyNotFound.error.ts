export class EnvPropertyNotFoundError extends Error {
  constructor(propertyName: string) {
    super(`ENV property ${propertyName} was not found`);
  }
}
