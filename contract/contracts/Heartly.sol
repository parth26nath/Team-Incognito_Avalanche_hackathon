// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Heartly is ReentrancyGuard,Ownable {
    IERC20 public usdc;
    
    enum CallType { VOICE, VIDEO }
    enum CallStatus { SCHEDULED, ACTIVE, COMPLETED , CANCELLED , HOLD}

      uint256 private constant MAX_CALL_DURATION = 60;
      uint256 private constant CALL_START_WINDOW = 180;
    
     uint256 private  platformBalance = 0 ;
    struct Expert {
        address payable walletAddress;
        string name;
        string expertise;
        uint256 balance;
        uint256 voiceRatePerMinute;  // in USDC (6 decimals)
        uint256 videoRatePerMinute;  // in USDC (6 decimals)
        string cid;
        bool isRegistered;
    }
    
    struct Call {
        bytes32 callId;
        address user;
        address expert;
        CallType callType;
        CallStatus status;
        uint256 stakedAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 scheduledAt;
        uint256 rating;
        uint256 flagged;
    }
    
    mapping(address => Expert) public experts;
    mapping(address => uint256) public userBalances;
    mapping(bytes32 => Call) public calls;
    mapping(address => bytes32[]) public userCalls;     // Store user's call IDs
    mapping(address => bytes32[]) public expertCalls;   // Store expert's call IDs
    
    event ExpertRegistered(address indexed expert, string name, uint256 voiceRate, uint256 videoRate , string cid , string expertise);
    event Deposited(address indexed user, uint256 amount);
    event CallScheduled(bytes32 indexed callId, address indexed user, address indexed expert, CallType callType, uint256 stakedAmount);
    event CallStarted(bytes32 indexed callId, address indexed user, address indexed expert, uint256 startTime);
    event CallEnded(bytes32 indexed callId, address indexed user, address indexed expert, uint256 duration, uint256 amount , uint256 rating , bool flag) ;
    event updatedExpertrates(address indexed user , bool isVoice , uint256 updatedRate);
    event BalanceWithdrawn(address indexed user, uint256 amount);
    event ExpertBalanceWithdrawn(address indexed user, uint256 amount);    
    event PlatformBalanceWithdrawn(address indexed user, uint256 amount);
     event CallCancelled(bytes32 indexed callId);
     event CallHold(bytes32 indexed callId);

    constructor(address _usdcAddress) Ownable(msg.sender) {
        require(_usdcAddress != address(0), "Invalid USDC address");
        usdc = IERC20(_usdcAddress);
    }
    
    // Generate unique call ID
    function generateCallId(address user, address expert, uint256 timestamp) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(user, expert, timestamp));
    }
    
    // Deposit USDC to contract
    function deposit(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(usdc.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");
        userBalances[msg.sender] += _amount;
        
        emit Deposited(msg.sender, _amount);
    }
    
    
    // Expert registration with separate rates for voice and video
    function registerExpert(
        string memory _name,
        string memory _expertise,
        uint256 _voiceRatePerMinute,
        uint256 _videoRatePerMinute,
        string memory _cid
    ) external {
        require(!experts[msg.sender].isRegistered, "Expert already registered");
        require(_voiceRatePerMinute > 0 && _videoRatePerMinute > 0, "Rates must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty"); 
        
        experts[msg.sender] = Expert({
            walletAddress: payable(msg.sender),
            name: _name,
            expertise: _expertise,
            balance: 0,
            cid:_cid,
            voiceRatePerMinute: _voiceRatePerMinute,
            videoRatePerMinute: _videoRatePerMinute,
            isRegistered: true
        });
        
        emit ExpertRegistered(msg.sender, _name, _voiceRatePerMinute, _videoRatePerMinute , _cid , _expertise);
    }
    
    // Get rate for specific call type
    function getExpertRate(address _expert, CallType _callType) public view returns (uint256) {
        Expert memory expert = experts[_expert];
        return _callType == CallType.VOICE ? expert.voiceRatePerMinute : expert.videoRatePerMinute;
    }
    
    // Schedule a call
    function scheduleCall(address _expert, CallType _callType) external nonReentrant returns (bytes32) {
        require(experts[_expert].isRegistered, "Expert not registered");
         require(_expert != msg.sender, "Cannot schedule call with yourself"); 
        
        uint256 ratePerMinute = getExpertRate(_expert, _callType);

        // Should have balance atleast for 2 mins of call        
        require(userBalances[msg.sender] >= ratePerMinute*2, "Insufficient balance. Please deposit more USDC.");
        
        uint256 totalCost = userBalances[msg.sender];
        
        bytes32 callId = generateCallId(msg.sender, _expert, block.timestamp);
        
        Call memory newCall = Call({
            callId: callId,
            user: msg.sender,
            expert: _expert,
            callType: _callType,
            status: CallStatus.SCHEDULED,
            stakedAmount: totalCost,
            startTime: 0,
            endTime: 0,
            scheduledAt: block.timestamp,
            rating : 0,
            flagged : 0
        });
        
        calls[callId] = newCall;
        userCalls[msg.sender].push(callId);
        expertCalls[_expert].push(callId);
        
        emit CallScheduled(callId, msg.sender, _expert, _callType, totalCost);
        return callId;
    }

        function cancelCall(bytes32 _callId) external nonReentrant {
        Call storage call = calls[_callId];
        require(call.user == msg.sender || call.expert == msg.sender, "Unauthorized");
        require(call.status == CallStatus.SCHEDULED, "Call cannot be cancelled");
        
        call.status = CallStatus.CANCELLED;
        emit CallCancelled(_callId);
    }
    
    // Start a call
    function startCall(bytes32 _callId) external {
        Call storage call = calls[_callId];
        require(call.user != address(0), "Call does not exist");
        require( msg.sender == call.expert, "Only Expert can call this");
        require(call.status == CallStatus.SCHEDULED, "Call already started or completed");
         require(block.timestamp <= call.scheduledAt + CALL_START_WINDOW , "Call start window expired");
        
        call.startTime = block.timestamp;
        call.status = CallStatus.ACTIVE;
        userBalances[call.user] = 0;
        
        emit CallStarted(_callId, call.user, call.expert, call.startTime);
    }
    
    // End a call and process payment
    function endCall(bytes32 _callId , uint256 _rating , bool flag) external nonReentrant {
        Call storage call = calls[_callId];
        require(call.user != address(0), "Call does not exist");
        require(msg.sender == call.user || msg.sender == call.expert, "Unauthorized");
        require(call.status == CallStatus.ACTIVE || call.status == CallStatus.HOLD , "Call not active or already completed");
        if(call.status == CallStatus.ACTIVE){
            call.endTime = block.timestamp;
        }
       uint256 duration = (call.endTime - call.startTime + 59) / 60;
        uint256 ratePerMinute = getExpertRate(call.expert, call.callType);
        uint256 actualCost = ratePerMinute * duration;


        if (actualCost > call.stakedAmount) {
            actualCost = call.stakedAmount;
        }

        
        // 20% to platform
        uint256 platformFee = (actualCost *20) / 100 ;
        platformBalance +=platformFee;

        // Add to expert's balance
        Expert storage expert = experts[call.expert];
        expert.balance += (actualCost-platformFee);

  
        
        // Return unused amount to user balance
        uint256 remainingAmount = call.stakedAmount - actualCost;
        if (remainingAmount > 0) {
            userBalances[call.user] += remainingAmount;
        }
        
        call.status = CallStatus.COMPLETED;
        if(duration > 5){
            call.rating = _rating;
        }else{
            call.rating = 0;
        }

        if(flag){
            call.flagged ++;
        }
        
        emit CallEnded(_callId, call.user, call.expert, duration, actualCost , call.rating , flag);
    }

    
    // Get user's calls
    function getUserCalls(address _user) external view returns (bytes32[] memory) {
        return userCalls[_user];
    }
    
    // Get expert's calls
    function getExpertCalls(address _expert) external view returns (bytes32[] memory) {
        return expertCalls[_expert];
    }
    
    // Get call details
    function getCallDetails(bytes32 _callId) external view returns (
        address user,
        address expert,
        CallType callType,
        CallStatus status,
        uint256 stakedAmount,
        uint256 startTime,
        uint256 endTime
    ) {
        Call memory call = calls[_callId];
        require(call.user != address(0), "Call does not exist");
        return (
            call.user,
            call.expert,
            call.callType,
            call.status,
            call.stakedAmount,
            call.startTime,
            call.endTime
        );
    }
    
    // Get available balance
    function getAvailableBalance(address _user) external view returns (uint256) {
        return userBalances[_user];
    }
    
    // Withdraw remaining balance
    function withdrawBalance(uint256 _amount) external nonReentrant {
        require(userBalances[msg.sender] >= _amount, "Insufficient balance");
        
        userBalances[msg.sender] -= _amount;
        require(usdc.transfer(msg.sender, _amount), "Transfer failed");
        
        emit BalanceWithdrawn(msg.sender, _amount);
    }

    // Withdraw Expert balance
    function expertWithdrawBalance(uint256 _amount) external nonReentrant {
        require(experts[msg.sender].isRegistered, "Caller is not a registered expert");
        require(experts[msg.sender].balance >= _amount, "Not enough balance to withdraw");

        experts[msg.sender].balance -= _amount;
        require(usdc.transfer(msg.sender, _amount), "Transfer failed");

        emit ExpertBalanceWithdrawn(msg.sender, _amount);
    }

    // Platform Fee withdrawl 
    function platformFeeWithdrawl (uint256 _amount) external nonReentrant onlyOwner {
        require(platformBalance >= _amount , "Insufficient Balance");
        platformBalance-=_amount;
        require(usdc.transfer(msg.sender,_amount));
        emit PlatformBalanceWithdrawn(msg.sender, _amount);
    }
    
    // Get expert details
    function getExpertDetails(address _expert) external view returns (
        string memory name,
        string memory expertise,
        uint256 balance,
        uint256 voiceRatePerMinute,
        uint256 videoRatePerMinute,
        bool isRegistered
    ) {
        Expert memory expert = experts[_expert];
        return (
            expert.name,
            expert.expertise,
            expert.balance,
            expert.voiceRatePerMinute,
            expert.videoRatePerMinute,
            expert.isRegistered
        );
    }

    function updateCallRates(bool isVoice , uint256 updatedRate) external {
        require(experts[msg.sender].isRegistered, "Only registered experts can update rates");
        Expert storage expert = experts[msg.sender];
        if(isVoice){
            expert.voiceRatePerMinute = updatedRate;
        }else{
            expert.videoRatePerMinute = updatedRate;
        }
        emit updatedExpertrates(msg.sender, isVoice, updatedRate);
    }

    function callHold(bytes32 _callId) external onlyOwner{
        Call storage call = calls[_callId];
        require(call.status == CallStatus.ACTIVE, "Call not active or already completed");
        call.status = CallStatus.HOLD;
        call.endTime = block.timestamp;
        emit CallHold(_callId);
    }
}