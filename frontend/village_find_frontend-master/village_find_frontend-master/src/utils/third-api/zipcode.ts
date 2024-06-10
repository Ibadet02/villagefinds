import { enqueueSnackbar } from 'notistack';

import { GEOLOCATION_API_KEY } from '@/config/global';

export async function getCityFromZipCode(zipcode: string, countryCode = 'us') {
  const url = `https://api.zippopotam.us/${countryCode}/${zipcode}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No data found for ZIP code: ${zipcode}`);
    }
    const data = await response.json();
    // Assuming the ZIP code exists and data.places is not empty
    const city = data.places[0]['place name'];
    return city;
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function getLocationFromCoords({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  try {
    const result = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&country_code=us&limit=1&key=${GEOLOCATION_API_KEY}`,
    )
      .then(response => response.json())
      .then(response => {
        const results = response.results;
        if (results.length === 0) {
          enqueueSnackbar('You are not located in United States.', {
            variant: 'warning',
          });
          return null;
        } else {
          return results[0].components;
        }
      });
    return result;
  } catch {
    enqueueSnackbar(
      'Please ensure to allow location settings on the browser.',
      { variant: 'warning' },
    );
  }
}

export async function getLocationFromZipcode(zipcode: string) {
  try {
    const result = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${zipcode}&country_code=us&limit=1&key=${GEOLOCATION_API_KEY}`,
    )
      .then(response => response.json())
      .then(response => {
        const results = response.results;
        if (results.length === 0) {
          enqueueSnackbar(
            `There are no available cities with zipcode ${zipcode}.`,
            {
              variant: 'warning',
            },
          );
          return null;
        } else {
          return results[0].components;
        }
      });
    return result;
  } catch {
    enqueueSnackbar(
      'Please ensure to allow location settings on the browser.',
      { variant: 'warning' },
    );
  }
}
