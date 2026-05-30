import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class PagingArrayResponse<TData> {
  @ApiProperty()
  public items: Array<TData>;

  @ApiProperty()
  public totalItems: number;

  constructor(items: Array<TData>, totalItems: number) {
    this.items = items;
    this.totalItems = totalItems;
  }
}

export const ApiOkResponsePagingArray = <GenericType extends Type<unknown>>(
  data: GenericType,
) =>
  applyDecorators(
    ApiExtraModels(PagingArrayResponse, data),
    ApiOkResponse({
      description: `The paginated result of ${data.name}`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PagingArrayResponse) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(data) },
              },
            },
          },
        ],
      },
    }),
  );
