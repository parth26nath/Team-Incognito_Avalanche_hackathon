# Heartly - Mental Health Platform on Avalanche

## 🌟 Overview
Heartly is a decentralized mental health platform built on Avalanche, enabling anonymous and secure connections between individuals seeking support and verified mental health experts. By leveraging Avalanche's high-performance blockchain infrastructure, we ensure fast, secure, and cost-effective interactions.

## 🚀 Avalanche Integration

### Why Avalanche?
- **High Performance**: Avalanche's sub-second finality ensures real-time payment processing
- **Low Transaction Costs**: Minimal gas fees make micro-transactions feasible
- **EVM Compatibility**: Seamless integration with existing Ethereum tools and libraries
- **Sustainability**: Energy-efficient consensus mechanism
- **Cross-Chain Capabilities**: Future expansion possibilities across Avalanche subnets

### Avalanche Components Used
1. **C-Chain (Contract Chain)**
   - Smart contract deployment
   - USDC payment integration
   - Escrow system implementation
   - User verification contracts

2. **Avalanche Network Features**
   - Fuji Testnet for development
   - MainNet for production
   - Native AVAX token integration
   - Cross-subnet communication

3. **Avalanche Tools**
   - Core API integration
   - AvalancheJS SDK
   - Avalanche Wallet Connect
   - TheGraph indexing

## 🛠 Technical Architecture

### Smart Contracts (Avalanche C-Chain)
```solidity
- Payment Processing
- Escrow Management
- Expert Verification
- Token Integration (USDC)
```

### Frontend
- Next.js 13+ (App Router)
- TypeScript
- TailwindCSS
- RainbowKit + Wagmi
- Socket.io Client

### Backend
- Express.js + TypeScript
- PostgreSQL + TypeORM
- Socket.io Server
- SIWE Authentication

## 🔐 Security Features
- Sign-In with Ethereum (SIWE)
- End-to-end encryption
- Anonymous chat matching
- Secure payment channels
- Smart contract auditing

## 🌐 Core Features
1. **Anonymous Support**
   - Private chat rooms
   - Identity protection
   - Secure messaging

2. **Expert Verification**
   - Blockchain-based credentials
   - Reputation system
   - Expertise validation

3. **Secure Payments**
   - USDC integration
   - Escrow system
   - Automated settlements

4. **Real-time Communication**
   - WebSocket integration
   - Typing indicators
   - Online status tracking

## 🚀 Getting Started

### Prerequisites
```bash
- Node.js 18+
- PostgreSQL
- Avalanche Wallet
- USDC on Avalanche
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/heartly.git
cd heartly
```

2. Install dependencies
```bash
# Frontend
cd web
npm install

# Backend
cd ../Heartly-api-main
npm install

# Smart Contracts
cd ../contract
npm install
```

3. Configure environment variables
```bash
# Copy environment templates
cp web/.env.template web/.env
cp Heartly-api-main/.env.template Heartly-api-main/.env
cp contract/.env.template contract/.env
```

4. Deploy smart contracts
```bash
cd contract
npx hardhat run scripts/deploy.js --network fuji
```

### Running the Application
```bash
# Start backend
cd Heartly-api-main
npm run dev

# Start frontend
cd web
npm run dev
```

## 📝 Smart Contract Addresses

### Fuji Testnet
```
Heartly Contract: 0x...
USDC Contract: 0x...
```

### Mainnet
```
Heartly Contract: 0x...
USDC Contract: 0x...
```

## 🔄 Workflow
1. User connects Avalanche wallet
2. Anonymous profile creation
3. Expert matching
4. Secure chat initiation
5. USDC payment processing
6. Session completion and settlement




## 🙏 Acknowledgments
- Avalanche Team and Community
- Mental Health Professionals
- Open Source Contributors


---
Built with ❤️ on Avalanche