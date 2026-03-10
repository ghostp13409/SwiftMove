import { Address } from "@/types";

/**
 * Generates a Google Maps link for a single address or coordinates.
 */
export const getGoogleMapsAddressLink = (address: Partial<Address>) => {
  if (address.latitude && address.longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`;
  }
  
  const query = [
    address.line1,
    address.city,
    address.stateOrProvince,
    address.country
  ].filter(Boolean).join(", ");
  
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

/**
 * Generates a Google Maps directions link between two addresses.
 */
export const getGoogleMapsDirectionsLink = (from: Partial<Address>, to: Partial<Address>) => {
  const origin = from.latitude && from.longitude 
    ? `${from.latitude},${from.longitude}`
    : encodeURIComponent([from.line1, from.city].filter(Boolean).join(", "));
    
  const destination = to.latitude && to.longitude
    ? `${to.latitude},${to.longitude}`
    : encodeURIComponent([to.line1, to.city].filter(Boolean).join(", "));
    
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
};
