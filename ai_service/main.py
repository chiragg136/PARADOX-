from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from sklearn.linear_model import LinearRegression
import datetime
import requests
import json
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global sensor state
MARKET_SENSORS = {
    "commodity_price": 0.0,
    "exchange_rate": 83.0, # Default fallback
    "last_source": "Neural Simulation",
    "active_nodes": 1,
    "volatility": 0.05
}

def fetch_real_market_data():
    """Fetch live commodity data and exchange rate."""
    global MARKET_SENSORS
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    # 1. Fetch Wheat Futures (ZW=F)
    try:
        symbol = "ZW=F"
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1m&range=1d"
        response = requests.get(url, headers=headers, timeout=5)
        data = response.json()
        if 'chart' in data and data['chart']['result']:
            price = data['chart']['result'][0]['meta']['regularMarketPrice']
            MARKET_SENSORS["commodity_price"] = price
            MARKET_SENSORS["active_nodes"] += 1
    except Exception as e:
        print(f"Commodity sensor error: {e}")

    # 2. Fetch USD/INR Exchange Rate (INR=X)
    try:
        url = "https://query1.finance.yahoo.com/v8/finance/chart/INR=X?interval=1m&range=1d"
        response = requests.get(url, headers=headers, timeout=5)
        data = response.json()
        if 'chart' in data and data['chart']['result']:
            rate = data['chart']['result'][0]['meta']['regularMarketPrice']
            MARKET_SENSORS["exchange_rate"] = rate
            MARKET_SENSORS["last_source"] = f"Yahoo Finance (INR={rate:.2f})"
            MARKET_SENSORS["active_nodes"] += 1
    except Exception as e:
        print(f"Exchange rate sensor error: {e}")

# Call initially
fetch_real_market_data()

# Simulated historical grocery data generator
def get_historical_prices(product_name, days=30):
    np.random.seed(sum(ord(c) for c in product_name))
    
    # Scale base price by the real commodity index (Wheat) if available
    base_bias = (MARKET_SENSORS["commodity_price"] / 500) if MARKET_SENSORS["commodity_price"] > 0 else 1.0
    
    # Category biasing based on product name
    product_lower = product_name.lower()
    cat_bias = 1.0
    if any(x in product_lower for x in ["saffron", "truffle", "vanilla", "meat", "oil"]):
        cat_bias = 5.0 # Expensive
    elif any(x in product_lower for x in ["salt", "water", "sugar", "potato", "onion"]):
        cat_bias = 0.5 # Cheap staples
    elif any(x in product_lower for x in ["tomato", "milk", "bread", "egg"]):
        cat_bias = 0.8 # Daily produce
    
    # Calculate in USD first (realistic for individual retail items: $0.20 - $3.00)
    base_price_usd = np.random.uniform(0.2, 3.0) * base_bias * cat_bias
    trend_usd = np.random.uniform(-0.005, 0.005)
    noise_usd = np.random.normal(0, 0.05, days)
    
    # Convert to INR using the live exchange rate
    rate = MARKET_SENSORS["exchange_rate"]
    prices_inr = [max(10, (base_price_usd + trend_usd * i + noise_usd[i]) * rate) for i in range(days)]
    
    return prices_inr

@app.get("/market-intelligence")
def get_prediction(
    product: str = Query(..., description="Product name"),
    days: int = Query(30, description="Number of historical days")
):
    # Randomly refresh sensor data
    if np.random.random() > 0.8:
        fetch_real_market_data()

    prices = get_historical_prices(product, days)
    X = np.array(range(len(prices))).reshape(-1, 1)
    y = np.array(prices)
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next 7 days
    future_X = np.array(range(len(prices), len(prices) + 7)).reshape(-1, 1)
    future_preds = model.predict(future_X)
    
    current_price = round(float(prices[-1]), 2)
    
    # Add real-time fluctuation (active jitter in INR)
    # 1 INR jitter is small, let's use a scale relative to the price
    jitter = np.sin(time.time() * 0.8) * (current_price * 0.02)
    current_price = round(current_price + jitter, 2)
    
    predicted_price = round(float(future_preds[-1]), 2)
    
    price_diff = predicted_price - current_price
    
    # Threshold for recommendation (5% shift)
    threshold = current_price * 0.05
    
    if price_diff > threshold:
        trend = "increasing"
        recommendation = "Buy Now"
    elif price_diff < -threshold:
        trend = "decreasing"
        recommendation = "Wait for Price Drop"
    else:
        trend = "stable"
        recommendation = "Stable Price"
        
    return {
        "product": product,
        "current_price": current_price,
        "predicted_price": predicted_price,
        "trend": trend,
        "recommendation": recommendation,
        "historical_data": [round(p, 2) for p in prices],
        "forecast_data": [round(p, 2) for p in future_preds.tolist()],
        "currency": "INR",
        "metadata": {
            "source": MARKET_SENSORS["last_source"],
            "base_index": str(MARKET_SENSORS["commodity_price"]),
            "exchange_rate": str(MARKET_SENSORS["exchange_rate"]),
            "timestamp": datetime.datetime.now().isoformat()
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
