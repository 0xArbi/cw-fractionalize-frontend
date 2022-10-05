import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

export function useTokenBalance(token: string, user: string) {
  const { getCosmWasmClient } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    async function pullTokenBalance() {
      const client = await getCosmWasmClient();
      const result = await client?.queryContractSmart(token, {
        balance: { address: user },
      });
      if (!result) {
        return;
      }

      console.log(">>> token balance", result);
      // todo: probably fromWei
      setBalance(parseInt(result.balance));
    }
    pullTokenBalance();
  }, [token, user, getCosmWasmClient]);

  return balance;
}
