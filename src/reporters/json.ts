import { File } from '../file';
import { Issue, IssueLocation } from '../issue';
import { Reporter } from '../reporter';

export default class JsonReporter implements Reporter {
	/**
	 * @inheritdoc
	 */
	public reportIssues(file: File, issues: Issue[]): string {
		return JSON.stringify({ file, issues });
	}
}
