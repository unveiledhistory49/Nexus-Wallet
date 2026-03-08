import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { entryPoint07Address } from "viem/account-abstraction";

export const chain = baseSepolia;
export const entryPoint = entryPoint07Address;

export const publicClient = createPublicClient({
    chain,
    transport: http(),
});

export const pimlicoClient = createPimlicoClient({
    transport: http(`https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`),
    entryPoint,
});
