import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";
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

import { fractionalizer } from "../config";
import { useNftDetails } from "../hooks/use-nft";

export function Fractionalize() {
  const [collection, setCollection] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [owners, setOwners] = useState<{ address: string; amount: string }[]>([
    { address: "", amount: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const nft = useNftDetails(collection, tokenId);
  const { currentWallet } = useWallet();
  const toast = useToast();

  function error(title: string) {
    toast({
      title,
      status: "error",
      isClosable: true,
    });
  }

  const onSubmit = async () => {
    if (!currentWallet) {
      error("Wallet not connected");
      return;
    }

    if (!collection || !tokenId) {
      error("Invalid NFT");
      return;
    }

    if (owners.length === 0) {
      error("Invalid owners list");
      return;
    }

    if (!name || !symbol) {
      error("Missing token metadata");
      return;
    }

    try {
      const client: SigningCosmWasmClient =
        await currentWallet.getCosmWasmClient();

      const result = await client.execute(
        currentWallet.address,
        collection,
        {
          send_nft: {
            contract: fractionalizer,
            token_id: tokenId,
            msg: toBinary({
              fractionalize: {
                owners,
                name,
                symbol,
              },
            }),
          },
        },
        "auto"
      );
      toast({
        status: "success",
        title: "NFT fractionalized",
        description: `https://mintscan.io/juno/${result.transactionHash}`,
      });
    } catch (e: any) {
      error(e.message);
    } finally {
      setSubmitting(false);
    }
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
                disabled={owners.length === 1}
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

      <Button isLoading={submitting} colorScheme="blue" onClick={onSubmit}>
        Submit
      </Button>
    </Stack>
  );
}
