/// <reference types="node" />
/// <reference types="mocha" />

import { readFileSync } from 'fs';
import { expect } from 'chai';

import { File } from '../src/file';

describe('File', () => {
	const files: any = {};
	const paths = {
		bitbucket: `${__dirname}/documents/bitbucket.yml`,
		github: `${__dirname}/documents/github.yml`,
	};

	before(() => {
		Object.keys(paths)
			.forEach(name => {
				files[name] = readFileSync(paths[name], 'utf8');
			});
	});

	describe('#getPath', () => {
		it('returns correct path', () => {
			const path = './some/random-path.yml';
			const file = new File({ path });

			expect(file.getPath()).to.be.equal(path);
		});

		it('returns something without path', () => {
			const file = new File({ path: '' });

			expect(file.getPath()).to.be.not.empty;
		});
	});

	describe('#getContents', () => {
		it('returns contents from path', () => {
			const file = new File({ path: paths.github });

			expect(file.getContents()).to.be.equal(files.github);
		});

		it('returns preloaded content', () => {
			const contents = files.github;
			const file = new File({ contents });

			expect(file.getContents()).to.be.equal(contents);
		});

		it('throws error without path and preloaded content', () => {
			const file = new File({ });

			expect(() => file.getContents()).to.throw(/not.*fetch.*file/i);
		});
	});

	describe('#isSwagger', () => {
		it('returns true for swagger documents', () => {
			[files.bitbucket, files.github]
				.map(contents => new File({ contents }))
				.forEach(file => expect(file.isSwagger()).to.be.ok);
		});

		it('returns false for non-swagger documents', () => {
			['random string', 'yaml: document']
				.map(contents => new File({ contents }))
				.forEach(file => expect(file.isSwagger()).to.be.not.ok);
		});
	});
});
