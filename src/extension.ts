// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscodetk" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscodetk.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscodetk!');
	});

	const insertPrintStatement = (mode: 'repr' | 'urepr') => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document;
		const selection = editor.selection;
		const position = selection.active;
		const wordRange = document.getWordRangeAtPosition(position);
		if (!wordRange) {
			vscode.window.showErrorMessage('No word found under cursor');
			return;
		}

		const word = document.getText(wordRange);
		const filetype = document.languageId;
		const lineText = document.lineAt(position.line).text;
		const indentMatch = lineText.match(/^(\s*)/);
		const indent = indentMatch ? indentMatch[1] : '';

		let statement: string;
		if (filetype === 'python') {
			if (mode === 'urepr') {
				statement = `print(f'${word} = {ub.urepr(${word}, nl=1)}')`;
			} else {
				statement = `print(f'${word} = {${word}}')`;
			}
		} else if (filetype === 'shellscript' || filetype === 'sh') {
			statement = `echo "${word} = $${word}"`;
		} else if (filetype === 'cpp' || filetype === 'c' || filetype === 'c++') {
			statement = `std::cout << "${word} = " << ${word} << std::endl;`;
		} else if (filetype === 'cmake') {
			// statement = `message(STATUS "${word} = ${{${word}}}")`;
			statement = 'broken';
		} else if (filetype === 'javascript' || filetype === 'typescript') {
			statement = `console.log("${word} = ", ${word});`;
		} else {
			statement = `// print ${word}`;
		}

		const insertPosition = new vscode.Position(position.line + 1, 0);
		editor.edit(editBuilder => {
			editBuilder.insert(insertPosition, indent + statement + '\n');
		});
	};
  
    const reprCmd = vscode.commands.registerCommand('vscodetk.insertPrintVarRepr', () => insertPrintStatement('repr'));
    const ureprCmd = vscode.commands.registerCommand('vscodetk.insertPrintVarUrepr', () => insertPrintStatement('urepr'));

    context.subscriptions.push(reprCmd, ureprCmd);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }


