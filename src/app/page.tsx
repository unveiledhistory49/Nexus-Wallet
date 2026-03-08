"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useNexusWallet } from "@/hooks/useNexusWallet";
import { ArrowRightLeft, TrendingUp, Wallet, Shield, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { login, logout, authenticated } = usePrivy();
  const { address: nexusAddress, isLoading: isNexusLoading } = useNexusWallet();
  const [balance] = useState("0.00");

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col items-center">
      <nav className="w-full flex justify-between items-center mb-16 glass px-6 py-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Nexus</h1>
        </div>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                {isNexusLoading ? (
                  <div className="flex items-center gap-2 text-blue-300">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">Nexus Initializing...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-blue-300 font-medium">Nexus Account</p>
                    <p className="text-sm text-white font-mono">
                      {nexusAddress ? `${nexusAddress.slice(0, 6)}...${nexusAddress.slice(-4)}` : "Not Found"}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="glow-button bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Dashboard Area */}
        <div className="md:col-span-2 space-y-8">

          {/* Balance Card */}
          <div className="glass-card p-10 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-500 group-hover:bg-blue-500/30"></div>
            <div className="relative z-10">
              <p className="text-blue-300 font-medium mb-2">Total Balance</p>
              <h2 className="text-6xl font-black text-white glow-text mb-6">
                ${balance}
              </h2>
              <div className="flex gap-4">
                <button className="glow-button bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full flex gap-2 items-center transition-all">
                  <TrendingUp className="w-5 h-5" /> Receive
                </button>
                <button className="glass bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-full transition-all">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h3 className="text-xl font-semibold text-white/90 mt-12 mb-6">Account Abstraction Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all cursor-pointer">
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Gasless Swaps</h4>
              <p className="text-blue-200/70 text-sm">Sponsored by Pimlico Paymaster. Swap any token without ETH.</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer">
              <ArrowRightLeft className="w-8 h-8 text-purple-400 mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Batched Transactions</h4>
              <p className="text-blue-200/70 text-sm">Approve and swap in one single click using Session Keys.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Mini-dApp */}
        <aside className="glass p-8 rounded-3xl border-t-4 border-t-blue-500 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h3 className="text-xl font-bold text-white mb-2">One-Click Yield</h3>
          <p className="text-blue-200/60 text-sm mb-8">Swap USDC to ETH & Stake on Aave instantly.</p>

          <div className="space-y-6">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative z-10">
              <label className="text-xs text-blue-300/60 uppercase font-bold tracking-wider mb-2 block">You Pay</label>
              <div className="flex justify-between items-center text-xl text-white">
                <span className="font-semibold">0.00</span>
                <span className="bg-blue-900/40 px-3 py-1 rounded-full text-sm text-blue-300">USDC</span>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-20">
              <div className="bg-blue-600 p-2 rounded-full border-4 border-[#14162e]">
                <ArrowRightLeft className="w-4 h-4 text-white rotate-90" />
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 relative z-10">
              <label className="text-xs text-blue-300/60 uppercase font-bold tracking-wider mb-2 block">You Receive & Stake</label>
              <div className="flex justify-between items-center text-xl text-white">
                <span className="font-semibold">0.00</span>
                <span className="bg-purple-900/40 px-3 py-1 rounded-full text-sm text-purple-300">aETH</span>
              </div>
            </div>

            <button className="w-full glow-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl mt-4 shadow-lg">
              Execute Action
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
