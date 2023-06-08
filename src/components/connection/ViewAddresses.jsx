import Web3 from "web3";
import CONTRACT_ABI from "../../abi/contract.abi.json";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0x59028155D42d57D39A0d793885128606a4f62Cb1";

function ViewAddress() {
  const [addressInfo, setAddressInfo] = useState([]);
  let data = [];
  const [owner, setOwner] = useState([false]);
  //   let addressInfo = [];
  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      let messages_ = await ct.methods.viewUserAddresses().call();
      messages_.map(async (item) => {
        let info = await ct.methods.users(item).call();
        data.push({
          approved: info["approved"],
          publicKey: info["publicKey"],
          registered: info["registered"],
          address: item,
        });
        setAddressInfo([...data]);
      });
    }
  }
  async function isOwnner() {
    if (window.ethereum) {
      let m;
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((a) => (m = a[0]));

      window.web3 = new Web3(window.ethereum);
      const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      let o = await ct.methods.owner().call();
      if (o.toLowerCase() == m.toLowerCase()) {
        setOwner(true);
      } else {
        setOwner(false);
      }
    }
  }
  async function approve(address) {
    if (window.ethereum) {
      let m;
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((a) => (m = a[0]));
      window.web3 = new Web3(window.ethereum);
      const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      try {
        await ct.methods.approve(address, true).send({ from: m });
      } catch (e) {
        console.log(e);
      }
      console.log(address);
    }
  }
  async function disapprove(address) {
    if (window.ethereum) {
      let m;
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((a) => (m = a[0]));
      window.web3 = new Web3(window.ethereum);
      const ct = new window.web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      try {
        await ct.methods.approve(address, false).send({ from: m });
      } catch (e) {
        console.log(e);
      }
      console.log(address);
    }
  }
  useEffect(() => {
    loadWeb3();
    isOwnner();
  }, []);

  return (
    <>
      {owner ? (
        <>
          <div
            className="flex-col
    justify-center"
          >
            {addressInfo.map((Info) => (
              <div className="my-5 text-center">
                {Info.address}
                {Info.approved ? (
                  <>
                    <p className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                      approved
                    </p>
                    <button
                      onClick={(e) => disapprove(Info.address)}
                      className="justify-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Disapprove
                    </button>
                  </>
                ) : (
                  <div>
                    <button
                      onClick={(e) => approve(Info.address)}
                      className="justify-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          You are not an owner
        </p>
      )}
    </>
  );
}
export default ViewAddress;
