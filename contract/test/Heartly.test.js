const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Heartly Contract", function () {
  let heartly, mockUSDC;
  let owner, expert, user, otherAccount;
  let deployedHeartly, deployedMockUSDC;

  const INITIAL_BALANCE = ethers.parseUnits("1000", 6); // 1000 USDC
  const VOICE_RATE = ethers.parseUnits("10", 6); // 10 USDC per minute
  const VIDEO_RATE = ethers.parseUnits("15", 6); // 15 USDC per minute

  beforeEach(async function () {
    [owner, expert, user, otherAccount] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    deployedMockUSDC = await MockUSDC.deploy();
    await deployedMockUSDC.waitForDeployment();

    // Deploy Heartly
    const Heartly = await ethers.getContractFactory("Heartly");
    deployedHeartly = await Heartly.deploy(await deployedMockUSDC.getAddress());
    await deployedHeartly.waitForDeployment();

    // Get contract instances
    heartly = deployedHeartly;
    mockUSDC = deployedMockUSDC;

    // Mint USDC to user for testing
    await mockUSDC.mint(user.address, INITIAL_BALANCE);
    await mockUSDC.mint(expert.address, INITIAL_BALANCE);
  });

  describe("Deployment", function () {
    it("Should set the correct USDC address", async function () {
      expect(await heartly.usdc()).to.equal(await mockUSDC.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await heartly.owner()).to.equal(owner.address);
    });
  });

  describe("Expert Registration", function () {
    it("Should allow expert registration with valid parameters", async function () {
      await expect(
        heartly.connect(expert).registerExpert(
          "Dr. Smith",
          "Mental Health",
          VOICE_RATE,
          VIDEO_RATE,
          "QmTestCID123"
        )
      ).to.emit(heartly, "ExpertRegistered")
        .withArgs(expert.address, "Dr. Smith", VOICE_RATE, VIDEO_RATE, "QmTestCID123", "Mental Health");

      const expertData = await heartly.experts(expert.address);
      expect(expertData.isRegistered).to.be.true;
      expect(expertData.name).to.equal("Dr. Smith");
      expect(expertData.expertise).to.equal("Mental Health");
      expect(expertData.voiceRatePerMinute).to.equal(VOICE_RATE);
      expect(expertData.videoRatePerMinute).to.equal(VIDEO_RATE);
    });

    it("Should prevent duplicate expert registration", async function () {
      await heartly.connect(expert).registerExpert(
        "Dr. Smith",
        "Mental Health",
        VOICE_RATE,
        VIDEO_RATE,
        "QmTestCID123"
      );

      await expect(
        heartly.connect(expert).registerExpert(
          "Dr. Smith 2",
          "Mental Health",
          VOICE_RATE,
          VIDEO_RATE,
          "QmTestCID456"
        )
      ).to.be.revertedWith("Expert already registered");
    });

    it("Should reject registration with zero rates", async function () {
      await expect(
        heartly.connect(expert).registerExpert(
          "Dr. Smith",
          "Mental Health",
          0,
          VIDEO_RATE,
          "QmTestCID123"
        )
      ).to.be.revertedWith("Rates must be greater than 0");
    });

    it("Should reject registration with empty name", async function () {
      await expect(
        heartly.connect(expert).registerExpert(
          "",
          "Mental Health",
          VOICE_RATE,
          VIDEO_RATE,
          "QmTestCID123"
        )
      ).to.be.revertedWith("Name cannot be empty");
    });
  });

  describe("User Deposits", function () {
    it("Should allow users to deposit USDC", async function () {
      const depositAmount = ethers.parseUnits("100", 6);
      
      // Approve and deposit
      await mockUSDC.connect(user).approve(await heartly.getAddress(), depositAmount);
      
      await expect(
        heartly.connect(user).deposit(depositAmount)
      ).to.emit(heartly, "Deposited")
        .withArgs(user.address, depositAmount);

      expect(await heartly.userBalances(user.address)).to.equal(depositAmount);
    });

    it("Should reject zero deposits", async function () {
      await expect(
        heartly.connect(user).deposit(0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should reject deposits without sufficient allowance", async function () {
      const depositAmount = ethers.parseUnits("100", 6);
      
      await expect(
        heartly.connect(user).deposit(depositAmount)
      ).to.be.revertedWithCustomError(mockUSDC, "ERC20InsufficientAllowance");
    });
  });

  describe("Call Scheduling", function () {
    beforeEach(async function () {
      // Register expert
      await heartly.connect(expert).registerExpert(
        "Dr. Smith",
        "Mental Health",
        VOICE_RATE,
        VIDEO_RATE,
        "QmTestCID123"
      );

      // User deposits USDC
      const depositAmount = ethers.parseUnits("100", 6);
      await mockUSDC.connect(user).approve(await heartly.getAddress(), depositAmount);
      await heartly.connect(user).deposit(depositAmount);
    });

    it("Should allow call scheduling with sufficient balance", async function () {
      const callType = 0; // VOICE
      
      const tx = await heartly.connect(user).scheduleCall(
        expert.address,
        callType
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return heartly.interface.parseLog(log).name === "CallScheduled";
        } catch (e) {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
    });

    it("Should reject scheduling with unregistered expert", async function () {
      const callType = 0; // VOICE
      
      await expect(
        heartly.connect(user).scheduleCall(
          otherAccount.address,
          callType
        )
      ).to.be.revertedWith("Expert not registered");
    });

    it("Should reject scheduling with insufficient balance", async function () {
      // Withdraw all balance first
      const userBalance = await heartly.userBalances(user.address);
      await heartly.connect(user).withdrawBalance(userBalance);
      
      const callType = 0; // VOICE
      
      await expect(
        heartly.connect(user).scheduleCall(
          expert.address,
          callType
        )
      ).to.be.revertedWith("Insufficient balance. Please deposit more USDC.");
    });
  });

  describe("Call Management", function () {
    let callId;

    beforeEach(async function () {
      // Register expert
      await heartly.connect(expert).registerExpert(
        "Dr. Smith",
        "Mental Health",
        VOICE_RATE,
        VIDEO_RATE,
        "QmTestCID123"
      );

      // User deposits USDC
      const depositAmount = ethers.parseUnits("100", 6);
      await mockUSDC.connect(user).approve(await heartly.getAddress(), depositAmount);
      await heartly.connect(user).deposit(depositAmount);

      // Schedule a call
      const tx = await heartly.connect(user).scheduleCall(
        expert.address,
        0 // VOICE
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsedLog = heartly.interface.parseLog(log);
          return parsedLog.name === "CallScheduled";
        } catch (e) {
          return false;
        }
      });

      callId = event ? heartly.interface.parseLog(event).args[0] : null;
    });

    it("Should allow expert to start a call", async function () {
      await expect(
        heartly.connect(expert).startCall(callId)
      ).to.emit(heartly, "CallStarted");
    });

    it("Should allow expert to end a call with rating", async function () {
      // Start call first
      await heartly.connect(expert).startCall(callId);

      // Fast forward 10 minutes and end call
      await time.increase(600);
      
      await expect(
        heartly.connect(expert).endCall(callId, 5, false) // 5-star rating, not flagged
      ).to.emit(heartly, "CallEnded");
    });

    it("Should allow users to cancel calls", async function () {
      await expect(
        heartly.connect(user).cancelCall(callId)
      ).to.emit(heartly, "CallCancelled");
    });
  });

  describe("Balance Management", function () {
    beforeEach(async function () {
      // User deposits USDC
      const depositAmount = ethers.parseUnits("100", 6);
      await mockUSDC.connect(user).approve(await heartly.getAddress(), depositAmount);
      await heartly.connect(user).deposit(depositAmount);
    });

    it("Should allow users to withdraw their balance", async function () {
      const userBalance = await heartly.userBalances(user.address);
      
      await expect(
        heartly.connect(user).withdrawBalance(userBalance)
      ).to.emit(heartly, "BalanceWithdrawn")
        .withArgs(user.address, userBalance);

      expect(await heartly.userBalances(user.address)).to.equal(0);
    });

    it("Should prevent withdrawal with zero balance", async function () {
      const userBalance = await heartly.userBalances(user.address);
      await heartly.connect(user).withdrawBalance(userBalance); // Withdraw once
      
      await expect(
        heartly.connect(user).withdrawBalance(1)
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Expert Rate Updates", function () {
    beforeEach(async function () {
      await heartly.connect(expert).registerExpert(
        "Dr. Smith",
        "Mental Health",
        VOICE_RATE,
        VIDEO_RATE,
        "QmTestCID123"
      );
    });

    it("Should allow experts to update their rates", async function () {
      const newRate = ethers.parseUnits("20", 6);
      
      await expect(
        heartly.connect(expert).updateCallRates(true, newRate) // Update voice rate
      ).to.emit(heartly, "updatedExpertrates")
        .withArgs(expert.address, true, newRate);

      const expertData = await heartly.experts(expert.address);
      expect(expertData.voiceRatePerMinute).to.equal(newRate);
    });

    it("Should reject rate updates from non-experts", async function () {
      const newRate = ethers.parseUnits("20", 6);
      
      await expect(
        heartly.connect(user).updateCallRates(true, newRate)
      ).to.be.revertedWith("Only registered experts can update rates");
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to withdraw platform balance", async function () {
      // First need to generate some platform fees through completed calls
      // This is a simplified test - in practice fees accumulate through call completions
      
      await expect(
        heartly.connect(owner).platformFeeWithdrawl(0)
      ).to.not.be.reverted; // Should not revert even with zero balance
    });

    it("Should prevent non-owners from withdrawing platform balance", async function () {
      await expect(
        heartly.connect(user).platformFeeWithdrawl(0)
      ).to.be.revertedWithCustomError(heartly, "OwnableUnauthorizedAccount");
    });
  });
});