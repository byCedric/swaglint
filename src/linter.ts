import { File, FileSource } from './file';
import { Issue } from './issue';
import { Parser } from './parser';
import { Reporter } from './reporter';
import { Validator } from './validator';

export interface LinterResult {
	/** The file that has been linted. */
	file: File;
	/** All issues encoutered within that file. */
	issues: Issue[];
}

export class Linter {
	/** The parser instance to analyse the source code with. */
	private parser: Parser;
	/** The reporter to use for reporting issues. */
	private reporter: Reporter;
	/** The syntax validator for the source code. */
	private validator: Validator;
	/** The files the linter needs to run over. */
	private files: File[] = [];

	/**
	 * Lint all files, report any issues and exit with a success or failure code.
	 */
	public run(output: NodeJS.WritableStream): Promise<LinterResult[]> {
		const { files, parser, reporter, validator } = this;
		const results: LinterResult[] = [];

		return new Promise((resolve, reject) => {
			if (!this.filesAreSwagger()) {
				reject(new Error('File(s) are not swagger documents'));
			}

			Promise
				.all(files.map(file => validator.getIssues(file)))
				.then(validateIssues => {
					Promise
						.all(files.map((file, index) => parser.locateIssues(file, validateIssues[index])))
						.then(locatedIssues => {
							files.forEach((file, index) => {
								const issues = locatedIssues[index];

								if (issues.length > 0) {
									output.write(`${reporter.reportIssues(file, issues)}\n`);
								}

								results.push({ file, issues });
							});

							resolve(results);
						})
						.catch(reject);
				})
				.catch(reject);
		});
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

	/**
	 * Determine if all files are swagger.
	 */
	private filesAreSwagger(): boolean {
		return this.files.every(file => file.isSwagger());
	}
}
