import React from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
// import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import abi from "./contract.abi.json";
// import * as ascii85 from "ascii85";
const { REACT_APP_CONTRACT_ADDRESS } = process.env;

function Reciever() {
  const [recieverAddress, setRecieverAddress] = useState("");
  const [senderPubKey, setSenderPubKey] = useState("");
  const [contract, setContract] = useState(null);

  let condition = false;
  let signerAddress;
  let newreceiverAddress;
  let publicKey;

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

      const account = signerAddress;

      // console.log(publicKey);

      // if (token) {
      // navigate("/home", { state: { Token: token } });
      // }
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

  async function ExtractPubKey(event) {
    event.preventDefault();
    // const web3 = window.web3;
    // const address = await web3.eth.getAccounts();
    // console.log(address, "new");
    console.log(recieverAddress, "new1");
    const senderPubKey1 = await contract.methods
      .viewPublickEY(recieverAddress.toString())
      .call()
      .catch((err) => console.error);
    console.log(senderPubKey1, "public key");
    setSenderPubKey(senderPubKey1);
    console.log(senderPubKey, "new sender");
  }

  const handleChange = (event) => {
    setRecieverAddress(event.target.value); // Update the state variable on text field
    console.log(recieverAddress);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    newreceiverAddress = recieverAddress;
    console.log(recieverAddress); // Use the variable wherever needed (in this case, logging to the console)
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Recipients Form
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
            </div>
            <div className="mt-2">
              <input
                // formControlName="rAddress"
                required
                value={recieverAddress}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={async (e) => {
                // await connect();
                // handleSubmit();
                await ExtractPubKey(e);
              }}
            >
              Send Request
            </button>
          </div>
        </form>
        <div>
          <p className="text-center m-3">Recieved Message: message </p>
        </div>
      </div>
    </div>
  );
}

export default Reciever;
