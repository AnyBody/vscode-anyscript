import * as vscode from "vscode";
import { stringRGBToColor } from "../helpers";

/**
 * Function to format a AnyScript RGB color
 */
export const rgbColorPresentation = (color: vscode.Color): vscode.ColorPresentation[] => {
    const red = color.red.toPrecision(2);
    const green = color.green.toPrecision(2);
    const blue = color.blue.toPrecision(2);

    const label = "{" + red + ", " + green + ", " + blue + "};";
    return [
      {
        label: label,
      },
    ];
  };

/**
 * Function to provide color information for AnyScript RGB colors for RGB members
 */
export const rgbMemberColorProvider = (document: vscode.TextDocument) => {
    const colorInfos: vscode.ColorInformation[] = [];
    const rgbRegex =
      /RGB\s*=\s*(\{\s*[01](\.\d+)?,\s*[01](\.\d+)?,\s*[01](\.\d+)?\s*\}\s*;)/g;

    let match;

    while ((match = rgbRegex.exec(document.getText())) !== null) {
      const stringRGB = match[1];

      const identifierStartPos = document.positionAt(
        match.index + (match[0].length - stringRGB.length)
      );
      const identifierEndPos = document.positionAt(
        match.index + match[0].length
      );

      const colorInfo = {
        color: stringRGBToColor(stringRGB),
        range: new vscode.Range(
          identifierStartPos.line,
          identifierStartPos.character,
          identifierEndPos.line,
          identifierEndPos.character
        ),
      };

      colorInfos.push(colorInfo);
    }
    return colorInfos;
  };