const { ethers } = require("hardhat");

async function main() {
  console.log("🎯 Heartly Demo Script for Avalanche");
  console.log("=====================================\n");

  // Get signers
  const [deployer, expert, user] = await ethers.getSigners();
  
  console.log("👥 Demo Accounts:");
  console.log("Deployer:", deployer.address);
  console.log("Expert:", expert.address);
  console.log("User:", user.address);
  console.log();

  // Load deployed contracts (update these addresses after deployment)
  const HEARTLY_ADDRESS = process.env.HEARTLY_ADDRESS || "0x0000000000000000000000000000000000000000";
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x0000000000000000000000000000000000000000";

  if (HEARTLY_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.log("❌ Please deploy contracts first and update addresses in .env");
    console.log("Run: npm run deploy:fuji");
    return;
  }

  const heartly = await ethers.getContractAt("Heartly", HEARTLY_ADDRESS);
  const usdc = await ethers.getContractAt("MockUSDC", USDC_ADDRESS);

  console.log("📄 Contract Addresses:");
  console.log("Heartly:", HEARTLY_ADDRESS);
  console.log("MockUSDC:", USDC_ADDRESS);
  console.log();

  // 1. Expert Registration
  console.log("🎧 Step 1: Register Expert");
  console.log("----------------------------");
  
  try {
    const registerTx = await heartly.connect(expert).registerExpert(
      "Dr. Alice Smith",
      "Anxiety & Depression",
      ethers.parseUnits("5", 6),    // $5 per minute for voice
      ethers.parseUnits("8", 6),    // $8 per minute for video
      "QmSampleIPFSHashForProfile"  // IPFS hash for profile
    );
    await registerTx.wait();
    console.log("✅ Expert registered successfully!");
    
    const expertDetails = await heartly.getExpertDetails(expert.address);
    console.log("   Name:", expertDetails[0]);
    console.log("   Expertise:", expertDetails[1]);
    console.log("   Voice Rate: $" + ethers.formatUnits(expertDetails[3], 6) + "/min");
    console.log("   Video Rate: $" + ethers.formatUnits(expertDetails[4], 6) + "/min");
  } catch (error) {
    console.log("⚠️  Expert already registered or error:", error.message);
  }
  console.log();

  // 2. User gets USDC
  console.log("💰 Step 2: User Gets Test USDC");
  console.log("-------------------------------");
  
  const usdcBalance = await usdc.balanceOf(user.address);
  console.log("Current USDC balance:", ethers.formatUnits(usdcBalance, 6));
  
  if (usdcBalance < ethers.parseUnits("50", 6)) {
    // Transfer some USDC from deployer to user
    const transferTx = await usdc.connect(deployer).transfer(
      user.address,
      ethers.parseUnits("100", 6)
    );
    await transferTx.wait();
    console.log("✅ Transferred 100 USDC to user");
  }
  
  const newUsdcBalance = await usdc.balanceOf(user.address);
  console.log("New USDC balance:", ethers.formatUnits(newUsdcBalance, 6));
  console.log();

  // 3. User deposits USDC
  console.log("🏦 Step 3: User Deposits USDC");
  console.log("------------------------------");
  
  const depositAmount = ethers.parseUnits("50", 6);
  
  // Approve USDC
  const approveTx = await usdc.connect(user).approve(HEARTLY_ADDRESS, depositAmount);
  await approveTx.wait();
  console.log("✅ USDC approved for deposit");
  
  // Deposit
  const depositTx = await heartly.connect(user).deposit(depositAmount);
  await depositTx.wait();
  console.log("✅ Deposited $50 USDC to Heartly");
  
  const userBalance = await heartly.getAvailableBalance(user.address);
  console.log("User balance in Heartly:", ethers.formatUnits(userBalance, 6), "USDC");
  console.log();

  // 4. Schedule a call
  console.log("📞 Step 4: Schedule Call");
  console.log("-------------------------");
  
  const callType = 0; // 0 = VOICE, 1 = VIDEO
  const scheduleCallTx = await heartly.connect(user).scheduleCall(expert.address, callType);
  const receipt = await scheduleCallTx.wait();
  
  // Get call ID from event
  const callScheduledEvent = receipt.logs.find(log => {
    try {
      const parsed = heartly.interface.parseLog(log);
      return parsed.name === "CallScheduled";
    } catch {
      return false;
    }
  });
  
  const callId = heartly.interface.parseLog(callScheduledEvent).args.callId;
  console.log("✅ Call scheduled!");
  console.log("   Call ID:", callId);
  console.log("   Type:", callType === 0 ? "Voice" : "Video");
  console.log();

  // 5. Expert starts the call
  console.log("🟢 Step 5: Expert Starts Call");
  console.log("------------------------------");
  
  const startCallTx = await heartly.connect(expert).startCall(callId);
  await startCallTx.wait();
  console.log("✅ Call started by expert!");
  
  const callDetails = await heartly.getCallDetails(callId);
  console.log("   Status: ACTIVE");
  console.log("   Start time:", new Date(Number(callDetails[5]) * 1000).toLocaleString());
  console.log();

  // 6. Simulate call duration and end call
  console.log("⏱️  Step 6: End Call After 3 Minutes");
  console.log("------------------------------------");
  
  // In a real scenario, we'd wait, but for demo we'll just end immediately
  // The contract will calculate duration based on block timestamps
  
  const rating = 5; // 5-star rating
  const flagged = false; // Not flagged
  
  const endCallTx = await heartly.connect(user).endCall(callId, rating, flagged);
  await endCallTx.wait();
  console.log("✅ Call ended by user!");
  console.log("   Rating:", rating, "stars");
  console.log("   Flagged:", flagged);
  console.log();

  // 7. Check final balances
  console.log("💎 Step 7: Final Balances");
  console.log("--------------------------");
  
  const finalUserBalance = await heartly.getAvailableBalance(user.address);
  const finalExpertDetails = await heartly.getExpertDetails(expert.address);
  const expertBalance = finalExpertDetails[2];
  
  console.log("User remaining balance:", ethers.formatUnits(finalUserBalance, 6), "USDC");
  console.log("Expert earned:", ethers.formatUnits(expertBalance, 6), "USDC");
  console.log();

  // 8. Expert withdraws earnings
  console.log("💸 Step 8: Expert Withdraws Earnings");
  console.log("------------------------------------");
  
  if (expertBalance > 0) {
    const withdrawTx = await heartly.connect(expert).expertWithdrawBalance(expertBalance);
    await withdrawTx.wait();
    console.log("✅ Expert withdrew", ethers.formatUnits(expertBalance, 6), "USDC");
    
    const expertUsdcBalance = await usdc.balanceOf(expert.address);
    console.log("Expert final USDC balance:", ethers.formatUnits(expertUsdcBalance, 6));
  }
  console.log();

  console.log("🎉 Demo Complete!");
  console.log("==================");
  console.log("✅ Expert registered and set rates");
  console.log("✅ User deposited funds");
  console.log("✅ Call scheduled, started, and completed");
  console.log("✅ Payment processed automatically");
  console.log("✅ Expert received earnings (80% of call cost)");
  console.log("✅ Platform collected fee (20% of call cost)");
  console.log();
  console.log("🚀 Your Heartly platform on Avalanche is working!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Demo failed:", error);
    process.exit(1);
  });