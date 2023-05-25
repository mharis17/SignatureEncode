import React from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { ContractAbi } from "../../abi/contract.abi.json";
import { Buffer } from "buffer";
// require("dotenv").config();
function Connection({ setIsAuthenticated }) {
  const navigate = useNavigate();
  let condition = false;
  let signerAddress;
  async function connect() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      const metamaskAccount = await web3.eth.getAccounts();
      let chain = await window.ethereum.request({ method: "eth_chainId" });

      let wallet = {
        connectedAccount: metamaskAccount[0],
        connected: true,
        splittedAccount: splitAccount(metamaskAccount[0]),
        chainId: chain,
      };

      signerAddress = metamaskAccount[0];
      console.log(signerAddress);
      let token = wallet.connected;
      const keyB64 = await window.ethereum.request({
        method: "eth_getEncryptionPublicKey",
        params: [signerAddress],
      });

      const publicKey = Buffer.from(keyB64.toString(), "base64");
      const publicKey1 = publicKey.toString("base64");

      console.log(publicKey);
      console.log(token);
      console.log(keyB64);
      console.log(typeof publicKey1);
      if (token) {
        navigate("/home", { state: { Token: token, PublicKey: publicKey1 } });
      }
    } else {
      window.alert(
        "Non-Ether Browser detected. You should consider trying Metamask"
      );
    }
  }

  function splitAccount(value) {
    return (
      value.substring(0, 5) +
      "......" +
      value.substring(value.length - 4, value.length)
    ).toString();
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Click to connect
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <button
              onClick={connect}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect Wallet
            </button>
          </div>
          {condition ? (
            <p className="text-center">Connected!</p>
          ) : (
            <p className="text-center">Not Connected!</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Connection;
