import { PinataSDK } from "pinata-web3";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: "orange-select-opossum-767.mypinata.cloud",
});
