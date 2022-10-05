import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

interface Nft {
  name: string;
  symbol: string;
  imageUri: string;
}

export function useTokenBalance(token: string, user: string) {
  const { getCosmWasmClient } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    async function pullNft() {
      const client = await getCosmWasmClient();
      const result = await client?.queryContractSmart(token, {
        balance: { address: user },
      });
      if (!result) {
        return;
      }

      console.log(">>> token balance", result);
      // todo: probably fromWei
      setBalance(result.balance);
    }
    pullNft();
  }, [token, user, getCosmWasmClient]);

  return balance;
}
