import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

interface Nft {
  name: string;
  symbol: string;
  imageUri: string;
}

export function useNftDetails(collection: string, tokenId: string) {
  const { getCosmWasmClient } = useWallet();
  const [details, setDetails] = useState<Nft | null>(null);

  useEffect(() => {
    if (!collection || !tokenId) {
      return;
    }

    async function pullNft() {
      const client = await getCosmWasmClient();
      const result = await client?.queryContractSmart(collection, {
        nft_info: { token_id: tokenId },
      });
      if (!result) {
        return;
      }

      console.log(">>> use nft", result);
      setDetails({
        name: "x",
        symbol: "",
        imageUri: result.token_uri || result.extension.image,
      });
    }
    pullNft();
  }, [collection, tokenId, getCosmWasmClient]);

  return details;
}
