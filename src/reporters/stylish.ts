import * as chalk from 'chalk';
import * as table from 'text-table';
import { File } from '../file';
import { Issue, IssueLocation } from '../issue';
import { Reporter } from '../reporter';

export default class StylishReporter implements Reporter {
	/**
	 * @inheritdoc
	 */
	public reportIssues(file: File, issues: Issue[]): string {
		const header = this.headerFromFile(file);
		const table = this.correctIssueLocations(
			this.tableFromRows(
				issues.map(issue => this.rowFromIssue(issue))
			)
		);

		return `\n${header}\n${table}\n`;
	}

	private headerFromFile(file: File): string {
		return chalk.underline(file.getPath());
	}

	private issueTypeColor(issue: Issue): any {
		if (issue.type === 'warning') {
			return chalk.yellow;
		}

		return chalk.red;
	}

	private rowFromIssue(issue: Issue): string[] {
		return [
			'',
			String(issue.location ? issue.location.line : 0),
			String(issue.location ? issue.location.column : 0),
			this.issueTypeColor(issue)(issue.type.toLowerCase()),
			issue.message,
			chalk.dim(issue.slug.toLowerCase()),
		];
	}

	private tableFromRows(rows: string[][]): string {
		return table(rows, {
			align: ['', 'r', 'l', 'l', 'l', 'l'],
			stringLength: value => chalk.stripColor(value).length,
		});
	}

	private correctIssueLocations(table: string): string {
		return table.split('\n')
			.map(row => row.replace(
				/(\d+)\s+(\d+)/,
				(match, line, column) => chalk.dim(`${line}:${column}`)
			))
			.join('\n');
	}
}
