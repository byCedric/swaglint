import { File } from './file';
import { Issue } from './issue';

export interface Reporter {
	/** Convert all the file's issues to a understandable formatted string. */
	reportIssues(file: File, issues: Issue[]): string;
}
