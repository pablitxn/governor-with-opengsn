import { useCallback, useEffect, useState, useContext } from 'react';
import { GlobalContext } from 'contexts/global';

const useGsnStatus = () => {
  const ctx = useContext(GlobalContext);
  const [state, setState] = useState({
    relayHubAddress: '',
    forwarderAddress: '',
    paymasterAddress: '',
    paymasterBalance: '',
    totalRelayers: 0,
  });

  const updateStatus = useCallback(
    async (gsnStatus?: GsnStatusInfo) => {
      if (gsnStatus === undefined) {
        gsnStatus = await ctx?.governorContract.getGsnStatus();
      }
      const paymasterBalanceBN = (await gsnStatus?.getPaymasterBalance()) || '';
      const paymasterBalance = paymasterBalanceBN.toString();
      setState((prev) => ({ ...prev, paymasterBalance }));

      const totalRelayersBN = (await gsnStatus?.getActiveRelayers()) || 0;
      const totalRelayers = +totalRelayersBN.toString();
      setState((prev) => ({ ...prev, totalRelayers }));
    },
    [ctx],
  );

  const getItinialState = useCallback(async () => {
    ctx?.governorContract.listenToEvents(() => updateStatus());
    const gsnStatus = await ctx?.governorContract.getGsnStatus();
    console.log('== after getGsnStatus', gsnStatus);
    setState((prev) => ({
      ...prev,
      relayHubAddress: gsnStatus?.relayHubAddress || '',
      forwarderAddress: gsnStatus?.forwarderAddress || '',
      paymasterAddress: gsnStatus?.paymasterAddress || '',
    }));
    console.log(gsnStatus);
    await updateStatus(gsnStatus);
  }, [updateStatus]);

  useEffect(() => {
    (async () => {
      if (ctx) await getItinialState();
    })();
  }, [ctx]);

  return { ...state };
};

export default useGsnStatus;
