export class EntityNotFoundError extends Error {
  constructor(entityType: object) {
    super(`Entity ${entityType.constructor.name} was not found`);
  }
}
