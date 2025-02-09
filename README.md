# 🚀 Next.js Uniswap Transaction Tracker

This project is a **Next.js backend** that tracks **Uniswap V3 USDC/ETH transactions** and calculates transaction fees in **USDT**.

---

## 📌 Features

✅ **RESTful API using Next.js API Routes**  
✅ **Real-time tracking** of Uniswap V3 USDC/ETH transactions  
✅ **Historical batch data retrieval**  
✅ **Transaction fee computation** (ETH to USDT conversion)  
✅ **Swagger API Documentation (OpenAPI 3.0)**  
✅ **Automated testing with Playwright**

---

## 🛠 Tech Stack

| **Component**           | **Technology**                                 |
| ----------------------- | ---------------------------------------------- |
| **Backend**             | Next.js (API Routes)                           |
| **Blockchain Data**     | Web3.js + Etherscan API                        |
| **Price Data**          | Binance API (ETH/USDT conversion)              |
| **Database (Optional)** | Redis (for caching) / PostgreSQL (for history) |
| **API Documentation**   | Swagger (via `swagger-jsdoc`)                  |
| **Testing**             | Playwright                                     |

---

## 📡 API Endpoints

| **Method** | **Endpoint**                              | **Description**                         |
| ---------- | ----------------------------------------- | --------------------------------------- |
| `GET`      | `/api/transaction/{tx_hash}`              | Get transaction fee in USDT by Txn hash |
| `GET`      | `/api/transactions?start_time=&end_time=` | Fetch historical Uniswap transactions   |
| `GET`      | `/api/live-tracker/start`                 | Start real-time transaction tracking    |
| `GET`      | `/api/eth-usdt-price`                     | Get the latest ETH/USDT price           |

---

## 📌 Step-by-Step Backend Implementation

We will implement:

- ✅ **Real-time tracker** (WebSocket / Web3.js)
- ✅ **Batch historical fetcher** (Etherscan API)
- ✅ **Transaction fee calculator** (ETH to USDT conversion)
- ✅ **REST API endpoints** (Next.js API routes)
- ✅ **Swagger API Documentation**
- ✅ **Automated testing with Playwright**

---

## 📦 Installation & Setup

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/your-repo/uniswap-tracker.git
cd uniswap-tracker
```

### **2️⃣ Install Dependencies**

```sh
git clone https://github.com/your-repo/uniswap-tracker.git
cd uniswap-tracker
```

### **3️⃣ Set Up Environment Variables**

```ini
ETHERSCAN_API_KEY=your_etherscan_api_key
BINANCE_API_URL=https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT

```

### **4️⃣ Run the Next.js Server**

```sh
npm run dev

```

### **5️⃣ Run Playwright Tests**

```sh
npx playwright test
```
