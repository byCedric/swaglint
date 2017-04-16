import { compose as composeYaml } from 'yaml-js';
import { File } from '../file';
import { Issue, IssueLocation } from '../issue';
import { Parser } from '../parser';

const tagTypes = {
	dictionary: 'tag:yaml.org,2002:map',
	list: 'tag:yaml.org,2002:seq',
};

export default class YamlParser implements Parser {
	/**
	 * @inheritdoc
	 */
	public async locateIssues(file: File, issues: Issue[]): Promise<Issue[]> {
		const tree = this.createTree(file);

		return issues.map(
			issue => this.resolveLocation(issue, tree)
		);
	}

	/**
	 * Create a new abstract syntax tree from the file's contents.
	 */
	private createTree(file: File): any {
		return composeYaml(file.getContents());
	}

	/**
	 * Try to find the issue within the abstract syntax tree.
	 * If an exact location was found, the location **MUST** be attached to the issue.
	 */
	private resolveLocation(issue: Issue, node: any): Issue {
		const location = this.findIssueInTree(issue, issue.path, node);

		if (location) {
			issue.location = location;
		}

		return issue;
	}

	/**
	 * Try to locate the encountered issue within the document using the YAML AST.
	 * This is heavily inspired by the Atom Linter Swagger project.
	 *
	 * @see https://github.com/AtomLinter/linter-swagger
	 */
	private findIssueInTree(issue: Issue, path: string[], node: any): IssueLocation | undefined {
		if (node.tag === tagTypes.list) {
			const childNode = node.value[path[0]];

			if (childNode) {
				path.shift();

				return this.findIssueInTree(issue, path, childNode);
			}
		}

		if (node.tag === tagTypes.dictionary) {
			for (const [keyNode, valueNode] of node.value) {
				if (keyNode.value === path[0]) {
					path.shift();

					if (path.length) {
						return this.findIssueInTree(issue, path, valueNode);
					}

					if (issue.values && issue.values.length) {
						return this.locationFromTree(valueNode);
					} else {
						return this.locationFromTree(keyNode);
					}
				}
			}
		}

		if (!path.length && node) {
			return this.locationFromTree(node);
		}

		return undefined;
	}

	/**
	 * Get the exact issue location from a single YAML AST node.
	 */
	private locationFromTree(node: any): IssueLocation {
		return {
			column: node.start_mark.column + 1,
			line: node.start_mark.line + 1,
		};
	}
}
