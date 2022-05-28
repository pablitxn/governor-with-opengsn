import { useCallback, useEffect, useState, useContext } from 'react';
import { GlobalContext } from 'contexts/global';
import { initCounter } from 'gas-station-network/counter';

const prependEvents = (currentEvents: any[] | undefined, newEvents: any[]) => {
  return [...(newEvents ?? []).reverse(), ...(currentEvents ?? [])].slice(0, 5);
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const useCounter = () => {
  const ctx = useContext(GlobalContext);
  const [counterContract, setCounterContract] = useState<any>();
  const [state, setState] = useState<CounterState | null>(null);

  const onEvent = (event: any) => log(event);

  const onProgress = ({ event }: any) => progress({ event });

  const getCounterContract = useCallback(async () => {
    const counterContract = await initCounter(ctx);
    setCounterContract(counterContract);
  }, [setCounterContract, ctx]);

  const getContractState = useCallback(async () => {
    const currentValue = await counterContract?.getCurrentValue();
    const events = await counterContract?.getPastEvents();

    setState({
      currentValue,
      events: prependEvents([], events),
    });

    return { currentValue, events };
  }, [state, setState, counterContract]);

  const gasProvider = counterContract?.gsnProvider;

  const log = (event: any) =>
    setState((prev) => ({ ...prev, events: prependEvents(prev?.events, [event]) }));

  const progress = ({ event, error = null }: any) =>
    setState((prev) => ({ ...prev, status: event, error }));

  const simSend = async () => {
    for (let i = 1; i <= 8; i++) {
      setState((prev) => ({ ...prev, step: i, total: 8, status: '' }));
      await sleep(500);
    }
    setState((prev) => ({ ...prev, status: 'Mining' }));
    await sleep(300);
    setState((prev) => ({ ...prev, status: 'done' }));
  };

  const onIncrement = async () => {
    setState((prev) => ({ ...prev, status: 'sending' }));
    const response = await counterContract?.onIncrement(1);

    setState((prev) => ({
      ...prev,
      msg: 'txhash=' + response?.hash.slice(0, 20) + ' waiting for mining',
      status: 'waiting for mining',
    }));

    const receipt = await response?.wait();

    setState((prev) => ({
      ...prev,
      msg: 'Mined in block: ' + receipt?.blockNumber,
      status: 'done',
    }));
  };

  const onDecrement = async () => {
    setState((prev) => ({ ...prev, status: 'sending' }));
    const response = await counterContract?.onDecrement(1);

    setState((prev) => ({
      ...prev,
      msg: 'txhash=' + response?.hash.slice(0, 20) + ' waiting for mining',
      status: 'waiting for mining',
    }));

    const receipt = await response?.wait();

    setState((prev) => ({
      ...prev,
      msg: 'Mined in block: ' + receipt?.blockNumber,
      status: 'done',
    }));
  };

  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined' && ctx) {
        await getCounterContract();
      }
    })();
  }, [window, ctx]);

  useEffect(() => {
    if (counterContract) {
      (async () => {
        await getContractState();
        counterContract?.listenToEvents(onEvent, onProgress);
      })();
    }
  }, [counterContract]);

  useEffect(() => {
    if (state?.status === 'done') {
      (async () => {
        await getContractState();
      })();
    }
  }, [state]);

  return {
    simSend,
    gasProvider,
    onIncrement,
    onDecrement,
    value: state?.currentValue,
  };
};

export default useCounter;
