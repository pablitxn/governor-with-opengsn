import { useCallback, useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { GlobalContext } from 'contexts/global';
import Governor from 'abis/src/contracts/Governor.sol/MyGovernor.json';

const prependEvents = (currentEvents: any[] | undefined, newEvents: any[]) => {
  return [...(newEvents ?? []).reverse(), ...(currentEvents ?? [])].slice(0, 5);
};

const useGovernor = () => {
  const ctx = useContext(GlobalContext);
  const [state, setState] = useState<any>(null);

  const onEvent = (event: any) => log(event);

  const onProgress = ({ event }: any) => progress({ event });

  const getContractState = useCallback(async () => {
    const events = (await ctx?.governorContract.getPastEvents()) as ethers.Event[];

    setState({
      events: prependEvents([], events),
    });

    return { events };
  }, [state, setState, ctx?.governorContract]);

  const gasProvider = ctx?.governorContract.gsnProvider;

  const log = (event: any) =>
    setState((prev: any) => ({ ...prev, events: prependEvents(prev?.events, [event]) }));

  const progress = ({ event, error = null }: any) =>
    setState((prev: any) => ({ ...prev, status: event, error }));

  const castVote = async (proposalId: string, support: string, reason: string) => {
    setState((prev: any) => ({ ...prev, status: 'sending' }));

    const governorContract = new ethers.Contract(
      '0x7B2D046f6D878B4Da5d9131Ff5B90a3962fBA6b1',
      Governor.abi,
      ctx?.signer,
    );
    const proposal: any = ethers.BigNumber.from(proposalId)
    const response = await governorContract.castVoteWithReason(proposal, 1, 'asd');
    console.log(proposalId, support, reason, proposal);

    // const response = await ctx?.governorContract.castVoteWithReason(proposal, +support, reason);

    setState((prev: any) => ({
      ...prev,
      msg: 'txhash=' + response?.hash.slice(0, 20) + ' waiting for mining',
      status: 'waiting for mining',
    }));

    const receipt = await response?.wait();

    setState((prev: any) => ({
      ...prev,
      msg: 'Mined in block: ' + receipt?.blockNumber,
      status: 'done',
    }));
  };

  useEffect(() => {
    if (ctx?.governorContract) {
      (async () => {
        await getContractState();
        ctx?.governorContract.listenToEvents(onEvent, onProgress);
      })();
    }
  }, [ctx?.governorContract]);

  useEffect(() => {
    if (state?.status === 'done') {
      (async () => {
        await getContractState();
      })();
    }
  }, [state]);

  return {
    gasProvider,
    castVote,
    value: state?.currentValue,
  };
};

export default useGovernor;
