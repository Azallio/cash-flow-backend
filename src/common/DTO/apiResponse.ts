export class ApiResponse<TData> {
  public status: number = 200;
  public data?: TData = undefined;
  public error?: string | string[] = undefined;
}
