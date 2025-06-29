const hre = require("hardhat");

async function main() {
  // 1. Dapatkan wallet yang melakukan deploy (deployer)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  // 2. Deploy kontrak, dengan memasukkan alamat deployer sebagai argumen 'initialOwner'
  const soulboundIdentity = await hre.ethers.deployContract("SoulboundIdentity", [deployer.address]);

  // Tunggu hingga proses deploy selesai
  await soulboundIdentity.waitForDeployment();

  // 3. Cetak alamat kontrak yang sudah jadi
  console.log(
    `SoulboundIdentity contract deployed to ${soulboundIdentity.target}`
  );
}

// Pola yang direkomendasikan untuk menangani async/await
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});