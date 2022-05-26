import { useCallback, useEffect, useState } from 'react';
import { initCounter } from '../utils/counter-utils';

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

const prependEvents = (currentEvents: any[] | undefined, newEvents: any[]) => {
  return [...(newEvents ?? []).reverse(), ...(currentEvents ?? [])].slice(0, 5);
};

const useCounter = () => {
  const [counterContract, setCounterContract] = useState<any>();
  const [state, setState] = useState<CounterState | null>(null);

  const getCounterContract = useCallback(async () => {
    const counterContract = await initCounter();
    setCounterContract(counterContract);
  }, [setCounterContract]);

  const getContractState = useCallback(async () => {
    if (counterContract) {
      const current = '0x';
      const events = await counterContract?.getPastEvents();
      const account = await counterContract?.getSigner();

      setState({
        contractAddress: counterContract?.address,
        account,
        current,
        events: prependEvents([], events),
      });

      return { current, events, account };
    }
  }, [state, setState, counterContract]);

  function onEvent(event: any) {
    log(event);
    setState((prev) => ({ ...prev, current: event.currentHolder }));
  }

  function onProgress({ event, step, total }: any) {
    console.log({ event, step, total });
    progress({ event, step, total });
  }

  const gasProvider = counterContract?.gsnProvider;

  const log = (event: any) => {
    setState((prev) => ({ ...prev, events: prependEvents(prev?.events, [event]) }));
  };

  const progress = ({ event, step, total, error = null }: any) => {
    setState((prev) => ({ ...prev, status: event, step, total, error }));
  };

  const sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    const res = await counterContract?.onIncrement(1);
    console.log({ res });
    console.log({ counterContract });

    setState((prev) => ({
      ...prev,
      status: 'txhash=' + res?.hash.slice(0, 20) + ' waiting for mining',
    }));

    const res2 = await res?.wait();

    setState((prev) => ({
      ...prev,
      total: 0,
      step: 0,
      status: 'Mined in block: ' + res2?.blockNumber,
    }));
  };

  useEffect(() => {
    (async () => {
      await getCounterContract();
    })();
  }, []);

  useEffect(() => {
    if (counterContract) {
      (async () => {
        await getContractState();
        counterContract?.listenToEvents(onEvent, onProgress);
      })();
    }
  }, [counterContract]);

  useEffect(() => {
    if (counterContract) console.log({ counterContract });
    if (state) console.log({ state });
  }, [counterContract, state]);

  return { onIncrementByRelay };
};

export default useCounter;
