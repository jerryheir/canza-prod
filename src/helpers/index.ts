export const generateRandomHash = (length: number) => {
  let randomHash = '';
  const possible =
    'ABCDE3@FGHIJ_@KLMN@_PQ5RSTU__2VWXY7Zabcde0_fghijklmnopqrst_@uvwxyz0123456_@789';
  for (let i = 0; i < length; i++) {
    randomHash += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return randomHash;
};
