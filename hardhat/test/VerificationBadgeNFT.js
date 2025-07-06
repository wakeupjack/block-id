const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("VerificationBadgeNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy SoulboundIdentity contract first
    const SoulboundIdentity = await ethers.getContractFactory("SoulboundIdentity");
    const soulboundIdentity = await SoulboundIdentity.deploy(owner.address);

    // Deploy VerificationBadgeNFT contract
    const VerificationBadgeNFT = await ethers.getContractFactory("VerificationBadgeNFT");
    const verificationBadgeNFT = await VerificationBadgeNFT.deploy(
      owner.address,
      soulboundIdentity.target
    );

    return { soulboundIdentity, verificationBadgeNFT, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { verificationBadgeNFT, owner } = await loadFixture(deployFixture);
      expect(await verificationBadgeNFT.owner()).to.equal(owner.address);
    });

    it("Should set the right SoulboundIdentity contract", async function () {
      const { soulboundIdentity, verificationBadgeNFT } = await loadFixture(deployFixture);
      expect(await verificationBadgeNFT.soulboundIdentity()).to.equal(soulboundIdentity.target);
    });

    it("Should have correct name and symbol", async function () {
      const { verificationBadgeNFT } = await loadFixture(deployFixture);
      expect(await verificationBadgeNFT.name()).to.equal("Verification Badge");
      expect(await verificationBadgeNFT.symbol()).to.equal("VBADGE");
    });
  });

  describe("Badge Minting", function () {
    it("Should not allow minting to address without verified identity", async function () {
      const { verificationBadgeNFT, addr1 } = await loadFixture(deployFixture);
      
      await expect(
        verificationBadgeNFT.safeMint(addr1.address, "ipfs://test-uri")
      ).to.be.revertedWith("VerificationBadgeNFT: Address must have a verified identity");
    });

    it("Should allow minting to address with verified identity", async function () {
      const { soulboundIdentity, verificationBadgeNFT, owner, addr1 } = await loadFixture(deployFixture);
      
      // First mint a soulbound identity
      await soulboundIdentity.safeMint(addr1.address, "ipfs://identity-uri");
      
      // Then mint a badge
      await expect(
        verificationBadgeNFT.safeMint(addr1.address, "ipfs://badge-uri")
      ).to.emit(verificationBadgeNFT, "BadgeMinted")
        .withArgs(addr1.address, 0, 0);
      
      expect(await verificationBadgeNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await verificationBadgeNFT.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should not allow minting multiple badges to same address", async function () {
      const { soulboundIdentity, verificationBadgeNFT, owner, addr1 } = await loadFixture(deployFixture);
      
      // First mint a soulbound identity
      await soulboundIdentity.safeMint(addr1.address, "ipfs://identity-uri");
      
      // Mint first badge
      await verificationBadgeNFT.safeMint(addr1.address, "ipfs://badge-uri");
      
      // Try to mint second badge - should fail
      await expect(
        verificationBadgeNFT.safeMint(addr1.address, "ipfs://badge-uri-2")
      ).to.be.revertedWith("VerificationBadgeNFT: Address has already minted a badge");
    });

    it("Should allow self-minting for verified identity holders", async function () {
      const { soulboundIdentity, verificationBadgeNFT, owner, addr1 } = await loadFixture(deployFixture);
      
      // First mint a soulbound identity
      await soulboundIdentity.safeMint(addr1.address, "ipfs://identity-uri");
      
      // Self-mint a badge
      await expect(
        verificationBadgeNFT.connect(addr1).mintBadge("ipfs://badge-uri")
      ).to.emit(verificationBadgeNFT, "BadgeMinted")
        .withArgs(addr1.address, 0, 0);
      
      expect(await verificationBadgeNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await verificationBadgeNFT.ownerOf(0)).to.equal(addr1.address);
    });
  });

  describe("Badge Transfer", function () {
    it("Should allow badge transfer (unlike soulbound tokens)", async function () {
      const { soulboundIdentity, verificationBadgeNFT, owner, addr1, addr2 } = await loadFixture(deployFixture);
      
      // First mint a soulbound identity
      await soulboundIdentity.safeMint(addr1.address, "ipfs://identity-uri");
      
      // Mint a badge
      await verificationBadgeNFT.safeMint(addr1.address, "ipfs://badge-uri");
      
      // Transfer badge from addr1 to addr2
      await verificationBadgeNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      
      expect(await verificationBadgeNFT.ownerOf(0)).to.equal(addr2.address);
      expect(await verificationBadgeNFT.balanceOf(addr1.address)).to.equal(0);
      expect(await verificationBadgeNFT.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("Utility Functions", function () {
    it("Should correctly check eligibility for badge", async function () {
      const { soulboundIdentity, verificationBadgeNFT, owner, addr1 } = await loadFixture(deployFixture);
      
      // Initially not eligible
      expect(await verificationBadgeNFT.isEligibleForBadge(addr1.address)).to.be.false;
      
      // After minting soulbound identity, should be eligible
      await soulboundIdentity.safeMint(addr1.address, "ipfs://identity-uri");
      expect(await verificationBadgeNFT.isEligibleForBadge(addr1.address)).to.be.true;
      
      // After minting badge, should not be eligible anymore
      await verificationBadgeNFT.safeMint(addr1.address, "ipfs://badge-uri");
      expect(await verificationBadgeNFT.isEligibleForBadge(addr1.address)).to.be.false;
    });

    it("Should return correct total supply", async function () {
      const { soulboundIdentity, verificationBadgeNFT, owner, addr1, addr2 } = await loadFixture(deployFixture);
      
      expect(await verificationBadgeNFT.totalSupply()).to.equal(0);
      
      // Mint soulbound identities
      await soulboundIdentity.safeMint(addr1.address, "ipfs://identity-uri-1");
      await soulboundIdentity.safeMint(addr2.address, "ipfs://identity-uri-2");
      
      // Mint badges
      await verificationBadgeNFT.safeMint(addr1.address, "ipfs://badge-uri-1");
      expect(await verificationBadgeNFT.totalSupply()).to.equal(1);
      
      await verificationBadgeNFT.safeMint(addr2.address, "ipfs://badge-uri-2");
      expect(await verificationBadgeNFT.totalSupply()).to.equal(2);
    });
  });
});