const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibWF4bWlja28iLCJhIjoiY21qZXFrd2tpMGhrMDNjcjAxbWdzOG81biJ9.j43BrfGpZRxvxau1wMohaQ";

export async function getAddressSuggestions(query: string) {
  if (query.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=address,place,postcode,locality,neighborhood&limit=5&country=us`
    );
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error fetching address suggestions:", error);
    return [];
  }
}