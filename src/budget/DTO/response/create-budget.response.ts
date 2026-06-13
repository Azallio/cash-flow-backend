export class CreateBudgetResponse {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly targetAmount: number,
    public readonly collectedAmount: number,
    public readonly description?: string,
  ) {}
}
