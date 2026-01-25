import pandas as pd

# 1. Load the file with the correct separator (semicolon)
# index_col=0 ignores that first 'unnamed' column with 0, 1, 2...
df = pd.read_csv('AllBundesligaGamesEver.csv', sep=';', index_col=0)

# 2. Filter for 1. Bundesliga
df = df[df['League'] == '1. Bundesliga'].copy()

# 3. Use the pre-existing Points columns
# Extract Home Team results
home_pts = df[['SeasonFrom', 'Home', 'PointsHome']].rename(
    columns={'Home': 'Team', 'PointsHome': 'Points'}
)

# Extract Guest Team results
guest_pts = df[['SeasonFrom', 'Guest', 'PointsGuest']].rename(
    columns={'Guest': 'Team', 'PointsGuest': 'Points'}
)

# 4. Combine and group by Season
combined = pd.concat([home_pts, guest_pts])
seasonal_points = combined.groupby(['SeasonFrom', 'Team'])['Points'].sum().reset_index()

# 5. Calculate Cumulative Totals
seasonal_points = seasonal_points.sort_values(['Team', 'SeasonFrom'])
seasonal_points['CumulativePoints'] = seasonal_points.groupby('Team')['Points'].cumsum()

# 6. Pivot to Wide Format (Year on Rows, Teams on Columns)
wide_df = seasonal_points.pivot(index='SeasonFrom', columns='Team', values='CumulativePoints')

# 7. Clean up: Fill missing years (relegation) with the last known point total
wide_df = wide_df.ffill().fillna(0)

# 8. Save output
wide_df.to_csv('bundesliga_points_race.csv')
print("Done! Your racing chart data is ready.")

json_records = wide_df.reset_index().to_json(orient='records', indent=4)
with open('../bundesliga_race.json', 'w') as f:
    f.write(json_records)