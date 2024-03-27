// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { stringRGBToColor } from "./helpers";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "anyscript" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "anyscript.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from AnyScript!");
    }
  );

  context.subscriptions.push(disposable);

  // // Register a completion item provider for the new language
  // const provider = vscode.languages.registerCompletionItemProvider('anyscript', {
  // 	provideCompletionItems: completionProvider
  // });

  // context.subscriptions.push(provider);

  const rgbColorPicker = vscode.languages.registerColorProvider("anyscript", {
    provideColorPresentations: (color, context) => {
      const red = color.red.toPrecision(2);
      const green = color.green.toPrecision(2);
      const blue = color.blue.toPrecision(2);

      const label = "{" + red + ", " + green + ", " + blue + "};";
      return [
        {
          label: label,
        },
      ];
    },
    provideDocumentColors: (document, token) => {
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
    },
  });

  context.subscriptions.push(rgbColorPicker);
}
// This method is called when your extension is deactivated
export function deactivate() {}
