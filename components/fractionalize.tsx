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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { useNftDetails } from "../hooks/use-nft";

const chainName = "juno";
const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;
const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === "ujuno"
) as Asset;

export function Fractionalize() {
  const [collection, setCollection] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [owners, setOwners] = useState<{ address: string; amount: string }[]>([
    { address: "", amount: "" },
  ]);

  const nft = useNftDetails(collection, tokenId);

  const { setCurrentChain, currentWallet, walletStatus, getCosmWasmClient } =
    useWallet();

  useEffect(() => {
    setCurrentChain(chainName);
  }, [chainName]);

  const toast = useToast();

  const onSubmit = async () => {
    if (!currentWallet) {
      toast({
        title: "Wallet not connected",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (!collection || !tokenId) {
      toast({
        title: "Invalid NFT",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (owners.length === 0) {
      toast({
        title: "Invalid owners list",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const client: SigningCosmWasmClient =
      await currentWallet.getCosmWasmClient();
  };

  return (
    <Stack direction="column" gap={4}>
      <Flex gap={8}>
        <Stack width="50%" gap={8}>
          <Stack>
            <Text>Collection Address</Text>
            <Input
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
            />
          </Stack>
          <Stack>
            <Text>Token ID</Text>
            <Input
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </Stack>
        </Stack>

        <Flex direction="column" width="50%">
          <Image
            src={nft?.imageUri}
            fallbackSrc="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
          />
        </Flex>
      </Flex>

      <Flex direction="column" gap={4}>
        <Stack>
          <Text>Token name</Text>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Stack>
        <Stack>
          <Text>Token symbol</Text>
          <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </Stack>

        <Stack gap={0}>
          <Text>Owners</Text>
          {owners.map(({ address, amount }, index) => (
            <Flex gap={4} mb={2}>
              <Input
                placeholder="Address"
                value={address}
                onChange={(e) =>
                  setOwners((o) =>
                    o.map((x, i) =>
                      i === index ? { ...x, address: e.target.value } : x
                    )
                  )
                }
              />
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) =>
                  setOwners((o) =>
                    o.map((x, i) =>
                      i === index ? { ...x, amount: e.target.value } : x
                    )
                  )
                }
              />
              <Button
                onClick={() =>
                  setOwners((o) =>
                    o.filter((_, i) => (i === index ? false : true))
                  )
                }
              >
                X
              </Button>
            </Flex>
          ))}
        </Stack>
        <Button
          alignSelf="flex-end"
          onClick={() => setOwners((o) => [...o, { address: "", amount: "" }])}
        >
          New Owner
        </Button>
      </Flex>

      <Button colorScheme="blue" onClick={onSubmit}>
        Submit
      </Button>
    </Stack>
  );
}
