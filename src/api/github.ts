import * as core from '@actions/core';
import request from 'request';
import path from 'path';
import fs from 'fs';

export async function latestReleases(OWNER: string, REPO: string, GITHUB_TOKEN: string): Promise<any> {
    core.info(`>> latestReleases`);
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
                core.debug(body);
                core.info(`code: ${response.statusCode}`);
                const result = JSON.parse(body);
                if (!error && response.statusCode == 200) {
                    resolve(result);
                }
                core.info(`<< latestReleases`);
            },
        );
    });
}

export async function releaseAssets(
    OWNER: string,
    REPO: string,
    GITHUB_TOKEN: string,
    DIR: string,
    FILE: string,
    CONTENT_TYPE: string,
    RELEASE_ID: string,
): Promise<any> {
    core.info(`>> releaseAssets`);
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
                core.debug(body);
                core.info(`code: ${response.statusCode}`);
                const result = JSON.parse(body);
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
                core.info(`<< releaseAssets`);
            },
        );
    });
}

export async function deleteReleaseAssets(OWNER: string, REPO: string, GITHUB_TOKEN: string, FILE: string, ASSET_ID: string): Promise<any> {
    core.info(`>> deleteReleaseAssets`);
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
                core.info(`code: ${response.statusCode}`);
                if (!error && response.statusCode == 204) {
                    resolve('');
                }
                core.info(`<< deleteReleaseAssets`);
            },
        );
    });
}
