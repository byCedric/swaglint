import * as program from 'commander';
import * as concatStream from 'concat-stream';
import { Linter } from './linter';

// tslint:disable-next-line no-var-requires
const pkg = require('../package.json');
const terminal = process.stdout;

program
	.version(pkg.version)
	.usage('<file ...> [options]')
	.option('-p, --parser [name]', 'Parser\'s [name] to locate issues within the source', 'yaml')
	.option('-r, --reporter [name]', 'Reporter\'s [name] to format and report all encountered issues', 'stylish')
	.option('-v, --validator [name]', 'Validator\'s [name] to validate the swagger syntax', 'sway')
	.option('--stdin', 'If the linter should use STDIN instead of files')
	.option('--stdin-filename [name]', 'The filename to use when validating from STDIN');

program.on('--help', () => {
	const lines = [
		'  Examples:',
		'',
		'    $ swaglint swagger.yml',
		'    $ swaglint partial.yml other.yml',
		'    $ cat cool-api.yml | swaglint --stdin',
		'',
	];

	lines.forEach(line => terminal.write(`${line}\n`));
});

program.parse(process.argv);

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
					.addFile({ contents, path: program.stdinFilename })
					.run(terminal)
					.catch(message => terminal.write(`${message}\n`));
			}
		)
	);
} else if (program.args.length) {
	for (const path of program.args) {
		linter.addFile({ path });
	}

	linter.run(terminal).catch(message => terminal.write(`${message}\n`));
} else {
	program.help();
}
