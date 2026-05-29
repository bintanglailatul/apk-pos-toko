export const getStockColor = (stok: number, min: number) => {
  if (stok <= min) return "bg-red-500 text-white"
  if (stok <= min + 5) return "bg-yellow-400"
  return "bg-green-500"
}