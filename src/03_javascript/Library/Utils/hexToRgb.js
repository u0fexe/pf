export default function hex2rgb(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
  }
};