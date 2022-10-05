import { Asset, AssetList } from "@chain-registry/types";
import { useWallet } from "@cosmos-kit/react";
import { assets } from "chain-registry";
import { useEffect } from "react";

import {
  Box,
  Container,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import { WalletStatus } from "@cosmos-kit/core";
import Head from "next/head";
import { Fractionalize, WalletSection } from "../components";
import { Unfractionalize } from "../components/unfractionalize";

const chainName = "juno";
const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;
const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === "ujuno"
) as Asset;

export default function Home() {
  const {
    getStargateClient,
    address,
    setCurrentChain,
    currentWallet,
    walletStatus,
    getCosmWasmClient,
  } = useWallet();

  useEffect(() => {
    setCurrentChain(chainName);
  }, [chainName]);

  return (
    <Container maxW="3xl" py={10} flex={1}>
      <Head>
        <title>cw-fractionalize</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack>
        <Box alignSelf="flex-end">
          <WalletSection chainName={chainName} />
        </Box>

        <Tabs>
          <TabList>
            <Tab>Fractionalize</Tab>
            <Tab>Reconstruct</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Fractionalize />
            </TabPanel>
            <TabPanel>
              <Unfractionalize />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}