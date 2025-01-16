import * as vscode from "vscode";

const ANYSCRIPT_INDENTATION = "  ";

const formatIndentation = (code: string, isSelection = false): string => {
  const lines = code.split("\n");
  let indentLevel = 0;
  // if isSelection is true, we need to remember the indentation on the first line and
  // cout that as the base indentation for the rest of the lines
  if (isSelection) {
    const firstLine = lines[0];
    const match = firstLine.match(/^(\s*)/);
    if (match) {
      const baseIndentation = match[1];
      indentLevel = baseIndentation.length / ANYSCRIPT_INDENTATION.length;
    }
  }
  let insideMultilineComment = false;

  return lines
    .map((line) => {
      if (line.includes("/*")) {
        insideMultilineComment = true;
      }
      if (line.includes("*/")) {
        insideMultilineComment = false;
        return line; // Return the line as is
      }
      if (insideMultilineComment) {
        return line; // Return the line as is
      }

      const trimmedLine = line.trim();
      const hasOpeningBracket = trimmedLine.includes("{");
      const hasClosingBracket = trimmedLine.includes("}");

      if (hasClosingBracket && !hasOpeningBracket) {
        indentLevel--;
      }

      const indentation =
        indentLevel > 0 ? ANYSCRIPT_INDENTATION.repeat(indentLevel) : "";
      const formattedLine = indentation + trimmedLine;

      if (hasOpeningBracket && !hasClosingBracket) {
        indentLevel++;
      }

      return formattedLine;
    })
    .join("\n");
};

const separateEqualSign = (text: string) => {
  let insideSingleQuote = false;
  let insideDoubleQuote = false;
  let insideSingleLineComment = false;
  let insideMultiLineComment = false;

  return text.replace(
    /(\/\*|\*\/|\/\/|["']|[=!<>]=|[?]{2}=|=)/g,
    (match, p1, offset, string) => {
      if (p1 === "/*") {
        insideMultiLineComment = true;
        return p1;
      }
      if (p1 === "*/") {
        insideMultiLineComment = false;
        return p1;
      }
      if (p1 === "//") {
        insideSingleLineComment = true;
        return p1;
      }
      if (p1 === "\n" && insideSingleLineComment) {
        insideSingleLineComment = false;
        return p1;
      }
      if (
        p1 === "'" &&
        !insideDoubleQuote &&
        !insideSingleLineComment &&
        !insideMultiLineComment
      ) {
        insideSingleQuote = !insideSingleQuote;
        return p1;
      }
      if (
        p1 === '"' &&
        !insideSingleQuote &&
        !insideSingleLineComment &&
        !insideMultiLineComment
      ) {
        insideDoubleQuote = !insideDoubleQuote;
        return p1;
      }
      if (
        insideSingleQuote ||
        insideDoubleQuote ||
        insideSingleLineComment ||
        insideMultiLineComment
      ) {
        return p1;
      }
      if (/[=!<>]=|[?]{2}=/.test(p1)) {
        return ` ${p1} `;
      }
      if (p1 === "=") {
        return " = ";
      }
      return p1;
    }
  );
};

export const formatDocumentProvider = (document: vscode.TextDocument) => {
  const text = document.getText();
  const formattedText = formatIndentation(separateEqualSign(text));
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );
  return [new vscode.TextEdit(fullRange, formattedText)];
};

export const formatDocumentRangeProvider = (
  document: vscode.TextDocument,
  selection: vscode.Selection
) => {
  // expand the range to cover line start to line end
  const expandedRange = new vscode.Range(
    document.lineAt(selection.start.line).range.start,
    document.lineAt(selection.end.line).range.end
  );
  const text = document.getText(expandedRange);
  const formattedText = formatIndentation(separateEqualSign(text), true);
  return [new vscode.TextEdit(expandedRange, formattedText)];
};
