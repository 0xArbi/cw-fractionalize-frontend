import { Icon, Stack } from "@chakra-ui/react";
import { getWalletPrettyName } from "@cosmos-kit/config";
import { ChainName } from "@cosmos-kit/core";
import { useWallet } from "@cosmos-kit/react";
import { assets as chainAssets } from "chain-registry";
import { MouseEventHandler, useEffect, useMemo } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Connected,
  ConnectedShowAddress,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  Error,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
} from "../components";

export const WalletSection = ({ chainName }: { chainName?: ChainName }) => {
  const walletManager = useWallet();
  const {
    connect,
    openView,
    setCurrentChain,
    walletStatus,
    username,
    address,
    message,
    currentWalletName,
    chains,
  } = walletManager;

  const chainOptions = useMemo(
    () =>
      chains.map((chainRecord) => {
        const assets = chainAssets.find(
          (_chain) => _chain.chain_name === chainRecord.name
        )?.assets;
        return {
          chainName: chainRecord.name,
          label: chainRecord.chain.pretty_name,
          value: chainRecord.name,
          icon: assets
            ? assets[0]?.logo_URIs?.svg || assets[0]?.logo_URIs?.png
            : undefined,
          disabled: false,
        };
      }),
    [chains]
  );

  const chain = chainOptions.find((c) => c.chainName === chainName);

  useEffect(() => {
    setCurrentChain(chainName);
  }, [chainName, setCurrentChain]);

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    openView();
    if (currentWalletName) {
      await connect();
    }
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={<Connected buttonText={"Wallet"} onClick={onClickOpenView} />}
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={walletStatus}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${getWalletPrettyName(
            currentWalletName
          )}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${getWalletPrettyName(
            currentWalletName
          )}: ${message}`}
        />
      }
    />
  );

  const addressBtn = chainName && (
    <CopyAddressBtn
      walletStatus={walletStatus}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
  );

  return (
    <Stack direction="row" align="center" spacing={4}>
      {addressBtn}
      {connectWalletButton}
    </Stack>
  );
};
