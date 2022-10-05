import { Asset, AssetList } from "@chain-registry/types";
import { useWallet } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import { assets } from "chain-registry";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useNftDetails, useCw20Address, useTokenBalance } from "../hooks";

const chainName = "juno";
const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;
const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === "ujuno"
) as Asset;

export function Unfractionalize() {
  const { setCurrentChain, currentWallet, getCosmWasmClient } = useWallet();

  const [collection, setCollection] = useState("");
  const [tokenId, setTokenId] = useState("");

  const nft = useNftDetails(collection, tokenId);
  const cw20Address = useCw20Address(collection, tokenId);
  const tokenBalance = useTokenBalance(
    cw20Address || "",
    currentWallet?.address || ""
  );

  useEffect(() => {
    setCurrentChain(chainName);
  }, [chainName]);

  const onPress = async () => {
    if (!collection || !tokenId || !currentWallet) {
      return;
    }

    const client: SigningCosmWasmClient =
      await currentWallet.getCosmWasmClient();
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex gap={4}>
        <Flex direction="column" width="50%" gap={8}>
          <Box gap={8}>
            <Text>Collection Address</Text>
            <Input
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            />
          </Box>
          <Box gap={4}>
            <Text>Token ID</Text>
            <Input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </Box>
        </Flex>

        <Flex direction="column" width="50%">
          <Image
            src={nft?.imageUri}
            fallbackSrc="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
          />
        </Flex>
      </Flex>

      <Button onClick={onPress}>Submit</Button>
    </Flex>
  );
}
