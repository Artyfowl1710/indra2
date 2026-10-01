"""Generate realistic synthetic historical freight rate data for INDRA prototype."""
import csv
import math
import random
import os
from datetime import datetime, timedelta

random.seed(42)

# Routes with base rates and vessel classes
ROUTES = [
    ("newcastle", "paradip", "Australia", "India", ["supramax", "panamax"], {"supramax": 18, "panamax": 16}),
    ("newcastle", "dhamra", "Australia", "India", ["panamax", "capesize"], {"panamax": 17, "capesize": 14}),
    ("newcastle", "gangavaram", "Australia", "India", ["panamax", "capesize"], {"panamax": 16, "capesize": 13}),
    ("newcastle", "vizag", "Australia", "India", ["supramax", "panamax"], {"supramax": 19, "panamax": 17}),
    ("hampton_roads", "paradip", "USA", "India", ["panamax", "capesize"], {"panamax": 32, "capesize": 26}),
    ("hampton_roads", "gangavaram", "USA", "India", ["panamax", "capesize"], {"panamax": 30, "capesize": 24}),
    ("nacala", "paradip", "Mozambique", "India", ["supramax", "panamax"], {"supramax": 15, "panamax": 13}),
    ("nacala", "gangavaram", "Mozambique", "India", ["supramax", "panamax"], {"supramax": 14, "panamax": 12}),
    ("samarinda", "paradip", "Indonesia", "India", ["handysize", "supramax"], {"handysize": 14, "supramax": 12}),
    ("balikpapan", "vizag", "Indonesia", "India", ["handysize", "supramax", "panamax"], {"handysize": 13, "supramax": 11, "panamax": 10}),
    ("balikpapan", "haldia", "Indonesia", "India", ["handysize"], {"handysize": 15}),
    ("vanino", "paradip", "Russia", "India", ["supramax", "panamax"], {"supramax": 20, "panamax": 18}),
    ("hay_point", "dhamra", "Australia", "India", ["panamax", "capesize"], {"panamax": 15, "capesize": 12}),
    ("gladstone", "gangavaram", "Australia", "India", ["panamax", "capesize"], {"panamax": 16, "capesize": 13}),
    ("maputo", "vizag", "Mozambique", "India", ["supramax", "panamax"], {"supramax": 16, "panamax": 14}),
    ("samarinda", "haldia", "Indonesia", "India", ["handysize"], {"handysize": 15}),
]

CARGO_VOLUMES = {
    "handysize": (20000, 32000),
    "supramax": (40000, 58000),
    "panamax": (60000, 75000),
    "capesize": (130000, 180000),
}

BUNKER_BASE = 550  # USD/MT VLSFO average

def seasonal_factor(day_of_year):
    """Q4 peak (pre-winter coal stocking), Q2 low."""
    return 1.0 + 0.12 * math.sin(2 * math.pi * (day_of_year - 90) / 365)

def monsoon_factor(month):
    """Bay of Bengal monsoon disruption Jun-Sep."""
    if month in (6, 7, 8, 9):
        return 1.08  # 8% premium during monsoon
    return 1.0

def market_cycle(days_from_start, total_days):
    """Multi-year market cycles: 2021 COVID recovery, 2022 spike, 2023-24 normalization."""
    t = days_from_start / total_days
    # COVID dip 2021 early -> spike late 2021 / 2022 -> gradual normalization
    if t < 0.15:
        return 0.75 + 0.4 * t  # Recovery from COVID
    elif t < 0.35:
        return 0.81 + 1.2 * (t - 0.15)  # Boom
    elif t < 0.5:
        return 1.05 - 0.3 * (t - 0.35)  # Correction
    elif t < 0.75:
        return 1.00 + 0.1 * math.sin(4 * math.pi * (t - 0.5))  # Oscillation
    else:
        return 0.95 + 0.15 * (t - 0.75)  # Gradual recovery
    
def bunker_price(date):
    """Simulate bunker fuel prices."""
    doy = date.timetuple().tm_yday
    days_from_start = (date - datetime(2021, 1, 1)).days
    base = BUNKER_BASE
    # Oil price correlation
    seasonal = 1.0 + 0.08 * math.sin(2 * math.pi * (doy - 30) / 365)
    # 2022 energy crisis spike
    if datetime(2022, 3, 1) <= date <= datetime(2022, 12, 31):
        crisis = 1.35
    elif datetime(2023, 1, 1) <= date <= datetime(2023, 6, 30):
        crisis = 1.15
    else:
        crisis = 1.0
    noise = random.gauss(1.0, 0.03)
    return round(base * seasonal * crisis * noise, 2)

def generate():
    start = datetime(2021, 1, 1)
    end = datetime(2025, 12, 31)
    total_days = (end - start).days
    
    rows = []
    current = start
    
    while current <= end:
        # Generate 1-3 fixtures per day (realistic market activity)
        fixtures_today = random.randint(1, 3)
        
        for _ in range(fixtures_today):
            route = random.choice(ROUTES)
            origin, dest, origin_country, dest_country, vessel_classes, base_rates = route
            vessel_type = random.choice(vessel_classes)
            base_rate = base_rates[vessel_type]
            
            doy = current.timetuple().tm_yday
            days_from_start = (current - start).days
            
            # Calculate rate with all factors
            rate = base_rate
            rate *= seasonal_factor(doy)
            rate *= monsoon_factor(current.month)
            rate *= market_cycle(days_from_start, total_days)
            rate *= random.gauss(1.0, 0.06)  # Daily noise ±6%
            rate = max(rate, base_rate * 0.4)  # Floor
            rate = round(rate, 2)
            
            vol_range = CARGO_VOLUMES[vessel_type]
            volume = random.randint(vol_range[0], vol_range[1])
            volume = round(volume / 1000) * 1000  # Round to nearest 1000
            
            bunker = bunker_price(current)
            
            rows.append({
                "date": current.strftime("%Y-%m-%d"),
                "origin_port": origin,
                "destination_port": dest,
                "origin_country": origin_country,
                "destination_country": dest_country,
                "vessel_type": vessel_type,
                "freight_rate_usd_per_mt": rate,
                "cargo_type": "thermal_coal" if random.random() < 0.65 else "coking_coal",
                "volume_mt": volume,
                "bunker_price_usd_mt": bunker,
            })
        
        current += timedelta(days=1)
    
    return rows

if __name__ == "__main__":
    rows = generate()
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(out_dir, "seed_freight_rates.csv")
    
    fields = ["date", "origin_port", "destination_port", "origin_country",
              "destination_country", "vessel_type", "freight_rate_usd_per_mt",
              "cargo_type", "volume_mt", "bunker_price_usd_mt"]
    
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"Generated {len(rows)} freight rate records -> {out_path}")
