import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import CONTRACT_ABI from "../../abi/contract.abi.json";
import { Buffer } from "buffer";
import { bufferToHex } from "ethereumjs-util";
import { encrypt } from "@metamask/eth-sig-util";

function Connection() {
  const navigate = useNavigate();
  const CONTRACT_ADDRESS = "0x0165f66Ba218fBE1dF3B32242805c43E785A36Ca";
  const [connected, setConnected] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function connect() {
    if (window.ethereum) {
      let m;
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((a) => (m = a[0]));

      window.web3 = new Web3(window.ethereum);
      const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      let registered = await ct.methods.publickeys(m).call();

      if (registered) setRegistered(true);
      setConnected(true);

      // PK
      // window.ethereum
      //   .request({
      //     method: "eth_getEncryptionPublicKey",
      //     params: ["0x79bF221763d63B96f232dC14f64c9de63bB1f895"], // you must have access to the specified account
      //   })
      //   .then((result) => {
      //     console.log(result);
      //   })
      //   .catch((error) => {
      //     if (error.code === 4001) {
      //       // EIP-1193 userRejectedRequest error
      //       console.log("We can't encrypt anything without the key.");
      //     } else {
      //       console.error(error);
      //     }
      //   });
      // return;
      // PK

      // encrypt
      // const encryptedMessage = bufferToHex(
      //   Buffer.from(
      //     JSON.stringify(
      //       encrypt({
      //         publicKey: "j81xUDrfgup64chyXn3v2BP0t7itPYQlHBYXnzqeuwU=",
      //         data: "hello world!",
      //         version: "x25519-xsalsa20-poly1305",
      //       })
      //     ),
      //     "utf8"
      //   )
      // );
      // console.log(encryptedMessage);
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

      // window.web3 = new Web3(window.ethereum);
      // await window.ethereum.enable();
      // const web3 = window.web3;
      // const metamaskAccount = await web3.eth.getAccounts();
      // let chain = await window.ethereum.request({ method: "eth_chainId" });

      // let wallet = {
      //   connectedAccount: metamaskAccount[0],
      //   connected: true,
      //   splittedAccount: splitAccount(metamaskAccount[0]),
      //   chainId: chain,
      // };

      //   signerAddress = metamaskAccount[0];
      //   let token = wallet.connected;
      //   const keyB64 = await window.ethereum.request({
      //     method: "eth_getEncryptionPublicKey",
      //     params: [signerAddress],
      //   });

      //   console.log(keyB64);
      //   publicKey = Buffer.from(keyB64, "base64");

      //   console.log(publicKey);

      //   if (token) {
      //     sendPublicKey();
      //     navigate("/home", { state: { Token: token } });
    }
    // } else {
    //   window.alert(
    //     "Non-Ether Browser detected. You should consider trying Metamask"
    //   );
    // }
  }

  async function registerEvents() {
    window.ethereum.on("accountsChanged", (a) =>
      localStorage.setItem("address", a[0])
    );
  }

  useEffect(() => {
    registerEvents();
  }, []);

  async function registerKey() {
    let m;
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((a) => (m = a[0]));

    window.ethereum
      .request({
        method: "eth_getEncryptionPublicKey",
        params: [m],
      })
      .then(async (result) => {
        window.web3 = new Web3(window.ethereum);
        const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        try {
          await ct.methods.sendPublicKey(result).send({ from: m });
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          alert("You can't receive messages without the public key.");
        } else {
          console.error(error);
        }
      });
  }

  return (
    <div className="md:p-10">
      {!connected ? (
        <>
          <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-gray-900 my-3">
            Click to connect
          </h2>
          <button
            onClick={connect}
            className="flex mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Connect Wallet
          </button>
        </>
      ) : (
        ""
      )}

      {!registered && connected ? (
        <>
          <p className="text-center my-5">
            Register your public key to receive messages on your address.
            <br />
            add check for localStorage address with time expiry
          </p>
          <button
            onClick={() => registerKey()}
            className="flex my-2 mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register Public Key
          </button>
        </>
      ) : (
        ""
      )}

      {connected ? (
        <>
          <button
            onClick={() => navigate("/send")}
            className="flex my-2 mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Send a Message
          </button>
          <button
            onClick={() => navigate("/reciever")}
            className="flex mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            View Received Messages
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export default Connection;
