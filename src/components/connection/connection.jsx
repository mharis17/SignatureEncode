import React from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import abi from "./contract.abi.json";
// require("dotenv").config();
const { REACT_APP_CONTRACT_ADDRESS } = process.env;

function Connection({ setIsAuthenticated }) {
  const [connectedAccount, setConnectedAccount] = useState("Connect Wallet");
  const [contract, setContract] = useState(null);

  const navigate = useNavigate();

  let condition = false;
  let signerAddress;
  let publicKey;
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
      // console.log(signerAddress, "MAINsigner");
      let token = wallet.connected;
      console.log(token);

      //  const account = signerAddress;

      // // Key is returned as base64
      // const keyB64 = await window.ethereum
      //   .request({
      //     method: "eth_getEncryptionPublicKey",
      //     params: [signerAddress],
      //   })
      //   .catch((err) => console.error);
      // console.log(keyB64, "key");
      // // const publicKey = Buffer.from(keyB64, "base64");
      // publicKey = Buffer.from(keyB64, "base64");

      // console.log(publicKey);

      if (token) {
        // navigate("/home", { state: { Token: token } });
        // Key is returned as base64
        const keyB64 = await window.ethereum
          .request({
            method: "eth_getEncryptionPublicKey",
            params: [signerAddress],
          })
          .catch((err) => console.error);
        console.log(keyB64, "key");
        // const publicKey = Buffer.from(keyB64, "base64");
        publicKey = Buffer.from(keyB64, "base64");

        console.log(publicKey);
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

  useEffect(() => {
    loadWeb3();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // await window.ethereum.enable();
      const web3 = window.web3;
      // creating contract instance
      const contractaddress = REACT_APP_CONTRACT_ADDRESS;
      console.log("ct", contractaddress);
      const ct = new web3.eth.Contract(abi, contractaddress);
      console.log("ct", ct);
      // let price = await ct.methods.price().call();
      // console.log("presale price", price);
      setContract(ct);
      // setPrice(price);
      // setPriceInEth(web3.utils.fromWei(price, "ether"));

      //getting total minted nft
      // const totalSupply = await ct.methods.totalSupply().call();
      // setTokenSupply(totalSupply);

      // // getting total number of nft from contract
      // const maxxSupply = await ct.methods.maxSupply().call();
      // setMaxxSupply(maxxSupply);
      // console.log(maxxSupply, "snds");
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async function sendPublicKey() {
    const web3 = window.web3;
    // const _value = price * quantity;
    const address = await web3.eth.getAccounts();

    // await contract.methods.mint(quantity).send({ from: address.toString() });
    await contract.methods
      .sendPublicKey(publicKey)
      .send({ from: address.toString() })
      .catch((err) => console.error);

    // // setMinted(true);
    // const senderPubKey = await contract.methods.viewPublicKEY(address).call();
    // // setTokenSupply(totalSupply);
    // console.log(senderPubKey, "sending public key");
  }

  async function ExtractPubKey() {
    const web3 = window.web3;
    const address = await web3.eth.getAccounts();
    const senderPubKey = await contract.methods
      .viewPublickEY(address.toString())
      .call()
      .catch((err) => console.error);

    console.log(senderPubKey, "public key");
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
            {/* <button
              onClick={connect}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect Wallet
            </button> */}
            <button
              onClick={async () => {
                await connect();
                sendPublicKey();
              }}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              send public
            </button>

            <button
              onClick={ExtractPubKey}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Viewpublic
            </button>
            {/* <button
              onClick={ExtractPubKey}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              new button
            </button> */}
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
