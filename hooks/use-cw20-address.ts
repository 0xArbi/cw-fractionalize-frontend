import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

interface Nft {
  name: string;
  symbol: string;
  imageUri: string;
}

export function useCw20Address(collection: string, tokenId: string) {
  const { getCosmWasmClient } = useWallet();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!collection || !tokenId) {
      return;
    }

    async function pullNft() {
      const client = await getCosmWasmClient();
      const result = await client?.queryContractSmart(collection, {
        get_cw20_address: { address: collection, token_id: tokenId },
      });
      if (!result) {
        return;
      }

      console.log(">>> useCw20Address", result);
      setAddress(result.address);
    }
    pullNft();
  }, [collection, tokenId, getCosmWasmClient]);

  return address;
}
