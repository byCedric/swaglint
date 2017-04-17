import { File } from '../file';
import { Issue, IssueLocation } from '../issue';
import { Reporter } from '../reporter';

export default class CompactReporter implements Reporter {
	/**
	 * @inheritdoc
	 */
	public reportIssues(file: File, issues: Issue[]): string {
		return issues.map(issue => this.rowFromIssue(file, issue)).join('\n');
	}

	/**
	 * Get a simple formatted string that represents a single issue.
	 */
	private rowFromIssue(file: File, issue: Issue): string {
		const path = file.getPath();
		const type = issue.type.toLowerCase();
		const slug = issue.slug.toLowerCase();
		const line = issue.location ? issue.location.line : 0;
		const column = issue.location ? issue.location.column : 0;

		return `${path}: ${type} @ ${line}:${column} - ${issue.message} (${slug})`;
	}
}
