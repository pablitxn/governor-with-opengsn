import { useCallback, useEffect, useState } from 'react';
import { initCounter } from '../gas-station-network/counter';

const prependEvents = (currentEvents: any[] | undefined, newEvents: any[]) => {
  return [...(newEvents ?? []).reverse(), ...(currentEvents ?? [])].slice(0, 5);
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const useCounter = () => {
  const [counterContract, setCounterContract] = useState<any>();
  const [state, setState] = useState<CounterState | null>(null);

  const onEvent = (event: any) => {
    log(event);
    setState((prev) => ({ ...prev, current: event.currentHolder }));
  };

  const onProgress = ({ event, step, total }: any) => {
    progress({ event, step, total });
  };

  const getCounterContract = useCallback(async () => {
    const counterContract = await initCounter();
    setCounterContract(counterContract);
  }, [setCounterContract]);

  const getContractState = useCallback(async () => {
    const current = '0x';
    const events = await counterContract?.getPastEvents();
    const account = await counterContract?.getSigner();
    const contractAddress = await counterContract?.address;

    setState({
      contractAddress,
      account,
      current,
      events: prependEvents([], events),
    });

    return { current, events, account };
  }, [state, setState, counterContract]);

  const gasProvider = counterContract?.gsnProvider;

  const log = (event: any) => {
    setState((prev) => ({ ...prev, events: prependEvents(prev?.events, [event]) }));
  };

  const progress = ({ event, step, total, error = null }: any) => {
    setState((prev) => ({ ...prev, status: event, step, total, error }));
  };

  const simSend = async () => {
    for (let i = 1; i <= 8; i++) {
      setState((prev) => ({ ...prev, step: i, total: 8, status: '' }));
      await sleep(500);
    }
    setState((prev) => ({ ...prev, status: 'Mining' }));
    await sleep(300);
    setState((prev) => ({ ...prev, status: 'done' }));
  };

  const onIncrementByRelay = async () => {
    setState((prev) => ({ ...prev, status: 'sending' }));
    const response = await counterContract?.onIncrement(1);

    setState((prev) => ({
      ...prev,
      status: 'txhash=' + response?.hash.slice(0, 20) + ' waiting for mining',
    }));

    const receipt = await response?.wait();

    setState((prev) => ({
      ...prev,
      total: 0,
      step: 0,
      status: 'Mined in block: ' + receipt?.blockNumber,
    }));
  };

  const onDecrementByRelay = async () => {
    setState((prev) => ({ ...prev, status: 'sending' }));
    const response = await counterContract?.onDecrement(1);

    setState((prev) => ({
      ...prev,
      status: 'txhash=' + response?.hash.slice(0, 20) + ' waiting for mining',
    }));

    const receipt = await response?.wait();

    setState((prev) => ({
      ...prev,
      total: 0,
      step: 0,
      status: 'Mined in block: ' + receipt?.blockNumber,
    }));
  };

  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        await getCounterContract();
      }
    })();
  }, [window]);

  useEffect(() => {
    if (counterContract) {
      (async () => {
        await getContractState();
        counterContract?.listenToEvents(onEvent, onProgress);
      })();
    }
  }, [counterContract]);

  return {
    simSend,
    gasProvider,
    onIncrementByRelay,
    onDecrementByRelay,
  };
};

export default useCounter;
