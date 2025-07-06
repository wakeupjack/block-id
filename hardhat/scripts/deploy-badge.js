const hre = require("hardhat");

async function main() {
  // 1. Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 2. Get the deployed SoulboundIdentity contract address
  // This should be set in environment variables or passed as parameter
  const soulboundIdentityAddress = process.env.SOULBOUND_IDENTITY_ADDRESS;
  
  if (!soulboundIdentityAddress) {
    console.error("SOULBOUND_IDENTITY_ADDRESS environment variable not set");
    console.log("Please set the SoulboundIdentity contract address before deploying VerificationBadgeNFT");
    process.exit(1);
  }

  console.log("Using SoulboundIdentity contract at:", soulboundIdentityAddress);

  // 3. Deploy the VerificationBadgeNFT contract
  const verificationBadgeNFT = await hre.ethers.deployContract("VerificationBadgeNFT", [
    deployer.address,
    soulboundIdentityAddress
  ]);

  // Wait for deployment to complete
  await verificationBadgeNFT.waitForDeployment();

  // 4. Print the contract address
  console.log(
    `VerificationBadgeNFT contract deployed to ${verificationBadgeNFT.target}`
  );
  console.log(
    `Constructor args: initialOwner=${deployer.address}, soulboundIdentity=${soulboundIdentityAddress}`
  );

  // 5. Save the contract address to a file for backend integration
  const fs = require('fs');
  const contractInfo = {
    address: verificationBadgeNFT.target,
    soulboundIdentityAddress: soulboundIdentityAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync('VerificationBadgeNFT-deployment.json', JSON.stringify(contractInfo, null, 2));
  console.log("Contract deployment info saved to VerificationBadgeNFT-deployment.json");
}

// Handle async/await pattern
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});