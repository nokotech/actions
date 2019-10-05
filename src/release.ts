import * as core from '@actions/core';
import request from 'request';
import path from 'path';
import fs from 'fs';

const GITHUB_TOKEN = core.getInput('github-token') || '';
const OWNER = core.getInput('owner') || '';
const REPO = core.getInput('repo') || '';
const DIR = core.getInput('dir') || '';
const FILE = core.getInput('file') || '';
const CONTENT_TYPE = core.getInput('content-type') || '';

async function latestReleases(): Promise<any> {
    return new Promise(resolve => {
        request(
            {
                url: `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'User-Agent': 'CI',
                },
            },
            (error, response, body) => {
                const result = JSON.parse(body);
                core.debug(`body: ${result}`);
                core.debug(`code: ${response.statusCode}`);
                if (!error && response.statusCode == 200) {
                    resolve(result);
                }
            },
        );
    });
}

async function releaseAssets(RELEASE_ID): Promise<any> {
    return new Promise(resolve => {
        request(
            {
                url: `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${RELEASE_ID}/assets?name=${FILE}`,
                method: 'POST',
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'Content-Type': CONTENT_TYPE,
                },
                body: fs.readFileSync(path.join(DIR, FILE)),
            },
            (error, response, body) => {
                const result = JSON.parse(body);
                core.debug(`body: ${result}`);
                core.debug(`code: ${response.statusCode}`);
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
            },
        );
    });
}

async function deleteReleaseAssets(ASSET_ID): Promise<any> {
    return new Promise(resolve => {
        request(
            {
                url: `https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${ASSET_ID}`,
                method: 'DELETE',
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'User-Agent': 'CI',
                },
            },
            (error, response, body) => {
                const result = JSON.parse(body);
                core.debug(`body: ${result}`);
                core.debug(`code: ${response.statusCode}`);
                if (!error && response.statusCode == 204) {
                    resolve('');
                }
            },
        );
    });
}

(async () => {
    core.debug(FILE);
    const result = await latestReleases();
    core.debug(`RELEASE_ID: result.id`);
    for (const asset of result.assets) {
        if (asset.name == `${FILE}`) await deleteReleaseAssets(asset.id);
    }
    await releaseAssets(result.id);
})();
