async function getSeattleTides() {
  const stationId = "9447130"; // Seattle, WA
  const baseUrl = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

  const now = new Date();
  const beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  // Parameters for 2026 predictions
  const params = new URLSearchParams({
    begin_date: beginDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
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
