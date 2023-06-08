import Web3 from "web3";
import CONTRACT_ABI from "../../abi/contract.abi.json";
import { useEffect, useState } from "react";
const CONTRACT_ADDRESS = "0x59028155D42d57D39A0d793885128606a4f62Cb1";

function Reciever() {
  const [messages, setMessages] = useState([]);

  async function loadWeb3() {
    if (window.ethereum) {
      let m;
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((a) => (m = a[0]));

      window.web3 = new Web3(window.ethereum);
      const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      let messages_ = await ct.methods.viewMessage(m).call();

      setMessages(messages_);
    }
  }

  async function decrypt(index) {
    let m = [...messages];

    let meta;
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((a) => (meta = a[0]));

    // let decryptedMessage;
    await window.ethereum
      .request({
        method: "eth_decrypt",
        params: [m[index], meta],
      })
      .then((result) => (m[index] = result))
      .catch((error) => console.log(error.message));

    setMessages(m);
  }

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Messages
        </h2>

        {messages.map((m, i) => {
          return (
            <>
              <p className="break-words mt-2">{m}</p>
              <button
                onClick={() => decrypt(i)}
                className="flex ml-auto justify-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Decrypt
              </button>
            </>
          );
        })}
      </div>
    </div>
  );
}
export default Reciever;
