# Contributing guide

This document describes how the 5-person CrowdQuest team works together without stepping on each other.

---

## Who owns what

| Person | Role | Primary files |
|---|---|---|
| P1 | Lead Blockchain Dev | `packages/contracts/src/**` |
| P2 | Frontend Lead | `apps/mobile/src/screens/`, `apps/mobile/src/store/`, `apps/mobile/src/styles/` |
| P3 | Blockchain & Integration | `apps/mobile/src/blockchain/`, `apps/mobile/src/screens/RealWorldMode/` |
| P4 | Full-Stack & QA | `apps/mobile/src/components/virtual/`, `apps/mobile/src/screens/VirtualMode/` |
| P5 | DevOps & Testing | `.github/workflows/`, `scripts/`, `packages/contracts/test/`, `docs/` |

If you need to edit a file outside your area, open a PR and tag the owner for review.

---

## Branch naming

```
feature/p<N>-<short-description>
```

Examples:
```
feature/p1-turn-manager
feature/p2-home-screen
feature/p3-qr-system
feature/p4-grid-zoom
feature/p5-fuzz-tests
```

Bug fixes:
```
fix/p<N>-<short-description>
fix/p3-qr-offline-scan
```

---

## Daily workflow

```
1. Pull from develop every morning
   git fetch origin
   git rebase origin/develop

2. Work in your feature branch

3. Before pushing, run local checks:
   pnpm lint
   pnpm typecheck
   cd packages/contracts && forge test   (P1/P5 only)

4. Push and open a PR to develop (not main)

5. CI runs automatically — wait for green before requesting review

6. Squash-merge after approval
```

---

## PR rules

- **Target: `develop`** — never open a PR directly to `main`.
- Title: `feat(p2): add home screen balance card` — include person prefix.
- Every PR needs at least **1 approval** from a team member who doesn't own those files.
- Contract PRs (`packages/contracts/src/`) need approval from **both P1 and P5**.
- Delete the feature branch after merge.

---

## ABI sync (critical coordination point)

Whenever P1 merges a contract change, P5 must run the ABI sync before any frontend PR merges. This is enforced by the `abi-sync` CI job which blocks merges if ABIs are out of date.

If CI blocks you:

```bash
git fetch origin develop
git rebase origin/develop

bash scripts/utils/generate-abis.sh
git add apps/mobile/src/blockchain/contracts/
git commit -m "chore: sync ABIs"
git push
```

---

## Commit message format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

Types: feat | fix | chore | test | docs | refactor | perf
Scope: p1 | p2 | p3 | p4 | p5 | contracts | mobile | ci
```

Examples:
```
feat(p1): add TurnManager timeout handling
fix(p3): handle camera permission denial on Android
test(p5): add fuzz tests for RewardCalculator
chore(p5): sync ABIs after TurnManager update
docs(p5): add contract API reference
```

---

## Coordination checklist — per sprint day

### Day 1 (Foundation)
- [ ] P5 sets up monorepo (PNPM + Turborepo + Foundry + CI) — **everyone waits for this before starting**
- [ ] P1 starts token contract
- [ ] P2 starts React Native project scaffold
- [ ] After P5 confirms CI is green: P3, P4 branch off and start their work

### Day 2 (Core features)
- [ ] P1 merges token contract → P5 runs ABI sync → P3 can start blockchain hooks
- [ ] P2 needs `walletSlice` and `uiSlice` from their own scope before P3 can use them

### Day 3 (Game modes)
- [ ] P1 merges TurnManager → P5 sync → P4 can wire `useTurn` hook
- [ ] P3 needs camera permissions helper from `apps/mobile/src/utils/permissions.ts` (P2 owns it)

### Day 4 (Integration)
- [ ] P4 needs P1's ProfileManager deployed to testnet for E2E achievement tests
- [ ] P3's QR flow depends on P1's `claimRealWorldTreasure` being deployed

### Day 5 (Testing & launch)
- [ ] P5 runs `forge coverage` — if below 85%, P1 adds missing unit tests
- [ ] P5 tags `v1.0.0` after all PRs merged to `main`

---

## Secrets management

- **Never commit private keys or API keys** — not even to feature branches.
- All secrets go in **GitHub Actions Secrets** (Settings → Secrets → Actions).
- Local `.env` files are gitignored. Share values over a secure channel (1Password, Bitwarden).
- The `PRIVATE_KEY` in `.env` should always be a **throwaway testnet key** — never a key holding real funds.

---

## Getting help

- Blocked on a contract function? Tag P1 in Slack.
- CI failing with a weird Foundry error? Tag P5.
- ABI drift blocking your mobile PR? Tag P5 to run the sync.
- Need a new shared utility? Open a PR to `packages/shared-utils/` and tag everyone.
