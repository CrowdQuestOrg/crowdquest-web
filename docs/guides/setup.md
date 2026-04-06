# Development setup guide

This guide gets any team member from a fresh machine to a running CrowdQuest development environment in under 15 minutes.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥ 20 LTS | [nodejs.org](https://nodejs.org) |
| pnpm | ≥ 9 | `npm install -g pnpm` |
| Foundry | latest | `curl -L https://foundry.paradigm.xyz \| bash && foundryup` |
| Git | ≥ 2.40 | system package manager |
| Xcode (iOS, macOS only) | ≥ 15 | App Store |
| Android Studio (Android) | latest | [developer.android.com](https://developer.android.com/studio) |

---

## 1. Clone and install

```bash
git clone https://github.com/your-org/crowdquest.git
cd crowdquest

# Install all workspace dependencies
pnpm install

# Install Foundry libraries (forge-std, OpenZeppelin)
cd packages/contracts
forge install
cd ../..
```

---

## 2. Environment variables

```bash
# Copy the root template
cp .env.example .env

# Copy the mobile app template
cp apps/mobile/.env.example apps/mobile/.env
```

Open `.env` and fill in:

```env
# ── Blockchain RPCs ────────────────────────────────────────────────────
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
ETHEREUM_SEPOLIA_RPC_URL=https://rpc.sepolia.org

# ── Block explorer API keys (for contract verification) ───────────────
POLYGONSCAN_API_KEY=your_key_here
ETHERSCAN_API_KEY=your_key_here

# ── IPFS / Pinata ─────────────────────────────────────────────────────
PINATA_API_KEY=your_key_here
PINATA_SECRET_API_KEY=your_key_here

# ── Deployer (NEVER commit a real private key) ─────────────────────────
# Use a throwaway testnet key here. For production, use hardware wallet.
PRIVATE_KEY=0xdeadbeef...
```

Open `apps/mobile/.env` and fill in:

```env
EXPO_PUBLIC_CHAIN_ID=80001
EXPO_PUBLIC_CROWDQUEST_ADDRESS=0x...       # from packages/config/src/contracts.ts
EXPO_PUBLIC_TOKEN_ADDRESS=0x...
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
EXPO_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
```

---

## 3. Build shared packages

The mobile app and scripts depend on built versions of `shared-types` and `shared-utils`. Build them first:

```bash
pnpm build --filter=./packages/*
```

This uses Turborepo and caches outputs — subsequent builds are instant if nothing changed.

---

## 4. Build and test contracts

```bash
cd packages/contracts

# Compile
forge build

# Run all tests
forge test -vvv

# Run with gas report
forge test --gas-report

# Run fuzz tests (more runs = more confidence)
forge test --match-path "test/fuzz/*.t.sol" --fuzz-runs 1000
```

Common Forge flags:

| Flag | Purpose |
|---|---|
| `-vvv` | Verbose output with stack traces |
| `--match-test testName` | Run a single test |
| `--match-contract ContractName` | Run a single test contract |
| `--gas-report` | Show gas usage table |
| `--fuzz-runs N` | Set fuzz iteration count |
| `forge snapshot` | Save current gas snapshot |

---

## 5. Run the mobile app

```bash
# iOS simulator (macOS only)
pnpm --filter @crowdquest/mobile ios

# Android emulator
pnpm --filter @crowdquest/mobile android

# Expo Go (fastest, limited native features)
pnpm --filter @crowdquest/mobile start
```

For WalletConnect to work on a simulator, you need a real device or a WalletConnect-compatible test wallet. Use [MetaMask Flask](https://metamask.io/flask/) for development.

---

## 6. Deploy contracts to testnet

```bash
# Dry run first (no broadcast, no real transactions)
bash scripts/deploy/deploy-all.sh --network polygon_mumbai --dry-run

# Live deploy
bash scripts/deploy/deploy-all.sh --network polygon_mumbai --verify
```

After deployment:

```bash
# Sync ABIs to the mobile app
bash scripts/utils/generate-abis.sh

# Update contract addresses in packages/config
bash scripts/utils/update-addresses.sh polygon_mumbai

# Commit the result
git add apps/mobile/src/blockchain/contracts/ packages/config/src/contracts.ts
git commit -m "chore: deploy to polygon_mumbai"
```

---

## 7. Run the full test suite locally

```bash
bash scripts/test/run-all-tests.sh
```

Or individual suites:

```bash
bash scripts/test/run-all-tests.sh --contracts-only
bash scripts/test/run-all-tests.sh --mobile-only
bash scripts/test/run-all-tests.sh --contracts-only --fuzz-runs 2000
```

---

## 8. Git workflow

We use trunk-based development with short-lived feature branches:

```
main        ← production-ready, protected
develop     ← integration target
feature/*   ← your work
```

Branch naming:

```
feature/p1-turn-manager
feature/p2-home-screen
feature/p3-qr-system
feature/p4-grid-system
feature/p5-ci-cd
```

Before opening a PR:

```bash
# Lint
pnpm lint

# Type-check
pnpm typecheck

# Contract tests
cd packages/contracts && forge test

# Check no ABI drift
bash scripts/utils/generate-abis.sh
git diff --exit-code apps/mobile/src/blockchain/contracts/
```

---

## Common issues

### `forge: command not found`
Run `foundryup` to install/update Foundry, then restart your terminal.

### `Module not found: @crowdquest/shared-types`
Run `pnpm build --filter=./packages/*` to compile shared packages first.

### Simulator can't connect wallet
Use a physical device for wallet testing, or use Anvil's built-in accounts and point MetaMask at `http://localhost:8545`.

### Gas estimation failed
Your testnet wallet has insufficient funds. Get test MATIC from [faucet.polygon.technology](https://faucet.polygon.technology).

---

## Useful one-liners

```bash
# Start a local Anvil node (fork of Mumbai)
anvil --fork-url $POLYGON_MUMBAI_RPC_URL --chain-id 80001

# Watch contract events locally
cast logs --address 0x... --rpc-url http://localhost:8545

# Check a function call without a transaction
cast call 0x<contract> "totalSupply()(uint256)" --rpc-url $POLYGON_MUMBAI_RPC_URL

# Send a test transaction
cast send 0x<contract> "joinTreasure(uint256)" 1 --private-key $PRIVATE_KEY --rpc-url $POLYGON_MUMBAI_RPC_URL
```
