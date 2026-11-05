/** Precios en pesos mexicanos: "$1,290 MXN". */
const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return `${mxn.format(value)} MXN`;
}
