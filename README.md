# CrowdQuest – Decentralized Treasure Hunt Platform

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Built%20with-Foundry-FF6B00.svg)](https://getfoundry.sh/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🏴‍☠️ Overview

CrowdQuest is a fully decentralized treasure hunt platform that enables users to create, hide, and discover treasures across both **real-world physical locations** (via QR codes) and **virtual grid-based environments**. Built on blockchain technology with no central administrator, CrowdQuest creates a self-sustaining game economy driven entirely by player interaction.

### Key Features

- **🎮 Two Game Modes**
  - *Real-World*: Hide physical treasures with QR codes, scan to claim rewards
  - *Virtual*: 128×128 interactive grid with turn-based multiplayer hunting

- **💰 Token Economy**
  - Stake tokens to create treasures
  - Time-based reward multipliers (faster finds = bigger payouts)
  - Creator receives remaining stake after discovery

- **🔄 Turn-Based Gameplay**
  - One guess per player per turn
  - Progressive hint system
  - Dynamic reward calculation on-chain

- **📊 Player Profiles**
  - Persistent statistics tied to wallet addresses
  - Cross-mode unified stats (created, found, earned, accuracy)
  - Achievement badges and leaderboards

- **🔒 Fully Decentralized**
  - No admin keys or central control
  - All game logic on smart contracts
  - IPFS for metadata storage

## 🛠️ Tech Stack

### Smart Contracts
- **Language**: Solidity 0.8.20
- **Framework**: Foundry (Forge)
- **Dependencies**: OpenZeppelin Contracts
- **Network**: Ethereum Sepolia (testnet) / Polygon (mainnet)

### Frontend
- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite 5.19
- **Styling**: TailwindCSS + shadcn/ui
- **Web3**: ethers.js v6, MetaMask SDK
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MetaMask browser extension
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/crowdquest.git
cd crowdquest
```
2. Smart Contract Setup
```bash
# Navigate to contracts directory
cd crowdquest-contracts

# Install Foundry dependencies
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts

# Copy environment variables
cp .env.example .env

# Edit .env with your RPC URLs and private key
# Add your Sepolia RPC URL and deployer private key

# Compile contracts
forge build

# Run tests
forge test

# Deploy to Sepolia testnet
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast --verify
```
3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with contract addresses
# Add your deployed contract addresses:
# VITE_CROWD_QUEST_ADDRESS=0x...
# VITE_TOKEN_ADDRESS=0x...
# VITE_PROFILE_MANAGER_ADDRESS=0x...
# VITE_TURN_MANAGER_ADDRESS=0x...

# Start development server
npm run dev
```
4. Environment Variables
Contracts (.env)

```bash
SEPOLIA_RPC_URL=https://rpc.sepolia.org
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_api_key
```
Frontend (.env)

```bash
VITE_CROWD_QUEST_ADDRESS=0x...
VITE_TOKEN_ADDRESS=0x...
VITE_PROFILE_MANAGER_ADDRESS=0x...
VITE_TURN_MANAGER_ADDRESS=0x...
VITE_CHAIN_ID=11155111
```
## 🎮 Gameplay Guide
### Creating a Treasure (Hider)
```
Connect Wallet: Click "Connect Wallet" and approve MetaMask connection

Select Mode: Choose Virtual (grid) or Real-World (QR)

Set Stake: Enter amount of CQ tokens to stake
```
Virtual Mode:
```
Select treasure location on 128×128 grid

Provide 3-5 progressive hints

Set hint release schedule
```
Real-World Mode:
```
Generate unique QR code

Download and print QR code

Hide QR code in physical location

Invite Players: Add usernames or generate invite link

Confirm Transaction: Approve token spending and creation transaction
```
## Finding a Treasure (Hunter)
Virtual Mode:
```
Browse active virtual treasures

View progressive hints (released by turn)

Submit one guess per turn (x, y coordinates)

Wait for turn completion

Correct guess → automatic reward distribution
```
Real-World Mode:
```
Find physical QR code in real world

Open CrowdQuest app and navigate to Scan

Scan QR code with camera (or enter manually)

System verifies on-chain

Reward automatically sent to your wallet

Reward Multipliers
Discovery Speed	Reward %	Turns (Virtual)
< 1 hour	90%	Turn 1
1h – 3 days	70%	Turn 5
3 – 4 days	50%	Turn 10
4 – 7 days	35%	Turn 15
> 7 days	20%	Turn 20
```
### 📁 Project Structure
```text
crowdquest/
├── crowdquest-contracts/          # Smart contracts
│   ├── src/
│   │   ├── core/                  # Core game logic
│   │   │   ├── CrowdQuest.sol
│   │   │   ├── ProfileManager.sol
│   │   │   └── TurnManager.sol
│   │   ├── libraries/             # Reusable libraries
│   │   ├── types/                 # Struct definitions
│   │   └── utils/                 # Constants & errors
│   ├── test/                      # Forge tests
│   ├── script/                    # Deployment scripts
│   └── foundry.toml
│
├── frontend/                       # React web app
│   ├── src/
│   │   ├── components/            # UI components
│   │   ├── pages/                 # Page views
│   │   │   ├── Index.tsx          # Landing page
│   │   │   ├── CreateGamePage.tsx
│   │   │   ├── HuntPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── ScanPage.tsx
│   │   ├── contexts/              # React contexts
│   │   │   └── WalletContext.tsx
│   │   ├── hooks/                 # Custom hooks
│   │   ├── services/              # Contract services
│   │   ├── abis/                  # Contract ABIs
│   │   └── constants/             # Contract addresses
│   ├── public/
│   └── package.json
│
└── README.md
```
## 🧪 Testing
### Smart Contract Tests
```bash
cd crowdquest-contracts

# Run all tests
forge test

# Run specific test suite
forge test --match-contract TurnManagerTest

# Run with gas report
forge test --gas-report

# Run with verbose output
forge test -vvv
Frontend Tests
bash
cd frontend

# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
```
### 🔧 Development Commands
Smart Contracts
Command	Description
```
forge build	Compile contracts
forge test	Run tests
forge coverage	Generate coverage report
forge fmt	Format Solidity code
forge script Deploy.s.sol --broadcast	Deploy contracts
```
Frontend
Command	Description
```
npm run dev	Start dev server
npm run build	Production build
npm run preview	Preview production build
npm run lint	Run ESLint
npm run type-check	TypeScript type checking
```
### 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

### ⚠️ Disclaimer
CrowdQuest is a fully decentralized application with no central authority. Users are responsible for:
```
Understanding gas fees and blockchain transactions

Securing their wallet private keys

Complying with local cryptoasset regulations

Verifying smart contract audits before mainnet use

Use at your own risk.
```
📞 Support
```
Documentation: docs.crowdquest.io

Discord: discord.gg/crowdquest

Twitter: @CrowdQuest

GitHub Issues: github.com/your-org/crowdquest/issues
```
🙏 Acknowledgments
```
OpenZeppelin for secure contract libraries

Foundry team for excellent testing framework

shadcn/ui for beautiful components

All early testers and contributors
```
Built with ❤️ for decentralized treasure hunting

