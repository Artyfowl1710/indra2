import sys
import json
import logging
import argparse
from pathlib import Path

log = logging.getLogger(__name__)

def optimize_vessel(cargo_type: str, volume_mt: float, origin_port: str, dest_port: str) -> dict:
    """Evaluates vessel classes for a given cargo volume and route, 
    checking port constraints and calculating voyage economics.
    """
    
    data_dir = Path(__file__).parent.parent
    try:
        with open(data_dir / "port_constraints.json", "r") as f:
            ports = json.load(f)
        with open(data_dir / "vessel_types.json", "r") as f:
            vessels = json.load(f)["vessel_classes"]
        with open(data_dir / "trade_routes.json", "r") as f:
            routes = json.load(f)["routes"]
    except Exception as e:
        log.error(f"Failed to load data: {e}")
        return {"error": str(e)}
        
    # Find route
    route_id = f"{origin_port}_{dest_port}"
    route = next((r for r in routes if r["id"] == route_id), None)
    
    if not route:
        return {"error": f"Route {route_id} not found."}

    # Get port constraints
    o_port = ports.get("loading_ports", {}).get(origin_port)
    d_port = ports.get("discharge_ports", {}).get(dest_port)
    
    if not o_port or not d_port:
        return {"error": "Origin or destination port not found in port_constraints."}
        
    results = []
    
    for v_class, v_data in vessels.items():
        feasible = True
        reason = []
        
        # Check volume suitability
        if volume_mt > v_data["dwt_max"] * 0.95:
            feasible = False
            reason.append("Volume exceeds max cargo capacity")
        
        # Check if volume is too small for vessel (terrible economics)
        if volume_mt < v_data["dwt_min"] * 0.5:
            feasible = False
            reason.append("Volume too small for vessel economics")
            
        # Check origin constraints
        if v_class not in o_port.get("vessel_classes_accepted", []):
            feasible = False
            reason.append(f"Vessel class not accepted at origin {origin_port}")
            
        # Check dest constraints
        if v_class not in d_port.get("vessel_classes_accepted", []):
            feasible = False
            reason.append(f"Vessel class not accepted at destination {dest_port}")
            
        # Basic economics (if feasible)
        total_cost = None
        cost_per_mt = None
        transit = None
        waiting = None
        
        if feasible:
            # Transit time
            transit_laden = route["transit_days_laden"].get(v_class)
            transit_ballast = route["transit_days_ballast"].get(v_class)
            
            if transit_laden:
                # Estimate waiting time (simple constant for prototype)
                waiting = d_port.get("avg_waiting_days", 2.0) + o_port.get("avg_waiting_days", 1.0)
                total_days = transit_laden + waiting + (transit_ballast or 0) * 0.5 # Assume 50% ballast factor
                
                # Calculate cost
                charter_rate = v_data["charter_rate_range_usd_day"]["avg"]
                voyage_cost = total_days * charter_rate
                
                bunker_cost = (transit_laden * v_data["fuel_consumption_laden_mt_day"] + 
                               (transit_ballast or 0) * 0.5 * v_data["fuel_consumption_ballast_mt_day"]) * 550 # $550/mt bunker
                               
                port_cost = sum(v_data["port_charges_estimate_usd"].values())
                
                total_cost = voyage_cost + bunker_cost + port_cost
                cost_per_mt = total_cost / volume_mt
                transit = transit_laden
        
        results.append({
            "vessel_class": v_class,
            "feasible": feasible,
            "reason": ", ".join(reason) if reason else "Feasible",
            "total_voyage_cost_usd": round(total_cost, 2) if total_cost else None,
            "cost_per_mt_usd": round(cost_per_mt, 2) if cost_per_mt else None,
            "transit_days": transit,
            "waiting_days": waiting
        })
        
    # Pick the best feasible (lowest cost per mt)
    feasible_results = [r for r in results if r["feasible"] and r["cost_per_mt_usd"]]
    best_pick = None
    if feasible_results:
        best_pick = min(feasible_results, key=lambda x: x["cost_per_mt_usd"])["vessel_class"]
        
    return {
        "recommendations": results,
        "best_pick": best_pick
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Vessel Optimizer")
    parser.add_argument("--cargo", type=str, required=True, help="Cargo type")
    parser.add_argument("--volume", type=float, required=True, help="Volume in MT")
    parser.add_argument("--origin", type=str, required=True, help="Origin port ID")
    parser.add_argument("--dest", type=str, required=True, help="Destination port ID")
    
    args = parser.parse_args()
    
    result = optimize_vessel(args.cargo, args.volume, args.origin, args.dest)
    print(json.dumps(result, indent=2))
