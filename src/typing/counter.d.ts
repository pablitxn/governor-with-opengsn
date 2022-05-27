interface CounterState {
  error?: string;
  current?: string;
  contractAddress?: string;
  account?: string;
  events?: any[];

  status?: string;
  step?: number;
  total?: number;
}