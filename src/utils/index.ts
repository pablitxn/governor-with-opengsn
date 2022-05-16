import { ContractReceipt } from 'ethers';

export const shortAddress = (address?: string) =>
  `${address?.substring(0, 6)}...${address?.substring(address?.length - 4)}`;

export const getTokenId = (event: any) => {
  // eslint-disable-next-line no-underscore-dangle
  const tokenId = parseInt(event?.args?.tokenId?._hex, 16);
  return tokenId;
};

export const filterEvent = (recipt: ContractReceipt, eventName: string) => {
  const event = recipt.events?.find((e) => e.event === eventName);
  if (event === undefined) {
    throw new Error(`Event ${eventName} not found`);
  }
  return event;
};

export const parseHexToDec = (obj: any) => {
  // eslint-disable-next-line no-underscore-dangle
  const number = parseInt(obj._hex, 16);
  return number;
};

export const parseContractMetadata = (obj: any) => ({
  description: obj.description,
  externalLink: obj.external_link,
  name: obj.name,
  seller_fee_basis_points: parseHexToDec(obj.seller_fee_basis_points),
  symbol: obj.symbol,
  image: obj.image,
});

export const parseAndPopulateNft = async (nft: any) => {
  const response = await fetch(nft.metadataURL);
  if (nft.assetContract.includes('0x0')) return null;
  const metadata = await response.json();

  return {
    seller: nft.seller,
    forSale: nft.forSale,
    itemId: parseHexToDec(nft.itemId),
    nftContract: nft.assetContract,
    numberOfTransfers: parseHexToDec(nft.numberOfTransfers),
    price: parseHexToDec(nft.price),
    tokenId: parseHexToDec(nft.tokenId),
    metadataURL: nft.metadataURL,
    name: metadata.name,
    image: metadata.image,
    description: metadata.description,
  };
};
