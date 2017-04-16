import { File, FileSource } from './file';
import { Parser } from './parser';
import { Reporter } from './reporter';
import { Validator } from './validator';

// export interface LinterOptions {
// 	parser: string;
// 	reporter: string;
// 	validator: string;
// }

export class Linter {
	/** The parser instance to analyse the source code with. */
	private parser: Parser;
	/** The reporter to use for reporting issues. */
	private reporter: Reporter;
	/** The syntax validator for the source code. */
	private validator: Validator;
	/** The files the linter needs to lint. */
	private files: File[] = [];

	/**
	 * Lint all files, report any issues and exit with a success or failure code.
	 */
	public async run(output: NodeJS.WritableStream): Promise<number> {
		let status = 0;

		for (const file of this.files) {
			const issues = await this.parser.locateIssues(file, await this.validator.getIssues(file));

			if (issues.length > 0) {
				status = 1;
				output.write(`${this.reporter.reportIssues(file, issues)}\n`);
			}
		}

		return status;
	}

	/**
	 * Add a (new) file, from file source, to the linter for validating.
	 */
	public addFile(source: FileSource): Linter {
		this.files.push(new File(source));

		return this;
	}

	/**
	 * Set the name of the parser to locate issues with.
	 * This will lazy load the parser and set it to this instance.
	 */
	public setParser(name: string): Linter {
		this.parser = this.createExternalModule(name, './parsers/');

		return this;
	}

	/**
	 * Set the reporter to use when reporting issues.
	 * This will lazy load the reporter and set it to this instance.
	 */
	public setReporter(name: string): Linter {
		this.reporter = this.createExternalModule(name, './reporters/');

		return this;
	}

	/**
	 * Set the validator to use when linting.
	 * This will lazy load the parser and set it to this instance.
	 */
	public setValidator(name: string): Linter {
		this.validator = this.createExternalModule(name, './validators/');

		return this;
	}

	/**
	 * Lazy load an external module and return the default export from that module.
	 */
	private createExternalModule(name: string, path: string = ''): any {
		const contents = require(`${path}${name}`);

		if (contents && contents.default) {
			return new contents.default();
		}

		throw new Error(`Could not initiate external module "${path}${name}".`);
	}
}
