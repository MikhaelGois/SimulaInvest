
import json

def calculate_score(asset):
    """
    Calculates a score for an asset based on short-to-medium term indicators.
    A higher score is better.
    """
    p_l = asset.get('pl')
    roe = asset.get('roe')
    dy = asset.get('dy')
    setor = asset.get('setor')

    # Rule for Real Estate Funds (FIIs) - focus on Dividend Yield
    if setor == 'Fundo Imobiliário':
        if dy and dy > 0:
            return round(dy * 100)  # Score is basically the yield
        return 0

    # Rule for Stocks
    score = 0
    if p_l and p_l > 0:
        # Lower P/L is better, so we use its inverse.
        # This gives higher points for lower P/L.
        score += (1 / p_l) * 20
    
    if roe:
        # Higher ROE is better.
        score += roe * 80
        
    return round(score)

def analyze_data():
    """
    Loads data, analyzes it, and saves the results.
    """
    try:
        with open('backend/data.json', 'r', encoding='utf-8') as f:
            assets = json.load(f)
    except FileNotFoundError:
        print("Error: data.json not found.")
        return

    analyzed_assets = []
    for asset in assets:
        asset['score'] = calculate_score(asset)
        analyzed_assets.append(asset)
    
    # Sort by score, descending
    analyzed_assets.sort(key=lambda x: x['score'], reverse=True)

    try:
        with open('backend/results.json', 'w', encoding='utf-8') as f:
            json.dump(analyzed_assets, f, ensure_ascii=False, indent=4)
        print("Analysis complete. Results saved to results.json.")
    except Exception as e:
        print(f"Error writing results.json: {e}")

if __name__ == '__main__':
    analyze_data()
