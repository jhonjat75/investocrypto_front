import React, { useState, useEffect } from 'react';
import { cable } from './cable';
import './App.css';
import { VITE_API_URL } from './constants';

type Coin = {
  _id: string;
  name: string;
  rate: number;
  logo_url: string;
  price: number;
};

const calculateGains = (rate: number, amount: number): number => {
  const monthlyRate = rate / 100;
  return amount * Math.pow(1 + monthlyRate, 12) - amount;
};

const calculateTotal = (rate: number, amount: number): number => {
  return amount + calculateGains(rate, amount);
};

const calculateCryptoQuantity = (price: number, amount: number): number => {
  return amount / price;
};

function App() {

  const [coins, setCoins] = useState<Coin[]>([]);
  const [amount, setAmount] = useState(0);

  const apiBaseUrl = VITE_API_URL;

  useEffect(() => {
    fetch(`${apiBaseUrl}/coins`)
      .then(response => response.json())
      .then(data => setCoins(data))
      .catch(error => console.error('Error fetching data: ', error));

    const coinsChannel = cable.subscriptions.create('CoinsChannel', {
      received(data: Coin) {
        setCoins(currentCoins => {
          const existingCoin = currentCoins.find(coin => coin._id === data._id);
          if (existingCoin) {
            return currentCoins.map(coin => coin._id === data._id ? data : coin);
          } else {
            return [...currentCoins, data];
          }
        });
      },
    });

    return () => {
      coinsChannel.unsubscribe();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value) || 0);
  };

  const handleDownloadFile = async (fileType: string) => {
    const filename = `coinsdata.${fileType}`;
    const url = `${apiBaseUrl}/coins/download.${fileType}?amount=${amount}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.blob();
      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error downloading ${fileType}: `, error);
    }
  };

  return (
    <div className="App">
      <div className="tab-contain mb-3 p-3">
      <span className="row">
        <div className="input-USD-amount">
          <label  className="form-label">Enter USD amount</label>
          <input  type="number" value={amount} onChange={handleInputChange} className="form-control"/>
        </div>
        <div className="input-USD-amount mx-auto row d-flex align-items-end mt-2">
        {amount > 0 && (
          <>
              <button type="button" onClick={() => handleDownloadFile('pdf')} className="btn btn-pdf btn-sm btn-export m-1">
                  <i className="fas fa-file-pdf"></i> PDF
              </button>
              <button type="button" onClick={() => handleDownloadFile('csv')} className="btn btn-csv btn-sm btn-export m-1">
                  <i className="fas fa-file-csv"></i> CSV
              </button>
              <button type="button" onClick={() => handleDownloadFile('json')} className="btn btn-json btn-sm btn-export m-1">
                  <i className="fas fa-file-code"></i> JSON
              </button>
          </>
        )}
        </div>
      </span>
      </div>
      <div className="tab-contain">
        <table className=" table-borderless">
          <thead>
            <tr>
              <th>Cryptocurrency</th>
              <th>Price</th>
              <th>Annual Gain</th>
              <th>Total</th>
              <th>Quantity in Crypto</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const gain = calculateGains(coin.rate, amount);
              const total = calculateTotal(coin.rate, amount);
              const cryptoQuantity = calculateCryptoQuantity(coin.price, amount);
              return (
                <tr key={coin._id}>
                  <td>
                    <img src={coin.logo_url} alt={`${coin.name} logo`} style={{ width: '50px' }} />
                    {coin._id}
                  </td>
                  <td>{coin.price.toFixed(3)}</td>
                  <td>${gain.toFixed(2)}</td>
                  <td>${total.toFixed(2)}</td>
                  <td>{cryptoQuantity.toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
export { calculateGains, calculateTotal, calculateCryptoQuantity };
