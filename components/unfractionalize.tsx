import {
  Button,
  Flex,
  Image,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { SigningCosmWasmClient, toBinary } from "@cosmjs/cosmwasm-stargate";
import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";

import { fractionalizer } from "../config";
import {
  useCw20Address,
  useNftDetails,
  useTokenBalance,
  useTokenMetadata,
} from "../hooks";

export function Unfractionalize() {
  const { currentWallet } = useWallet();

  const [collection, setCollection] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nft = useNftDetails(collection, tokenId);
  const cw20Address = useCw20Address(collection, tokenId);
  const tokenBalance = useTokenBalance(
    cw20Address || "",
    currentWallet?.address || ""
  );
  const tokenMetadata = useTokenMetadata(
    cw20Address || "",
    currentWallet?.address || ""
  );
  const toast = useToast();

  function error(title: string) {
    toast({
      title,
      status: "error",
      isClosable: true,
    });
  }

  const onPress = async () => {
    if (
      !collection ||
      !tokenId ||
      !currentWallet ||
      !cw20Address ||
      !tokenBalance
    ) {
      return;
    }

    try {
      setSubmitting(true);
      const client: SigningCosmWasmClient =
        await currentWallet.getCosmWasmClient();

      const result = await client.execute(
        currentWallet.address,
        cw20Address,
        {
          send: {
            contract: fractionalizer,
            amount: tokenBalance.toString(),
            msg: toBinary({
              unfractionalize: {
                recipient: currentWallet.address,
              },
            }),
          },
        },
        "auto"
      );
      toast({
        status: "success",
        title: "Reconstructed NFT",
        description: `https://mintscan.io/juno/${result.transactionHash}`,
      });
    } catch (e: any) {
      error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex direction="column" gap={4}>
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

      {tokenMetadata && cw20Address && (
        <Stack>
          <Text>
            {tokenMetadata.name} ({tokenMetadata.symbol})
          </Text>
          <Text>Address: {cw20Address}</Text>
          <Text>Total Supply: {tokenMetadata.totalSupply}</Text>
          <Text>Owned tokens: {tokenBalance}</Text>
        </Stack>
      )}

      <Button
        disabled={tokenMetadata?.totalSupply !== tokenBalance}
        onClick={onPress}
        isLoading={submitting}
      >
        Submit
      </Button>
    </Flex>
  );
}
