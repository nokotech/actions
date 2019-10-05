import * as core from '@actions/core';
import { latestReleases, deleteReleaseAssets, releaseAssets } from './api/github';

core.info('--------------------');
core.info('release.js');
core.info('--------------------');

const GITHUB_TOKEN = core.getInput('github-token') || '';
const OWNER = core.getInput('owner') || '';
const REPO = core.getInput('repo') || '';
const DIR = core.getInput('dir') || '';
const FILE = core.getInput('file') || '';
const CONTENT_TYPE = core.getInput('content-type') || '';

(async () => {
    core.info(`FILE: ${FILE}`);
    const result = await latestReleases(OWNER, REPO, GITHUB_TOKEN);
    core.info(`RELEASE_ID: ${result.id}`);
    for (const asset of result.assets) {
        if (asset.name == `${FILE}`) await deleteReleaseAssets(OWNER, REPO, GITHUB_TOKEN, FILE, asset.id);
    }
    await releaseAssets(OWNER, REPO, GITHUB_TOKEN, DIR, FILE, CONTENT_TYPE, result.id);
})();
