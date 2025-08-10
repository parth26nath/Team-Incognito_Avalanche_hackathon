const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Starting comprehensive deployment and setup for Avalanche...");

  // Get the signers
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "AVAX");

  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());

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

  // Get current block number for subgraph
  const currentBlock = await ethers.provider.getBlockNumber();
  console.log("Current block number:", currentBlock);

  // Create deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    contracts: {
      MockUSDC: {
        address: mockUSDCAddress,
        blockNumber: currentBlock
      },
      Heartly: {
        address: heartlyAddress,
        blockNumber: currentBlock
      }
    },
    timestamp: new Date().toISOString(),
    subgraphStartBlock: currentBlock - 10 // Start a few blocks before deployment for safety
  };

  // Ensure deployments directory exists
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${network.name}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  // Update subgraph configuration
  const subgraphDir = path.join(__dirname, '..', '..', 'subgraph-avalanche-fuji');
  const subgraphFile = path.join(subgraphDir, 'subgraph.yaml');
  
  if (fs.existsSync(subgraphFile)) {
    console.log("\n=== Updating Subgraph Configuration ===");
    let subgraphContent = fs.readFileSync(subgraphFile, 'utf8');
    
    // Update contract address and start block
    subgraphContent = subgraphContent.replace(
      /address: "0x0000000000000000000000000000000000000000"/,
      `address: "${heartlyAddress}"`
    );
    subgraphContent = subgraphContent.replace(
      /startBlock: 1/,
      `startBlock: ${deploymentInfo.subgraphStartBlock}`
    );
    
    fs.writeFileSync(subgraphFile, subgraphContent);
    console.log("✅ Subgraph configuration updated");
  }

  // Update frontend environment files
  console.log("\n=== Updating Frontend Configurations ===");
  
  const frontendProjects = [
    { name: "Web", path: path.join(__dirname, '..', '..', 'Web') },
    { name: "Heartly landing", path: path.join(__dirname, '..', '..', 'Heartly landing') }
  ];

  frontendProjects.forEach(project => {
    const envFile = path.join(project.path, '.env');
    const envTemplateFile = path.join(project.path, 'env.template');
    const productionEnvFile = path.join(project.path, 'production.env');
    
    // Update template file
    if (fs.existsSync(envTemplateFile)) {
      let envContent = fs.readFileSync(envTemplateFile, 'utf8');
      
      if (project.name === "Web") {
        envContent = envContent.replace(
          /NEXT_PUBLIC_HEARTLY_CONTRACT_ADDRESS=/,
          `NEXT_PUBLIC_HEARTLY_CONTRACT_ADDRESS=${heartlyAddress}`
        );
        envContent = envContent.replace(
          /NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=/,
          `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=${mockUSDCAddress}`
        );
      } else {
        envContent = envContent.replace(
          /REACT_APP_HEARTLY_CONTRACT_ADDRESS=/,
          `REACT_APP_HEARTLY_CONTRACT_ADDRESS=${heartlyAddress}`
        );
        envContent = envContent.replace(
          /REACT_APP_USDC_CONTRACT_ADDRESS=/,
          `REACT_APP_USDC_CONTRACT_ADDRESS=${mockUSDCAddress}`
        );
      }
      
      // Write to .env file (you'll need to manually copy other values from template)
      fs.writeFileSync(envFile, envContent);
      console.log(`✅ Updated ${project.name} environment template`);
    }

    // Update production environment file if it exists
    if (fs.existsSync(productionEnvFile)) {
      let prodEnvContent = fs.readFileSync(productionEnvFile, 'utf8');
      
      if (project.name === "Web") {
        prodEnvContent = prodEnvContent.replace(
          /NEXT_PUBLIC_HEARTLY_CONTRACT_ADDRESS=/,
          `NEXT_PUBLIC_HEARTLY_CONTRACT_ADDRESS=${heartlyAddress}`
        );
        prodEnvContent = prodEnvContent.replace(
          /NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=/,
          `NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=${mockUSDCAddress}`
        );
      } else {
        prodEnvContent = prodEnvContent.replace(
          /REACT_APP_HEARTLY_CONTRACT_ADDRESS=/,
          `REACT_APP_HEARTLY_CONTRACT_ADDRESS=${heartlyAddress}`
        );
        prodEnvContent = prodEnvContent.replace(
          /REACT_APP_USDC_CONTRACT_ADDRESS=/,
          `REACT_APP_USDC_CONTRACT_ADDRESS=${mockUSDCAddress}`
        );
      }
      
      fs.writeFileSync(productionEnvFile, prodEnvContent);
      console.log(`✅ Updated ${project.name} production environment configuration`);
    }
  });

  // Copy Heartly ABI to subgraph
  const heartlyArtifact = path.join(__dirname, '..', 'artifacts', 'contracts', 'Heartly.sol', 'Heartly.json');
  const subgraphAbiFile = path.join(subgraphDir, 'abis', 'heartly.json');
  
  if (fs.existsSync(heartlyArtifact) && fs.existsSync(path.dirname(subgraphAbiFile))) {
    const artifact = JSON.parse(fs.readFileSync(heartlyArtifact, 'utf8'));
    fs.writeFileSync(subgraphAbiFile, JSON.stringify(artifact.abi, null, 2));
    console.log("✅ Updated subgraph ABI");
  }

  // Print summary
  console.log("\n=== 🎉 Deployment Summary ===");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("MockUSDC:", mockUSDCAddress);
  console.log("Heartly:", heartlyAddress);
  console.log("Start Block:", deploymentInfo.subgraphStartBlock);

  console.log("\n=== 📋 Next Steps ===");
  console.log("1. Copy and configure environment files:");
  console.log("   - Copy contract/env.template to contract/.env and fill in your private key");
  console.log("   - Copy Web/env.template to Web/.env and configure API keys");
  console.log("   - Copy Heartly-api-main/env.template to Heartly-api-main/.env and configure database");
  console.log("   - Copy 'Heartly landing/env.template' to 'Heartly landing/.env'");
  
  console.log("\n2. Verify contracts on Snowtrace:");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${mockUSDCAddress}`);
  console.log(`   npx hardhat verify --network ${hre.network.name} ${heartlyAddress} "${mockUSDCAddress}"`);
  
  console.log("\n3. Deploy subgraph:");
  console.log("   cd subgraph-avalanche-fuji");
  console.log("   npm run codegen");
  console.log("   npm run build");
  console.log("   npm run deploy");
  
  console.log("\n4. Start the services:");
  console.log("   - Backend: cd Heartly-api-main && npm run dev");
  console.log("   - Frontend: cd Web && npm run dev");
  console.log("   - Test Frontend: cd 'Heartly landing' && npm run dev");

  console.log("\n✅ All configurations updated automatically!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });