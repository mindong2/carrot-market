export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export const cloudflareGetImage = (imageId: string, variance: string) => {
  return `https://imagedelivery.net/QudHS_0d12Nos5oqyCqLbw/${imageId}/${variance}`;
};
