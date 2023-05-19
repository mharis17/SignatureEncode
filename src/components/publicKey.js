import React, { useEffect } from "react";
import web3 from "web3";
// import * as ascii85 from "ascii85";

// Account is account address provided as string
// App must have access to the specified account
// const account = "0xd2B774273DCAB65717a3fFAe32AC8fcC23E876c7";
const account = "0xd2B774273DCAB65717a3fFAe32AC8fcC23E876c7";

// const encodedString = ascii85.encode("Hello, world!");
// console.log(encodedString, "h");

function SigSecret() {
  async function init() {
    // Key is returned as base64
    const keyB64 = await window?.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [account],
    });
    console.log(keyB64);
    const publicKey = Buffer.from(keyB64, "base64");

    console.log(publicKey, "public");
  }

  init();
}
export default SigSecret;
