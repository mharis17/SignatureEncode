import React, { useEffect, useState } from "react";
import Web3 from "web3";
import {
  BrowserRouter as Redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { encrypt } from "@metamask/eth-sig-util";
import { Buffer } from "buffer";
import ContractAbi from "../../abi/contract.abi.json";
import { bufferToHex } from "ethereumjs-util";

const ascii85 = require("ascii85");

function Home() {
  const nav = useNavigate();
  const { state } = useLocation();
  const CONTRACT_ADDRESS = "0x7AEAB6A19125E2C00950102F09479b08E4b71bb9";
  const [Contract, setContract] = useState();
  let PublicKey;
  function logout() {
    state.Token = false;
    window.location.href = "/";
  }
  function Reciever() {
    nav("/reciever");
  }
  const [data1, setData] = useState("null");
  const [data2, setData2] = useState("null");
  const [buffer, setBuffer] = useState(null);
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
      // let price = await ct.methods.price().call();
      // console.log("presale price", price);
      console.log(ct);
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
  async function viewPublicKey() {
    const web3 = window.web3;
    const address = await web3.eth.getAccounts();
    console.log(address[0]);
    PublicKey = await Contract.methods
      .viewPublickEY(address[0].toString())
      .call();
    PublicKey = PublicKey.slice(2); //0x
    PublicKey = Buffer.from(PublicKey, "hex");
    PublicKey = PublicKey.toString("base64");
    console.log(PublicKey);
  }
  async function StoreData(e, data, Raddress) {
    let Raddress_ = document.getElementById("data2").value;

    e.preventDefault();
    await viewPublicKey();
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
    const enc = encrypt({
      publicKey: PublicKey,
      data: ascii85.encode(data).toString(),
      version: "x25519-xsalsa20-poly1305",
    });

    console.log(enc);

    // We want to store the data in smart contract, therefore we concatenate them
    // into single Buffer
    const buf = Buffer.concat([
      Buffer.from(enc.ephemPublicKey, "base64"),
      Buffer.from(enc.nonce, "base64"),
      Buffer.from(enc.ciphertext, "base64"),
    ]);

    console.log(buf);
    console.log(Raddress_);
    const web3 = window.web3;
    const address = await web3.eth.getAccounts();
    await Contract.methods
      .storeData(encryptedMessage, Raddress_)
      .send({ from: address.toString() })
      .catch((err) => console.error);
  }

  return state && state.Token ? (
    <div>
      <div className="flex justify-end m-4">
        <button
          onClick={logout}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Logout
        </button>
      </div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Message form
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            {/* <!-- <div>
        <label className="block text-sm font-medium leading-6 text-gray-900"
          >Sender's address</label
        >
        <div className="mt-2">
          <input
            formControlName="sAddress"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div> --> */}

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Reciever's address
              </label>
              <div className="mt-2">
                <input
                  id="data2"
                  onChange={(e) => setData2(e.target.data2)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Key
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => setData(e.target.data1)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={(e) => {
                  StoreData(e, String(data1), String(data2));
                }}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send
              </button>
            </div>
          </form>
          <div>
            <button
              onClick={Reciever}
              className="flex mt-4 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              GET YOUR MESSAGE FROM HERE
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // <Redirect path="/" element={<Connection />} />
    (window.location.href = "/")
  );
}
export default Home;
