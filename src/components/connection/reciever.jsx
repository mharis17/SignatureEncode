import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import ContractAbi from "../../abi/contract.abi.json";
import { Buffer } from "buffer";
const ascii85 = require("ascii85");

function Reciever() {
  let message;
  const CONTRACT_ADDRESS = "0x7AEAB6A19125E2C00950102F09479b08E4b71bb9";
  const [Contract, setContract] = useState();
  async function connect() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      const metamaskAccount = await web3.eth.getAccounts();
      let chain = await window.ethereum.request({ method: "eth_chainId" });

      console.log(metamaskAccount);
    } else {
      window.alert(
        "Non-Ether Browser detected. You should consider trying Metamask"
      );
    }
  }
  useEffect(() => {
    connect();
    loadWeb3();
  }, []);
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // await window.ethereum.enable();
      const web3 = window.web3;
      // creating contract instance
      const contractaddress = CONTRACT_ADDRESS;
      const ct = new web3.eth.Contract(ContractAbi, contractaddress);
      setContract(ct);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  async function viewMessage(e) {
    e.preventDefault();
    const web3 = window.web3;
    const address = await web3.eth.getAccounts();
    message = await Contract.methods.viewMessage(address.toString()).call();
    message = message[0];
    console.log(message);
    const structuredData = {
      version: "x25519-xsalsa20-poly1305",
      ephemPublicKey: message.slice(0, 32).toString("base64"),
      nonce: message.slice(32, 56).toString("base64"),
      ciphertext: message.slice(56).toString("base64"),
    };
    console.log(structuredData);
    // Convert data to hex string required by MetaMask
    const ct = `0x${Buffer.from(
      JSON.stringify(structuredData),
      "utf8"
    ).toString("hex")}`;
    // Send request to MetaMask to decrypt the ciphertext
    // Once again application must have acces to the account
    const decrypt = await window.ethereum.request({
      method: "eth_decrypt",
      params: [ct, "0x91836d2F5D47953E366B7E8A9E40184fD6066D17"],
    });
    // Decode the base85 to final bytes
    console.log(ascii85.decode(decrypt));
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Recipients Form
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          {/* <div>
            <div className="flex items-center justify-between">
              <label
                for="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
            </div>
            <div className="mt-2">
              <input
                // formControlName="rAddress"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div> */}

          <div>
            <button
              type="submit"
              onClick={(e) => {
                viewMessage(e);
              }}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send Request
            </button>
          </div>
        </form>
        <div>
          <p className="text-center m-3">Recieved Message: {message} </p>
        </div>
      </div>
    </div>
  );
}
export default Reciever;
