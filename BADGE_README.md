# VerificationBadgeNFT Feature

## Overview

The VerificationBadgeNFT feature adds transferable NFT badges to the BlockID system. These badges serve as visual proof of identity verification and can be transferred between addresses, unlike the non-transferable SoulboundIdentity tokens.

## Architecture

### Smart Contract (`VerificationBadgeNFT.sol`)

The badge contract implements ERC-721 with the following key features:

- **Transferability**: Unlike SoulboundIdentity tokens, badges can be transferred
- **Verification Requirement**: Only holders of verified SoulboundIdentity tokens can mint badges
- **One Badge Per Address**: Each address can only mint one badge to prevent spam
- **Metadata Storage**: Badge metadata is stored on IPFS via Pinata
- **Soulbound Reference**: Each badge references the original SoulboundIdentity token

### Backend Integration

New API endpoints have been added to `app.py`:

- `POST /api/badge/mint` - Prepare badge metadata for minting
- `GET /api/badge/status/{address}` - Check badge eligibility and status
- `GET /api/badge/info/{address}` - Get badge information for an address

### Frontend

A new badge page (`/badge`) provides:

- Badge status display
- Badge minting interface for eligible users
- Badge collection viewing
- Comprehensive error handling and loading states

## Deployment

### Prerequisites

1. Deploy the SoulboundIdentity contract first
2. Set environment variables:
   - `SOULBOUND_IDENTITY_ADDRESS` - Address of the deployed SoulboundIdentity contract
   - `BADGE_CONTRACT_ADDRESS` - Address of the deployed VerificationBadgeNFT contract

### Smart Contract Deployment

```bash
cd hardhat
export SOULBOUND_IDENTITY_ADDRESS=0x...
npx hardhat run scripts/deploy-badge.js --network sepolia
```

### Backend Configuration

Add to your `.env` file:
```
BADGE_CONTRACT_ADDRESS=0x...
```

Copy the contract ABI:
```bash
cp artifacts/contracts/VerificationBadgeNFT.sol/VerificationBadgeNFT.json backend/
```

## Usage Flow

1. **User Verification**: User completes identity verification and receives SoulboundIdentity token
2. **Badge Eligibility**: System checks if user is eligible for badge (has SoulboundIdentity, hasn't minted badge)
3. **Badge Minting**: User can mint their verification badge NFT
4. **Badge Transfer**: Unlike SoulboundIdentity, badges can be transferred to other addresses

## Key Differences from SoulboundIdentity

| Feature | SoulboundIdentity | VerificationBadgeNFT |
|---------|-------------------|----------------------|
| Transferability | Non-transferable | Transferable |
| Purpose | Identity proof | Visual badge |
| Minting | Admin only | Self-mint for verified users |
| Quantity | One per verification | One per address |
| Reference | Standalone | References SoulboundIdentity |

## Testing

Run the test suite:
```bash
cd hardhat
npx hardhat test test/VerificationBadgeNFT.js
```

## Security Considerations

- Only verified identity holders can mint badges
- One badge per address prevents spam
- Badge metadata is stored on IPFS for immutability
- Smart contract follows OpenZeppelin standards for security