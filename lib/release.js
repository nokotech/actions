"use strict";
const request = require('request');
const fs = require('fs');
const path = require('path');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.OWNER;
const REPO = process.env.REPO;
const DIR = process.env.DIR;
const FILE = process.env.FILE;
const CONTENT_TYPE = process.env.CONTENT_TYPE;
async function latestReleases() {
    return new Promise(resolve => {
        request({
            url: `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'User-Agent': 'CI',
            },
        }, (error, response, body) => {
            const result = JSON.parse(body);
            // console.log('body: ', result);
            console.log('code: ', response.statusCode);
            if (!error && response.statusCode == 200) {
                resolve(result);
            }
        });
    });
}
async function releaseAssets(RELEASE_ID) {
    return new Promise(resolve => {
        request({
            url: `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${RELEASE_ID}/assets?name=${FILE}`,
            method: 'POST',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': CONTENT_TYPE,
            },
            body: fs.readFileSync(path.join(DIR, FILE)),
        }, (error, response, body) => {
            const result = JSON.parse(body);
            // console.log('body: ', result);
            console.log('code: ', response.statusCode);
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
        });
    });
}
async function deleteReleaseAssets(ASSET_ID) {
    return new Promise(resolve => {
        request({
            url: `https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${ASSET_ID}`,
            method: 'DELETE',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'User-Agent': 'CI',
            },
        }, (error, response, body) => {
            // const result = JSON.parse(body);
            console.log('code: ', response.statusCode);
            if (!error && response.statusCode == 204) {
                resolve('');
            }
        });
    });
}
(async () => {
    console.log(FILE);
    const result = await latestReleases();
    console.log('RELEASE_ID', result.id);
    for (const asset of result.assets) {
        if (asset.name == `${FILE}`)
            await deleteReleaseAssets(asset.id);
    }
    await releaseAssets(result.id);
})();
