import React, { useState } from "react";
import CryptoJS from "crypto-js";

function AES() {
  const [plaintext, setplaintext] = useState(null);
  const [ciphertext, setciphertext] = useState(null);
  const [key, setkey] = useState(null);
  const [keyExist, setkeyExist] = useState(true);
  const [plaintextOutput, setplaintextOutput] = useState(null);
  const [ciphertextOutput, setciphertextOutput] = useState(null);

  //   useEffect

  function encryptAES(plaintext, key) {
    const encrypted = CryptoJS.AES.encrypt(plaintext, key);
    return encrypted.toString();
  }

  // AES decryption function
  function decryptAES(ciphertext, key) {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  function savekey() {
    setkeyExist(false);
  }
  function Decrypt() {
    setciphertextOutput(decryptAES(ciphertext, key));
  }
  function Encrypt() {
    setplaintextOutput(encryptAES(plaintext, key));
  }
  // AES encryption
  //   encryptAES(plaintext, key);
  //   console.log("Ciphertext:", ciphertext);

  // AES decryption
  //   const decryptedText = decryptAES(ciphertext, key);
  //   console.log("Decrypted Text:", decryptedText);
  return keyExist ? (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          AES
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label
                for="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Enter Your key
              </label>
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setkey(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              onClick={savekey}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save key
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label
                for="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Enter Your Encryted text here
              </label>
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setciphertext(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              onClick={Decrypt}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Decrypt
            </button>
          </div>
          <div>
            <p className="text-center m-3">
              Decrypted message: {ciphertextOutput}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <label
              for="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Enter Your Plaintext text here
            </label>
          </div>
          <div className="mt-2">
            <input
              onChange={(e) => setplaintext(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <button
              onClick={Encrypt}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ecrypt
            </button>
          </div>
          <div>
            <p className="text-center m-3">
              Ecrypted message: {plaintextOutput}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AES;
