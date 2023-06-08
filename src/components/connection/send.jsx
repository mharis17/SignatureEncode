import { bufferToHex } from "ethereumjs-util";
import { encrypt } from "@metamask/eth-sig-util";

import Web3 from "web3";
import CONTRACT_ABI from "../../abi/contract.abi.json";
const CONTRACT_ADDRESS = "0x59028155D42d57D39A0d793885128606a4f62Cb1";

function Send() {
  async function encryptAndSend() {
    let receiverAddress = document.getElementById("receiverAddress").value;
    let message = document.getElementById("message").value;

    if (!Web3.utils.isAddress(receiverAddress)) {
      alert("Invalid Reciever's address");
      return;
    }

    window.web3 = new Web3(window.ethereum);
    let m;
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((a) => (m = a[0]));

    const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    let PUBLIC_KEY = await ct.methods.viewPublicKe(receiverAddress).call();
    if (!PUBLIC_KEY) {
      alert("Given Reciever's address is not registered");
      return;
    }

    if (!message) {
      alert("Message is empty");
      return;
    }

    const encryptedMessage = bufferToHex(
      Buffer.from(
        JSON.stringify(
          encrypt({
            publicKey: PUBLIC_KEY,
            data: message,
            version: "x25519-xsalsa20-poly1305",
          })
        ),
        "utf8"
      )
    );

    try {
      await ct.methods
        .storeData(encryptedMessage, receiverAddress)
        .send({ from: m });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Message encryption
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Reciever's address
              </label>
              <div className="mt-2">
                <input
                  id="receiverAddress"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Message
                </label>
              </div>
              <div className="mt-2">
                <textarea
                  id="message"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={(e) => encryptAndSend()}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Send;

//   <div>
//     <button
//       //   onClick={Reciever}
//       className="flex mt-4 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//     >
//       GET YOUR MESSAGE FROM HERE
//     </button>
//   </div>
