export const stringRGBToColor = (
  stringRGB: string
): { red: number; green: number; blue: number; alpha: number } => {
  // Remove the curly braces and split the string into an array of strings
  const colorStrings = stringRGB.replace(/[{}]/g, "").split(",");

  // Convert each string to a number and assign to the corresponding color
  const red = parseFloat(colorStrings[0]);
  const green = parseFloat(colorStrings[1]);
  const blue = parseFloat(colorStrings[2]);

  // Return the color object
  return { red, green, blue, alpha: 1 };
};
