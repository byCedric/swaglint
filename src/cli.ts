import * as program from 'commander';
import { Linter } from './linter';

const concatStream = require('concat-stream');

program
	.version('0.0.1')
	.usage('<path> [options]')
	.option('--parser [parser]', 'The parser that creates the AST', 'yaml')
	.option('--reporter [formatter]', 'The reporter to view the issues with.', 'stylish')
	.option('--validator [validator]', 'The swagger validator', 'sway')
	.option('--stdin', 'If the linter should use STDIN instead of files')
	.option('--stdin-filename [name]', 'The filename to use when validating from STDIN')
	.parse(process.argv);

const linter = new Linter()
	.setParser(program.parser)
	.setReporter(program.reporter)
	.setValidator(program.validator);

if (program.stdin) {
	process.stdin.pipe(
		concatStream(
			{ encoding: 'string' },
			contents => {
				linter
					.addFile({ contents, path: program.stdinFilename || '<stream>' })
					.run(process.stdout);
			}
		)
	);
} else {
	for (const path of program.args) {
		linter.addFile({ path });
	}

	linter.run(process.stdout);
}
