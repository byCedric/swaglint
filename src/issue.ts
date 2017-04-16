/** The weight or severity of the issue. */
export type IssueType = 'error' | 'warning';

export interface IssueLocation {
	/** The line of the issue within the document, starting from 1 */
	line: number;
	/** The column of the issue within the document, starting from 1 */
	column: number;
}

/**
 * An issue represents a single error or warning encountered in the document.
 * This **MUST** have a basic description about the issue, e.g. slug/message/path.
 * Also it **SHOULD** contain information about the exact location in the document.
 */
export interface Issue {
	/** The type of the issue, e.g. just a warning or serious error. */
	type: IssueType;
	/** A name or slug of the issue. */
	slug: string;
	/** A human readable string containing information about the issue. */
	message: string;
	/** A flat array containing the path of the issue in the document, **MUST** be absolute. */
	path: string[];
	/** A flat array containing the values used inside the issue in the document. */
	values?: string[];
	/** The location of the issue within the document, if resolved. */
	location?: IssueLocation;
}
