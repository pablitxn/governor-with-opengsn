interface ICounter {
  onDecrement: () => void;
  onIncrement: () => void;
  value?: number;
}
