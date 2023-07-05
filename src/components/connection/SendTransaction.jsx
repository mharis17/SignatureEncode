import Web3 from "web3";
import CONTRACT_ABI from "../../abi/contract.abi.json";
import React, { useEffect, useState } from "react";
const CONTRACT_ADDRESS = "0x59028155D42d57D39A0d793885128606a4f62Cb1";
const CBC_CONTRACT_ADDRESS = "0x7167E9ac131Df7C565b79BdB1897cD3f4269699C";

function SendTransaction() {
  const keys = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    " ",
  ];
  const values = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "0A",
    "0B",
  ];
  var map = new Map();
  for (var i = 0; i < keys.length; i++) {
    map.set(keys[i], values[i]);
  }
  const [msg, setMsg] = useState();

  const web3 = new Web3(
    "https://eth-goerli.g.alchemy.com/v2/9rYRCT3uOuRu6TI-LMXNj1v57YWNZqBD"
  ); // Replace with your Infura project ID or your Ethereum node URL
  // Contract address
  const contractAddress = "0x59028155D42d57D39A0d793885128606a4f62Cb1"; // Replace with the actual contract address
  var transactions = [];
  var response;
  async function getAllContractTransactions() {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "0x0",
              toBlock: "latest",
              contractAddresses: ["0x7167E9ac131Df7C565b79BdB1897cD3f4269699C"],
              category: ["erc20"],
              withMetadata: false,
              excludeZeroValue: false,
              maxCount: "0x3e8",
              order: "desc",
            },
          ],
        }),
      };

      fetch(
        "https://eth-goerli.g.alchemy.com/v2/9rYRCT3uOuRu6TI-LMXNj1v57YWNZqBD",
        options
      )
        .then((response) => response.json())
        .then((response) => {
          for (i = 0; i < response.result.transfers.length; i++) {
            transactions.push(response.result.transfers[i].hash);
          }
          resolve();
        })
        .catch((err) => {
          console.error(err);

          reject();
        });
    });
  }
  useEffect(() => {
    getAllContractTransactions();
  }, []);
  //console.log(response.result.transfers.length))      imp
  //   console.log(await getAllContractTransactions(contractAddress));
  //   getAllContractTransactions(contractAddress)
  //     .then((transactions) => {
  //       console.log("Transactions:", transactions);
  //     })
  //     .catch((error) => {
  //       console.error("Error occurred while retrieving transactions:", error);
  //     });

  async function send() {
    var str = "hello world";
    console.log(str.length);
    var t = "";
    var index = "";
    var j = 0;
    for (j = 0; j < str.length; j++) {
      for (i = 0; i < transactions.length; i++) {
        t = t + i.toString();
        console.log(str[j]);
        if (
          transactions[i].toLowerCase().includes(map.get(str[j].toUpperCase()))
        ) {
          index = index + transactions[i].indexOf(map.get(str[j]));
          break;
        }
      }
      break;
    }

    console.log(t);
    console.log(index);
    console.log(transactions);
    console.log(map);
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          CBC Transaction
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
                Enter Your Message
              </label>
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setMsg(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => send()}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SendTransaction;
