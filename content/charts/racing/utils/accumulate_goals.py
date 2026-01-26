import pandas as pd
import json
import os

def main():
    # File paths
    input_file = './AllBundesligaGamesEver.csv'
    output_file = '../bundesliga_cumulative_goals.json'

    print(f"Reading data from {input_file}...")
    
    # Load the data with correct encoding and delimiter
    # Using low_memory=False to avoid DtypeWarning
    df = pd.read_csv(input_file, sep=';', low_memory=False)

    # Filter for 1. Bundesliga
    df = df[df['League'] == '1. Bundesliga'].copy()

    # Convert scores to numeric, handling any errors
    df['Score90Home'] = pd.to_numeric(df['Score90Home'], errors='coerce')
    df['Score90Guest'] = pd.to_numeric(df['Score90Guest'], errors='coerce')

    # Fill NaN with 0
    df['Score90Home'] = df['Score90Home'].fillna(0)
    df['Score90Guest'] = df['Score90Guest'].fillna(0)

    print("Grouping goals by season and team...")
    
    # Group goals by season and home team
    home_goals = df.groupby(['SeasonFrom', 'Home'])['Score90Home'].sum().reset_index()
    home_goals.columns = ['SeasonFrom', 'Team', 'Goals']

    # Group goals by season and guest team
    guest_goals = df.groupby(['SeasonFrom', 'Guest'])['Score90Guest'].sum().reset_index()
    guest_goals.columns = ['SeasonFrom', 'Team', 'Goals']

    # Combine home and guest scores
    all_goals = pd.concat([home_goals, guest_goals]).groupby(['SeasonFrom', 'Team'])['Goals'].sum().reset_index()

    # Create a pivot table for easier cumulative sum
    # Index is SeasonFrom, columns are Teams
    pivot_df = all_goals.pivot(index='SeasonFrom', columns='Team', values='Goals').fillna(0)

    # Calculate cumulative sum across seasons
    cumulative_df = pivot_df.cumsum()

    # Reset index to have SeasonFrom as a column
    cumulative_df = cumulative_df.reset_index()

    # Convert to the desired format (list of dicts)
    result = cumulative_df.to_dict(orient='records')

    print(f"Writing results to {output_file}...")
    
    # Save to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

    print("Success!")

if __name__ == "__main__":
    main()
