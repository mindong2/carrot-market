import { useEffect, useState } from "react";

interface ICoords {
  latitude: number | null;
  longitude: number | null;
}

export default function useCoords() {
  const [coords, setCoords] = useState<ICoords>({ latitude: null, longitude: null });
  const getPosition = (coords: GeolocationPosition) => {
    setCoords({ latitude: coords.coords.latitude, longitude: coords.coords.longitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(getPosition);
  }, []);
  return coords;
}
