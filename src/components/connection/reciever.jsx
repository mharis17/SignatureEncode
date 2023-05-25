import React from "react";
import { useLocation } from "react-router-dom";
import { Buffer } from "buffer";

const ascii85 = require("ascii85");

function Reciever() {
  const { state } = useLocation();
  let message;

  async function decryptData(account, data) {
    // Reconstructing the original object outputed by encryption
    console.log(data);
    console.log(account);
    const structuredData = {
      version: "x25519-xsalsa20-poly1305",
      ephemPublicKey: data.slice(0, 32).toString("base64"),
      nonce: data.slice(32, 56).toString("base64"),
      ciphertext: data.slice(56).toString("base64"),
    };
    // Convert data to hex string required by MetaMask

    const ct = `0x${Buffer.from(
      JSON.stringify(structuredData),
      "utf8"
    ).toString("hex")}`;

    // Send request to MetaMask to decrypt the ciphertext
    // Once again application must have acces to the account
    const decrypt = await window.ethereum.request({
      method: "eth_decrypt",
      params: [ct, account],
    });

    // Decode the base85 to final bytes
    console.log(ascii85.decode(decrypt));
    // Decode the base85 to final bytes
  }

  console.log(typeof state.Buffer);
  console.log(
    decryptData("0x91836d2F5D47953E366B7E8A9E40184fD6066D17", state.Buffer)
  );
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
          </div>

          <div>
            <button
              type="submit"
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
