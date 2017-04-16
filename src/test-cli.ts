import { File } from './file';
import YamlParser from './parsers/yaml';
import SwayValidator from './validators/sway';
import StylishReporter from './reporters/stylish';
import CompactReporter from './reporters/compact';
import JsonReporter from './reporters/json';

import { inspect } from 'util';

const parser = new YamlParser();
const validator = new SwayValidator();
const stylish = new StylishReporter();
const compact = new CompactReporter();
const json = new JsonReporter();
const file = new File({ path: __dirname + '/../definitions/errors.yml' });

(async () => {
	const issues = await parser.locateIssues(file, await validator.getIssues(file));

	console.log(stylish.reportIssues(file, issues));
	console.log(compact.reportIssues(file, issues));
	console.log(json.reportIssues(file, issues));
})();
