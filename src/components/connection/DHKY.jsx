import React, { useState, useEffect } from "react";
function Dhky() {
  const [data, setData] = useState(null);
  const [items, setItem] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [ab, setab] = useState(null);
  const [A_B, setA_B] = useState(null);
  const [key, setkey] = useState(null);
  const [Fkey, setFkey] = useState(null);
  const [g, setg] = useState(null);

  useEffect(() => {
    localStorage.setItem("Pnumber", JSON.stringify(data));
    setItem(localStorage.getItem("Pnumber"));
  }, [data]);

  function generateRamdomNumber() {
    setToggle(true);
  }

  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }

  function generatePrimitiveRoot(p) {
    if (!isPrime(p)) return null;

    const factors = [];
    let phi = p - 1;
    let temp = phi;

    for (let i = 2; i * i <= temp; i++) {
      if (temp % i === 0) {
        factors.push(i);
        while (temp % i === 0) {
          temp /= i;
        }
      }
    }

    if (temp > 1) {
      factors.push(temp);
    }

    for (let g = 2; g < p; g++) {
      let isPrimitiveRoot = true;
      for (let i = 0; i < factors.length; i++) {
        if (gcd(g, phi / factors[i]) === 1) {
          isPrimitiveRoot = false;
          break;
        }
      }

      if (isPrimitiveRoot) {
        return g;
      }
    }

    return null;
  }

  function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) {
        return false;
      }
    }

    return true;
  }
  function modPow(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;

    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      base = (base * base) % modulus;
      exponent = exponent >> 1;
    }

    return result;
  }

  function generateKey(prime, generator, privateValue) {
    return modPow(generator, privateValue, prime);
  }
  function calculateSharedKey() {
    setkey(generateKey(data, g, ab));
  }
  const p = data;
  localStorage.setItem("gnumber", JSON.stringify(generatePrimitiveRoot(p)));

  function calculateKey() {
    setFkey(modPow(A_B, ab, data));
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          DHKY Process
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <div className="mt-2">
            <input
              placeholder="Enter your Prime Number"
              onChange={(e) => setData(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mt-2">
            <input
              placeholder="Enter your Generator"
              onChange={(e) => setg(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <button
              disabled={toggle}
              onClick={generateRamdomNumber}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Set Prime and Generator
            </button>
          </div>
          <div>
            <p className="text-center m-3">
              Prime Number: {items} <br />g : {g}
            </p>
          </div>
          <div>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Enter your secret integer a or b
              </h2>
            </div>

            <div className="mt-2">
              <input
                // formControlName="rAddress"
                onChange={(e) => setab(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              onClick={calculateSharedKey}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send Number
            </button>
          </div>
          <div>
            <p className="text-center m-3">Generated A or B: {key}</p>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Enter the recieved A or B
            </h2>
          </div>
          <div className="mt-2">
            <input
              // formControlName="rAddress"
              placeholder="A or B"
              onChange={(e) => setA_B(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="mt-2">
            <input
              // formControlName="rAddress"
              placeholder="a or b"
              onChange={(e) => setab(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <button
              onClick={calculateKey}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Calculate key
            </button>
          </div>
          <div>
            <p className="text-center m-3">Your Key: {Fkey}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dhky;
