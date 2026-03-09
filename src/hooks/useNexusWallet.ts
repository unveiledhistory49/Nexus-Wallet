"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect, useMemo } from "react";
import {
    createKernelAccount,
    createKernelAccountClient
} from "@zerodev/sdk";
import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createPublicClient, http, type EIP1193Provider } from "viem";
import { baseSepolia } from "viem/chains";
import { entryPoint07Address } from "viem/account-abstraction";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { toOwner } from "permissionless";

const entryPoint = {
    address: entryPoint07Address,
    version: "0.7" as const,
};

// Public client
const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
});

export function useNexusWallet() {
    const { authenticated } = usePrivy();
    const { wallets } = useWallets();
    const [address, setAddress] = useState<string | null>(null);
    const [kernelClient, setKernelClient] = useState<unknown>(null);
    const [isLoading, setIsLoading] = useState(false);

    const embeddedWallet = useMemo(() =>
        wallets.find((w) => w.walletClientType === 'privy'),
        [wallets]
    );

    useEffect(() => {
        async function setupWallet() {
            if (!authenticated || !embeddedWallet) return;

            try {
                setIsLoading(true);
                const provider = await embeddedWallet.getEthereumProvider();

                // Step 1: Signer
                const signer = await toOwner({ owner: provider as EIP1193Provider });

                // Step 2: Validator
                const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
                    signer,
                    entryPoint,
                    kernelVersion: KERNEL_V3_1,
                });

                // Step 3: Kernel Account
                const account = await createKernelAccount(publicClient, {
                    plugins: {
                        sudo: ecdsaValidator,
                    },
                    entryPoint,
                    kernelVersion: KERNEL_V3_1,
                });

                // Step 4: Pimlico Client (bundler + paymaster in one)
                const pimlicoClient = createPimlicoClient({
                    transport: http(`https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`),
                });

                // Step 5: Kernel Client with gas sponsorship
                const client = createKernelAccountClient({
                    account,
                    chain: baseSepolia,
                    client: publicClient,
                    bundlerTransport: http(`https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`),
                    paymaster: pimlicoClient,
                });

                setAddress(account.address);
                setKernelClient(client);
            } catch (error) {
                console.error("Error setting up Nexus Wallet:", error);
            } finally {
                setIsLoading(false);
            }
        }

        setupWallet();
    }, [authenticated, embeddedWallet]);

    return {
        address,
        kernelClient,
        isLoading,
        authenticated
    };
}
