import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  BalanceWithdrawn as BalanceWithdrawnEvent,
  CallCancelled as CallCancelledEvent,
  CallEnded as CallEndedEvent,
  CallScheduled as CallScheduledEvent,
  CallStarted as CallStartedEvent,
  Deposited as DepositedEvent,
  ExpertBalanceWithdrawn as ExpertBalanceWithdrawnEvent,
  ExpertRegistered as ExpertRegisteredEvent,
  PlatformBalanceWithdrawn as PlatformBalanceWithdrawnEvent,
  updatedExpertrates as updatedExpertratesEvent,
  CallHold as CallHoldEvent,
} from "../generated/heartly/heartly";

import {
  Call,
  User,
  Expert,
  Deposit,
  Withdrawal,
  Platform,
} from "../generated/schema";

export function handleBalanceWithdrawn(event: BalanceWithdrawnEvent): void {
  log.info("Balance Withdrawn: {}", [event.params.amount.toString()]);
  let user = User.load(event.params.user.toHexString());
  if (user != null) {
    let withdrawal = new Withdrawal(event.transaction.hash.toHexString());
    withdrawal.amount = event.params.amount;
    withdrawal.timestamp = event.block.timestamp;
    withdrawal.user = user.id;
    withdrawal.save();
    user.balance = user.balance.minus(event.params.amount);
    user.save();
  }
}

export function handleCallCancelled(event: CallCancelledEvent): void {
  log.info("Call Cancelled: {}", [event.params.callId.toHexString()]);
  let call = Call.load(event.params.callId.toHexString());
  if (call != null) {
    call.status = "CANCELLED";
    call.save();
  }
}

export function handleCallEnded(event: CallEndedEvent): void {
  log.info("Call Ended: {}", [event.params.callId.toHexString()]);
  let call = Call.load(event.params.callId.toHexString());
  if (call != null) {
    call.status = "ENDED";
    call.actualDuration = event.params.duration;
    call.amountPaid = event.params.amount;
    call.endTime = event.block.timestamp;
    call.rating = event.params.rating;

    let expert = Expert.load(call.expert);
    if (expert != null) {
      let platform = Platform.load("1");
      if (platform == null) {
        platform = new Platform("1");
        platform.totalFeesCollected = BigInt.fromI32(0);
        platform.save();
      }
      const platformFee = BigInt.fromI32(20)
        .times(event.params.amount)
        .div(BigInt.fromI32(100));
      platform.totalFeesCollected =
        platform.totalFeesCollected.plus(platformFee);
      expert.balance = expert.balance.plus(
        event.params.amount.minus(platformFee)
      );
      call.platformFee = platformFee;
      if (event.params.rating > BigInt.fromI32(0)) {
        expert.rating = expert.rating
          .plus(event.params.rating)
          .div(BigInt.fromI32(2));
      }
      if (event.params.flag) {
        call.flag = true;
        expert.flags = expert.flags.plus(BigInt.fromI32(1));
      }
      if (event.params.amount < call.stakedAmount) {
        let user = User.load(call.user);
        if (user != null) {
          user.balance = user.balance.plus(
            call.stakedAmount.minus(event.params.amount)
          );
          user.save();
        }
      }
      
      expert.save();
      call.save();
      platform.save();
    }
  }
}

export function handleCallScheduled(event: CallScheduledEvent): void {
  log.info("Call Scheduled: {}", [event.params.callId.toHexString()]);
  let user = User.load(event.params.user.toHexString());
  let expert = Expert.load(event.params.expert.toHexString());

  if (user !== null && expert !== null) {
    let call = new Call(event.params.callId.toHexString());
    call.user = user.id;
    call.callType = event.params.callType == 1 ? "VIDEO" : "VOICE";
    call.expert = expert.id;
    call.stakedAmount = event.params.stakedAmount;
    call.scheduledAt = event.block.timestamp;
    call.status = "SCHEDULED";
    call.save();
  }
}

export function handleCallStarted(event: CallStartedEvent): void {
  log.info("Call Started: {}", [event.params.callId.toHexString()]);
  let call = Call.load(event.params.callId.toHexString());
  if (call != null) {
    call.status = "STARTED";
    call.startTime = event.params.startTime;
    let user = User.load(call.user);
    if (user != null) {
      user.balance = user.balance.minus(call.stakedAmount);
      user.save();
    }
    call.save();
  }
}

export function handleCallHold(event: CallHoldEvent): void {
  log.info("Call Hold: {}", [event.params.callId.toHexString()]);
  let call = Call.load(event.params.callId.toHexString());
  if (call != null) {
    call.status = "HOLD";
    call.endTime = event.block.timestamp;
    call.save();
  }
}

export function handleDeposited(event: DepositedEvent): void {
  log.info("Deposited: {}", [event.params.amount.toString()]);
  let user = User.load(event.params.user.toHexString());
  if (user == null) {
    user = new User(event.params.user.toHexString());
    user.balance = BigInt.fromI32(0);
    user.save();
  }
  let deposit = new Deposit(event.transaction.hash.toHexString());
  deposit.amount = event.params.amount;
  deposit.timestamp = event.block.timestamp;
  user.balance = user.balance.plus(event.params.amount);
  deposit.user = user.id;
  deposit.save();
  user.save();
}

export function handleExpertBalanceWithdrawn(
  event: ExpertBalanceWithdrawnEvent
): void {
  log.info("Expert Balance Withdrawn: {}", [event.params.amount.toString()]);
  let expert = Expert.load(event.params.user.toHexString());
  if (expert != null) {
    let withdrawal = new Withdrawal(event.transaction.hash.toHexString());
    withdrawal.amount = event.params.amount;
    withdrawal.timestamp = event.block.timestamp;
    withdrawal.expert = expert.id;
    withdrawal.save();
    expert.balance = expert.balance.minus(event.params.amount);
    expert.save();
  }
}

export function handleExpertRegistered(event: ExpertRegisteredEvent): void {
  log.info("Expert Registered: {}", [event.params.expert.toHexString()]);
  let entity = new Expert(event.params.expert.toHexString());
  entity.name = event.params.name;
  entity.videoRatePerMinute = event.params.videoRate;
  entity.voiceRatePerMinute = event.params.voiceRate;
  entity.balance = BigInt.fromI32(0);
  entity.isRegistered = true;
  entity.expertise = event.params.expertise;
  entity.rating = BigInt.fromI32(0);
  entity.cid = event.params.cid;
  entity.flags = BigInt.fromI32(0);
  entity.save();
}

export function handlePlatformBalanceWithdrawn(
  event: PlatformBalanceWithdrawnEvent
): void {
  log.info("Platform Balance Withdrawn: {}", [event.params.amount.toString()]);
  let platform = Platform.load("1");
  if (platform == null) {
    platform = new Platform("1");
    platform.totalFeesCollected = BigInt.fromI32(0);
    platform.save();
  }
  let withdrawal = new Withdrawal(event.transaction.hash.toHexString());
  withdrawal.amount = event.params.amount;
  withdrawal.timestamp = event.block.timestamp;
  withdrawal.platform = platform.id;
  withdrawal.save();
}

export function handleupdatedExpertrates(event: updatedExpertratesEvent): void {
  let expert = Expert.load(event.params.user.toHexString());
  if (expert != null) {
    if (event.params.isVoice) {
      expert.voiceRatePerMinute = event.params.updatedRate;
    } else {
      expert.videoRatePerMinute = event.params.updatedRate;
    }
    expert.save();
  }
}
