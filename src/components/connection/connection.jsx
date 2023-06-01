import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import ContractAbi from "../../abi/contract.abi.json";
import { Buffer } from "buffer";
import { bufferToHex } from "ethereumjs-util";
import { encrypt } from "@metamask/eth-sig-util";

function Connection({ setIsAuthenticated }) {
  const navigate = useNavigate();
  let condition = false;
  let signerAddress;
  let publicKey;
  const CONTRACT_ADDRESS = "0x7AEAB6A19125E2C00950102F09479b08E4b71bb9";
  const [Contract, setContract] = useState();
  async function connect() {
    if (window.ethereum) {
      // PK
      window.ethereum
        .request({
          method: "eth_getEncryptionPublicKey",
          params: [signerAddress], // you must have access to the specified account
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("We can't encrypt anything without the key.");
          } else {
            console.error(error);
          }
        });
      // return;
      // PK

      // encrypt
      const encryptedMessage = bufferToHex(
        Buffer.from(
          JSON.stringify(
            encrypt({
              publicKey: "j81xUDrfgup64chyXn3v2BP0t7itPYQlHBYXnzqeuwU=",
              data: "hello world!",
              version: "x25519-xsalsa20-poly1305",
            })
          ),
          "utf8"
        )
      );
      console.log(encryptedMessage);
      // return;
      // encrypt

      // decrypt
      // window.ethereum
      //   .request({
      //     method: "eth_decrypt",
      //     params: [
      //       "0x7b2276657273696f6e223a227832353531392d7873616c736132302d706f6c7931333035222c226e6f6e6365223a226d716472536d43526c486b574c4c6a42794a63705556622b6367333044546c36222c22657068656d5075626c69634b6579223a225a6942353565694f497a43564e4e65325450366c57356f30547638362b4a364249656c557a5735754e43413d222c2263697068657274657874223a2244774638396c6a35617866774d455a633264364138686d6c64615336713365346b78426939673d3d227d",
      //       "0x91836d2F5D47953E366B7E8A9E40184fD6066D17",
      //     ],
      //   })
      //   .then((decryptedMessage) =>
      //     console.log("The decrypted message is:", decryptedMessage)
      //   )
      //   .catch((error) => console.log(error.message));

      // decrypt

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
      let token = wallet.connected;
      const keyB64 = await window.ethereum.request({
        method: "eth_getEncryptionPublicKey",
        params: [signerAddress],
      });

      console.log(keyB64);
      publicKey = Buffer.from(keyB64, "base64");

      console.log(publicKey);

      if (token) {
        sendPublicKey();
        navigate("/home", { state: { Token: token } });
      }
    } else {
      window.alert(
        "Non-Ether Browser detected. You should consider trying Metamask"
      );
    }
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

  async function sendPublicKey() {
    const web3 = window.web3;
    const address = await web3.eth.getAccounts();
    await Contract.methods
      .sendPublicKey(publicKey)
      .send({ from: address.toString() })
      .catch((err) => console.error);
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
