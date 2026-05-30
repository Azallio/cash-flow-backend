export class FormatError extends Error {
  constructor(value: string, conversionType: object) {
    super(
      `The value of ${value} has an incorrect format of type ${conversionType.constructor.name}`,
    );
  }
}
