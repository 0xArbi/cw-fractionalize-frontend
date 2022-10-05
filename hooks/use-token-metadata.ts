import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

interface Metadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
}

export function useTokenMetadata(token: string, user: string) {
  const { getCosmWasmClient } = useWallet();
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    async function pullTokenMetadata() {
      const client = await getCosmWasmClient();
      const result = await client?.queryContractSmart(token, {
        token_info: {},
      });
      if (!result) {
        return;
      }

      console.log(">>> token metadata", result);
      setMetadata({
        name: result.name,
        symbol: result.symbol,
        decimals: result.decimals,
        totalSupply: parseInt(result.total_supply),
      });
    }
    pullTokenMetadata();
  }, [token, user, getCosmWasmClient]);

  return metadata;
}
