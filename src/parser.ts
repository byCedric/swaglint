import { File } from './file';
import { Issue, IssueLocation } from './issue';

export interface Parser {
	/** Locate an issue within the document and return the exact location. */
	locateIssues(file: File, issues: Issue[]): Promise<Issue[]>;
}
