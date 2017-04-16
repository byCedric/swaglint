import { File } from './file';
import { Issue } from './issue';

export interface Validator {
	/** Get all validation issues from the file. */
	getIssues(file: File): Promise<Issue[]>;
}
