import { create as createSway } from 'sway';
import { load as loadYaml } from 'yaml-js';
import { File } from '../file';
import { Issue, IssueType } from '../issue';
import { Validator } from '../validator';

interface NestableIssue extends Issue {
	/** The nested children issues of this issue with in depth details. */
	children?: NestableIssue[];
}

export default class SwayValidator implements Validator {
	/**
	 * @inheritdoc
	 */
	public getIssues(file: File): Promise<Issue[]> {
		return new Promise((resolve, reject) => {
			createSway({ definition: this.createDocument(file) })
				.then(sway => {
					const { errors, warnings } = sway.validate();
					const issues = [].concat(
						errors.map(entry => this.issueFromEntry('error', entry)),
						warnings.map(entry => this.issueFromEntry('warning', entry)),
					);

					resolve(this.flattenNestedIssues(issues));
				})
				.catch(reject);
		});
	}

	/**
	 * Create a new plain object from the file's contents.
	 */
	private createDocument(file: File): any {
		return loadYaml(file.getContents());
	}

	/**
	 * Create an issue object from the encountered sway validation entry.
	 */
	private issueFromEntry(type: IssueType, entry: any, parent?: NestableIssue): NestableIssue {
		const issue: NestableIssue = {
			message: entry.message,
			path: entry.path,
			slug: `SWAY_${entry.code}`,
			type,
		};

		if (parent && parent.path.length) {
			issue.path = this.mergeParentPath(parent.path, issue.path);
		}

		if (entry.params && entry.params.length) {
			issue.values = entry.params;
		}

		if (entry.inner && entry.inner.length) {
			issue.children = this.filterExcessiveIssues(
				entry.inner.map(innerEntry => this.issueFromEntry(type, innerEntry, issue))
			);
		}

		return issue;
	}

	/**
	 * Merge the parent and child issue path to create an absolute reference to the issue.
	 */
	private mergeParentPath(parentPath: string[], childPath: string[]): string[] {
		const path: string[] = parentPath.slice();

		childPath.forEach((segment, i) => {
			if (path[i] !== segment) {
				path.push(segment);
			}
		});

		return path;
	}

	/**
	 * Get a list of all unique issues from the issue list.
	 * Sway has a tendency to overreact to JSON schema failures, so we **SHOULD** filter them.
	 */
	private filterExcessiveIssues(issues: Issue[]): Issue[] {
		const unique: Issue[] = [];
		const isEqualFactory = (issue: Issue) => (
			(compareIssue: Issue) => {
				const issueValues = issue.values || [];
				const compareValues = compareIssue.values || [];

				return issue !== compareIssue
					&& issue.type === compareIssue.type
					&& issue.slug === compareIssue.slug
					&& issue.path.toString() === compareIssue.path.toString()
					&& issueValues.toString() === compareValues.toString();
			}
		);

		issues.forEach(issue => {
			if (!unique.find(isEqualFactory(issue))) {
				unique.push(issue);
			}
		});

		return unique;
	}

	/**
	 * Flatten the nestable issues to a flat issue array.
	 */
	private flattenNestedIssues(nestedIssues: NestableIssue[]): Issue[] {
		let issues: Issue[] = [];

		nestedIssues.forEach(issue => {
			issues.push(issue);

			if (issue.children && issue.children.length) {
				issues = issues.concat(this.flattenNestedIssues(issue.children));
			}

			delete issue.children;
		});

		return issues;
	}
}
