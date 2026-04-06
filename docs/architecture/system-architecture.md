# CrowdQuest — System Architecture

## Overview

CrowdQuest is a **fully decentralised** treasure hunt platform. There is no backend server, no admin key, and no centralised database. All game state lives on-chain; all media lives on IPFS.

```
┌────────────────────────────────────────────────────────────┐
│                       Client layer                         │
│   React Native (iOS / Android)  ·  Optional web dashboard  │
└──────────────────────┬─────────────────────────────────────┘
                       │  ethers.js / WalletConnect
┌──────────────────────▼─────────────────────────────────────┐
│                    Blockchain layer                         │
│   Polygon / Ethereum                                        │
│   ┌────────────────────────────────────────────────────┐   │
│   │  CrowdQuest.sol  (orchestrator)                    │   │
│   │  ├─ CrowdQuestToken.sol  (ERC20 + staking)         │   │
│   │  ├─ TurnManager.sol      (turn lifecycle)          │   │
│   │  └─ ProfileManager.sol  (player stats / ranks)    │   │
│   └────────────────────────────────────────────────────┘   │
└──────────────────────┬─────────────────────────────────────┘
                       │  HTTP gateway (read-only)
┌──────────────────────▼─────────────────────────────────────┐
│                     Storage layer                           │
│   IPFS  (grid images, QR metadata, hint images)            │
│   Pinata / Web3.Storage  (pinning service)                 │
└────────────────────────────────────────────────────────────┘
```

---

## Component descriptions

### React Native app (`apps/mobile`)

The primary user interface. All blockchain reads are performed via `ethers.js` provider calls (no intermediary API server). All writes are signed by the user's wallet via MetaMask SDK or WalletConnect v2.

Key packages:

| Package | Role |
|---|---|
| `ethers` v6 | Provider, signer, contract interaction |
| `@metamask/sdk-react-native` | MetaMask wallet connection |
| `@walletconnect/modal-react-native` | WalletConnect v2 |
| `react-native-camera` | QR scanning |
| `@redux/toolkit` | State management |
| `react-native-async-storage` | Local session cache |

### Smart contracts (`packages/contracts`)

Written in Solidity 0.8.24, compiled and tested with Foundry.

| Contract | Purpose |
|---|---|
| `CrowdQuest.sol` | Main entry point — treasure creation, claim, guess |
| `CrowdQuestToken.sol` | ERC20 token with staking hooks |
| `TurnManager.sol` | Per-treasure turn tracking, hint release |
| `ProfileManager.sol` | Player profiles, stats, ranking |
| `RewardCalculator.sol` | Time-based and turn-based reward formula |

### IPFS storage

Images (grid backgrounds, QR art) are uploaded to IPFS via Pinata before treasure creation. The IPFS CID is stored in the contract as part of the treasure metadata. No data is pinned by any centralised CrowdQuest server — each client is responsible for pinning its own uploads.

---

## Data flow: Virtual treasure (create → find)

```
Hider
  │  1. Picks grid cell (x, y)
  │  2. Uploads background image → IPFS CID
  │  3. Inputs 3–5 text hints
  │  4. Approves token + calls createVirtualTreasure(answerHash, hints, stake)
  ▼
CrowdQuest.sol
  │  5. Locks stake via CrowdQuestToken.stake()
  │  6. Stores TreasureStruct (id, creator, stake, answerHash, hints[])
  │  7. Emits TreasureCreated event
  ▼
Hunter (any wallet)
  │  8. Calls joinTreasure(id)
  │  9. TurnManager.addPlayer(id, hunter)
  │ 10. Calls submitGuess(id, x, y) once per turn
  ▼
TurnManager.sol
  │ 11. Records guess; if all active players guessed → processTurn()
  │ 12. processTurn(): checks each guess against answerHash
  │ 13. If correct: RewardCalculator.calculateVirtualReward(stake, turn)
  │ 14. Transfers reward to finder, remainder to creator
  │ 15. ProfileManager.updateOnFind(finder) + updateOnFound(creator)
  │ 16. Emits TreasureFound(id, finder, reward)
  ▼
Mobile app
  │ 17. Listens for TreasureFound event
  │ 18. Updates UI, shows reward confirmation
```

## Data flow: Real-world treasure (create → claim)

```
Hider
  │  1. Calls createRealWorldTreasure(keccak256(secret), stake)
  │  2. Downloads generated QR code containing encoded secret
  │  3. Prints and hides QR in physical location
  ▼
Hunter (any wallet with camera)
  │  4. Opens ScanScreen, points camera at QR
  │  5. App decodes QR → extracts secret string
  │  6. Calls claimRealWorldTreasure(id, secret)
  ▼
CrowdQuest.sol
  │  7. Verifies keccak256(secret) == stored hash
  │  8. Marks QR as used (single-use enforcement)
  │  9. Calculates reward = f(stake, block.timestamp − createdAt)
  │ 10. Transfers tokens, emits TreasureFound
```

---

## Security model

- **No admin key.** Once deployed, contracts are immutable (or upgradable via a time-locked proxy — see `deployment.md`).
- **Reentrancy protection.** All state changes complete before any external calls (checks-effects-interactions pattern + OpenZeppelin `ReentrancyGuard`).
- **Hash commitment.** Virtual treasure answers are stored as `keccak256(x, y)`. The pre-image is never stored on-chain.
- **Single-use QR.** A mapping `usedQRHashes` prevents replay of a claimed secret.
- **Access control.** `CrowdQuestToken.stake()` and `unstake()` are callable only by the authorised game contract address.
- **Input validation.** Coordinates are validated 0 ≤ x, y ≤ 127. Hints array length is enforced 3–5. Stake must exceed `MIN_STAKE`.

---

## Network targets

| Network | Status | Chain ID |
|---|---|---|
| Polygon Mumbai (testnet) | Active | 80001 |
| Polygon Mainnet | Planned | 137 |
| Ethereum Sepolia | Active | 11155111 |
| Ethereum Mainnet | Planned | 1 |

---

## Monorepo structure at a glance

```
crowdquest/
├── apps/
│   └── mobile/            React Native app (Person 2, 3, 4)
├── packages/
│   ├── contracts/         Solidity contracts + tests (Person 1, 5)
│   ├── shared-types/      Shared TypeScript types
│   ├── shared-utils/      Shared utilities (formatters, validators)
│   └── config/            Network + contract address config
├── scripts/               Deployment + ABI generation scripts (Person 5)
└── .github/workflows/     CI/CD pipelines (Person 5)
```
