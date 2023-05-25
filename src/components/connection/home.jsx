import React, { useState } from "react";
import {
  BrowserRouter as Redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { encrypt } from "@metamask/eth-sig-util";
import { Buffer } from "buffer";

const ascii85 = require("ascii85");

function Home() {
  const nav = useNavigate();
  const { state } = useLocation();
  function logout() {
    state.Token = false;
    window.location.href = "/";
  }
  function Reciever() {
    nav("/reciever", { state: { Buffer: buffer } });
  }
  const [data1, setData] = useState("null");
  const [buffer, setBuffer] = useState(null);

  console.log(state.PublicKey);
  function encryptData(data) {
    // Returned object contains 4 properties: version, ephemPublicKey, nonce, ciphertext
    // Each contains data encoded using base64, version is always the same string
    const enc = encrypt({
      publicKey: state.PublicKey.toString("base64"),
      data: ascii85.encode(data).toString(),
      version: "x25519-xsalsa20-poly1305",
    });

    // We want to store the data in smart contract, therefore we concatenate them
    // into single Buffer
    const buf = Buffer.concat([
      Buffer.from(enc.ephemPublicKey, "base64"),
      Buffer.from(enc.nonce, "base64"),
      Buffer.from(enc.ciphertext, "base64"),
    ]);

    // In smart contract we are using `bytes[112]` variable (fixed size byte array)
    // you might need to use `bytes` type for dynamic sized array
    // We are also using ethers.js which requires type `number[]` when passing data
    // for argument of type `bytes` to the smart contract function
    // Next line just converts the buffer to `number[]` required by contract function
    // THIS LINE IS USED IN OUR ORIGINAL CODE:
    // return buf.toJSON().data;

    // Return just the Buffer to make the function directly compatible with decryptData function
    //console.log(buf);
    setBuffer(buf.toString("base64"));

    console.log(buf);

    return buf;
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
                  // formControlName="rAddress"
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
                onClick={() => encryptData(String(data1))}
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
