interface GsnStatusState {
  relayHubAddress?: string;
  totalRelayers?: string;
  paymasterAddress?: string;
  paymasterBalance?: string;
  forwarderAddress?: string;
}

interface IGsnStatus {}

interface ITableColumn {
  children: React.ReactNode;
  divider?: boolean;
}