"use client";

import React, { useState } from 'react';
import { useReadContract, useWriteContract, useAccount, useChainId } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { HEARTLY_ABI, getContractAddress } from '@/core/config/contracts';

export const ContractTest: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [expertAddress, setExpertAddress] = useState('');
  const [callId, setCallId] = useState('');

  const contractAddress = getContractAddress(chainId || avalancheFuji.id, 'HEARTLY');

  // Test read contract - get expert details
  const { data: expertDetails, isLoading: expertLoading, error: expertError } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: HEARTLY_ABI,
    functionName: 'getExpertDetails',
    args: [expertAddress as `0x${string}`],
    query: {
      enabled: !!expertAddress && expertAddress.length === 42
    }
  });

  // Test read contract - get user balance
  const { data: userBalance, isLoading: balanceLoading } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: HEARTLY_ABI,
    functionName: 'getAvailableBalance',
    args: [address],
    query: {
      enabled: !!address && isConnected
    }
  });

  // Test write contract
  const { writeContract, isPending: isWritePending } = useWriteContract();

  const handleRegisterExpert = () => {
    if (!isConnected) return;
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: HEARTLY_ABI,
      functionName: 'registerExpert',
      args: [
        'Test Expert', // name
        'anxiety', // expertise
        BigInt(50), // voice rate (50 USDC per minute)
        BigInt(75), // video rate (75 USDC per minute)
        'QmTestCID123' // IPFS CID
      ],
    });
  };

  const isOnCorrectNetwork = chainId === avalancheFuji.id;

  if (!chainId) {
    return (
      <div className="p-6 bg-gray-900 text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🔗 Contract Integration Test</h2>
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="ml-3">Loading chain information...</p>
        </div>
      </div>
    );
  }

  if (!contractAddress) {
    return (
      <div className="p-6 bg-gray-900 text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🔗 Contract Integration Test</h2>
        <div className="text-red-400 mb-4">
          Contract address not found. Please make sure you are on the correct network (Avalanche Fuji).
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🔗 Contract Integration Test</h2>
      
      {/* Network Check */}
      <div className="mb-4 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">Network Status</h3>
        <div>Chain ID: {chainId}</div>
        <div>Contract Address: <span className="text-green-400">{contractAddress}</span></div>
        <div className={`mt-2 ${isOnCorrectNetwork ? 'text-green-400' : 'text-red-400'}`}>
          {isOnCorrectNetwork ? '✅ Connected to Avalanche Fuji' : '❌ Wrong Network - Switch to Avalanche Fuji'}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">Wallet Status</h3>
        <div>Connected: {isConnected ? '✅ Yes' : '❌ No'}</div>
        {address && <div>Address: <span className="text-blue-400">{address}</span></div>}
      </div>

      {/* User Balance Test */}
      {isConnected && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-2">💰 User Balance</h3>
          {balanceLoading ? (
            <div>Loading balance...</div>
          ) : (
            <div>Available Balance: {userBalance?.toString() || '0'} USDC</div>
          )}
        </div>
      )}

      {/* Expert Details Test */}
      <div className="mb-4 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">👩‍⚕️ Expert Details Test</h3>
        <input
          type="text"
          placeholder="Enter expert address (0x...)"
          value={expertAddress}
          onChange={(e) => setExpertAddress(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded mb-2"
        />
        {expertLoading && <div>Loading expert details...</div>}
        {expertError && <div className="text-red-400">Error: {expertError.message}</div>}
        {expertDetails && (
          <div className="text-green-400">
            <div>Name: {expertDetails[0]}</div>
            <div>Expertise: {expertDetails[1]}</div>
            <div>Voice Rate: {expertDetails[3]?.toString()} USDC/min</div>
            <div>Video Rate: {expertDetails[4]?.toString()} USDC/min</div>
            <div>Registered: {expertDetails[5] ? 'Yes' : 'No'}</div>
          </div>
        )}
      </div>

      {/* Write Contract Test */}
      {isConnected && isOnCorrectNetwork && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-2">✍️ Write Contract Test</h3>
          <button
            onClick={handleRegisterExpert}
            disabled={isWritePending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {isWritePending ? 'Registering...' : 'Register as Expert'}
          </button>
          <div className="text-sm text-gray-400 mt-2">
            This will attempt to register your wallet as an expert with test data
          </div>
        </div>
      )}

      {/* Call ID Test */}
      <div className="mb-4 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">📞 Call Details Test</h3>
        <input
          type="text"
          placeholder="Enter call ID (bytes32)"
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded mb-2"
        />
        <div className="text-sm text-gray-400">
          Use any bytes32 value to test call details retrieval
        </div>
      </div>

      {/* Contract Methods Available */}
      <div className="p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">📋 Available Contract Methods</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>✅ getExpertDetails</div>
          <div>✅ getAvailableBalance</div>
          <div>✅ registerExpert</div>
          <div>✅ scheduleCall</div>
          <div>✅ startCall</div>
          <div>✅ endCall</div>
          <div>✅ deposit</div>
          <div>✅ withdrawBalance</div>
        </div>
      </div>
    </div>
  );
};