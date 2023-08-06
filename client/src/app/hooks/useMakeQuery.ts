import { useMoralis, useWeb3Contract } from "react-moralis";

import { abi, contractAddresses } from "@/constants";

type UseMakeQuery<DataType> = Omit<
  ReturnType<typeof useWeb3Contract>,
  "data"
> & { data: DataType | null };

export const useMakeQuery = <DataType>({
  functionName,
  params,
  msgValue,
}: {
  functionName: string;
  params?: Record<string, unknown>;
  msgValue?: string | number;
}): UseMakeQuery<DataType> => {
  const { chainId: chainIdHex } = useMoralis();

  const chainId = parseInt(chainIdHex ?? "").toString();

  const contractAddress =
    chainId in contractAddresses
      ? (contractAddresses as Record<string, string[]>)[chainId][0]
      : undefined;

  const result = useWeb3Contract({
    abi,
    params,
    msgValue,
    functionName,
    contractAddress,
  });

  return { ...result, data: result.data as DataType | null };
};
