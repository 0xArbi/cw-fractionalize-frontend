import { useWallet } from "@cosmos-kit/react";
import { useEffect } from "react";

import {
  Box,
  Container,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import Head from "next/head";
import { Fractionalize, WalletSection } from "../components";
import { Unfractionalize } from "../components/unfractionalize";

const chainName = "juno";

export default function Home() {
  const { setCurrentChain } = useWallet();

  useEffect(() => {
    setCurrentChain(chainName);
  }, [chainName]);

  return (
    <Container maxW="2xl" py={10} flex={1}>
      <Head>
        <title>cw-fractionalize</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack spacing={8}>
        <Box alignSelf="flex-end">
          <WalletSection chainName={chainName} />
        </Box>

        <Stack spacing={2}>
          <Text fontSize="4xl" fontWeight="extrabold">
            cw-fractionalize
          </Text>

          <Text>
            A public good, utility tool for fractionalizing NFTs on Juno. Simply
            specify the NFT you wish to fractionalize, and the recipients you
            wish to receive ownership shares.
          </Text>

          <a
            href="https://github.com/0xArbi/cw-fractionalize"
            target="_blank"
            rel="noreferrer"
          >
            <Text fontSize="sm">Open sourced on Github.</Text>
          </a>
        </Stack>

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
