"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect, useMemo } from "react";
import {
    createKernelAccount,
    createKernelAccountClient,
    createZeroDevPaymasterClient
} from "@zerodev/sdk";
import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { createPublicClient, http, walletClientToSmartAccountSigner, type Chain } from "viem";
import { baseSepolia } from "viem/chains";
import { entryPoint07Address } from "viem/account-abstraction";
import { pimlicoClient } from "@/lib/zerodev";

export function useNexusWallet() {
    const { authenticated, user } = usePrivy();
    const { wallets } = useWallets();
    const [address, setAddress] = useState<string | null>(null);
    const [kernelClient, setKernelClient] = useState<any>(null);
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
                const publicClient = createPublicClient({
                    chain: baseSepolia,
                    transport: http(),
                });

                // Step 1: Create Signer from Privy provider
                const signer = await walletClientToSmartAccountSigner(provider as any);

                // Step 2: Create Validator
                const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
                    signer,
                    entryPoint: entryPoint07Address,
                    kernelVersion: KERNEL_V3_1,
                });

                // Step 3: Create Kernel Account
                const account = await createKernelAccount(publicClient, {
                    plugins: {
                        sudo: ecdsaValidator,
                    },
                    entryPoint: entryPoint07Address,
                    kernelVersion: KERNEL_V3_1,
                });

                // Step 4: Create Kernel Client with Pimlico Paymaster
                const client = createKernelAccountClient({
                    account,
                    chain: baseSepolia,
                    bundlerTransport: http(`https://api.pimlico.io/v2/${baseSepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`),
                    paymaster: {
                        getPaymasterData: (userOperation) => pimlicoClient.getPaymasterData({
                            userOperation,
                            entryPoint: entryPoint07Address
                        })
                    }
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
