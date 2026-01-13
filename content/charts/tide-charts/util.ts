async function getSeattleTides() {
  const stationId = "9447130"; // Seattle, WA
  const baseUrl = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

  // Parameters for 2026 predictions
  const params = new URLSearchParams({
    date: "today", // Starts from current time in 2026
    range: "48", // Next 48 hours
    station: stationId,
    product: "predictions",
    datum: "MLLW",
    time_zone: "lst_ldt", // Local Time / Daylight Time
    interval: "hilo", // Only high/low tides (remove for 6-min data)
    units: "english", // Feet
    format: "json",
    application: "web_dev_test",
  });

  try {
    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    // Process and log the predictions
    console.log("Seattle Tide Predictions (Next 48 Hours):");
    data.predictions.forEach((tide: any) => {
      const type = tide.type === "H" ? "High" : "Low";
      console.log(`${tide.t}: ${tide.v} ft (${type})`);
    });
    return data;
  } catch (error) {
    console.error("Could not fetch tide data:", error);
  }
}

async function getSunData(lat: number, lng: number) {
  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const results = data.results;

    return results;
  } catch (error) {
    console.error("Could not fetch data:", error);
    return null;
  }
}

export { getSeattleTides, getSunData };
