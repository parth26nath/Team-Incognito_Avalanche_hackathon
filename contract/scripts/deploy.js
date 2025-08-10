const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Heartly contracts to Avalanche...");

  // Get the signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy MockUSDC first
  console.log("\n=== Deploying MockUSDC ===");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("MockUSDC deployed to:", mockUSDCAddress);

  // Deploy Heartly contract
  console.log("\n=== Deploying Heartly ===");
  const Heartly = await ethers.getContractFactory("Heartly");
  const heartly = await Heartly.deploy(mockUSDCAddress);
  await heartly.waitForDeployment();
  const heartlyAddress = await heartly.getAddress();
  console.log("Heartly deployed to:", heartlyAddress);

  // Verify deployment
  console.log("\n=== Verifying Deployment ===");
  const usdcFromContract = await heartly.usdc();
  console.log("USDC address in Heartly contract:", usdcFromContract);
  console.log("MockUSDC address:", mockUSDCAddress);
  console.log("Addresses match:", usdcFromContract === mockUSDCAddress);

  // Print summary
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("MockUSDC:", mockUSDCAddress);
  console.log("Heartly:", heartlyAddress);

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    mockUSDC: mockUSDCAddress,
    heartly: heartlyAddress,
    timestamp: new Date().toISOString(),
  };

  const fs = require('fs');
  fs.writeFileSync(
    `deployments/${(await ethers.provider.getNetwork()).name}-deployment.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n=== Next Steps ===");
  console.log("1. Verify contracts on Snowtrace:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${mockUSDCAddress}`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${heartlyAddress} "${mockUSDCAddress}"`);
  console.log("2. Update frontend configuration with new addresses");
  console.log("3. Update subgraph configuration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });