import { useCallback, useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { GlobalContext } from 'contexts/global';

const prependEvents = (currentEvents: any[] | undefined, newEvents: any[]) => {
  return [...(newEvents ?? []).reverse(), ...(currentEvents ?? [])].slice(0, 5);
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const useCounter = () => {
  const ctx = useContext(GlobalContext);
  const [state, setState] = useState<CounterState | null>(null);

  const onEvent = (event: any) => log(event);

  const onProgress = ({ event }: any) => progress({ event });

  const getContractState = useCallback(async () => {
    const currentValue = await ctx?.counterContract.getCurrentValue();
    const events = await ctx?.counterContract.getPastEvents() as ethers.Event[];

    setState({
      currentValue,
      events: prependEvents([], events),
    });

    return { currentValue, events };
  }, [state, setState, ctx?.counterContract]);

  const gasProvider = ctx?.counterContract.gsnProvider;

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
    const response = await ctx?.counterContract.onIncrement(1);

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
    const response = await ctx?.counterContract.onDecrement(1);

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
    if (ctx?.counterContract) {
      (async () => {
        await getContractState();
        ctx?.counterContract.listenToEvents(onEvent, onProgress);
      })();
    }
  }, [ctx?.counterContract]);

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
