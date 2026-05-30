export class RpcUrlNotFoundError extends Error {
  constructor(chain: string) {
    super(`chain ${chain} rpc url was not found`);
  }
}
