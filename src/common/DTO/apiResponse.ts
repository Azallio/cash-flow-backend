import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { PagingArrayResponse } from './pagingArrayResponse';

export class ApiResponse<TData> {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  public status: number = 200;

  @ApiPropertyOptional({
    description: 'Response payload',
    nullable: true,
  })
  public data?: TData = undefined;

  @ApiPropertyOptional({
    description: 'Error message or validation errors',
    nullable: true,
    oneOf: [
      { type: 'string', example: 'Validation failed' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email must be an email'],
      },
    ],
  })
  public error?: string | string[] = undefined;
}

type ApiWrappedResponseOptions = {
  description?: string;
  isArray?: boolean;
};

const buildWrappedSchema = (
  data: Type<unknown>,
  options?: ApiWrappedResponseOptions,
) => ({
  allOf: [
    { $ref: getSchemaPath(ApiResponse) },
    {
      properties: {
        data: options?.isArray
          ? {
              type: 'array',
              items: { $ref: getSchemaPath(data) },
            }
          : {
              $ref: getSchemaPath(data),
            },
      },
    },
  ],
});

export const ApiOkResponseWrapped = <GenericType extends Type<unknown>>(
  data: GenericType,
  options?: ApiWrappedResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(ApiResponse, data),
    ApiOkResponse({
      description: options?.description,
      schema: buildWrappedSchema(data, options),
    }),
  );

export const ApiCreatedResponseWrapped = <GenericType extends Type<unknown>>(
  data: GenericType,
  options?: ApiWrappedResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(ApiResponse, data),
    ApiCreatedResponse({
      description: options?.description,
      schema: buildWrappedSchema(data, options),
    }),
  );

export const ApiOkResponseWrappedNoData = (description?: string) =>
  applyDecorators(
    ApiExtraModels(ApiResponse),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: {
                nullable: true,
                example: null,
              },
            },
          },
        ],
      },
    }),
  );

export const ApiOkResponseWrappedPagingArray = <
  GenericType extends Type<unknown>,
>(
  data: GenericType,
  description?: string,
) =>
  applyDecorators(
    ApiExtraModels(ApiResponse, PagingArrayResponse, data),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: {
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
            },
          },
        ],
      },
    }),
  );
