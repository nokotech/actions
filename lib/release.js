"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const request_1 = __importDefault(require("request"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const GITHUB_TOKEN = core.getInput('github-token') || '';
const OWNER = core.getInput('owner') || '';
const REPO = core.getInput('repo') || '';
const DIR = core.getInput('dir') || '';
const FILE = core.getInput('file') || '';
const CONTENT_TYPE = core.getInput('content-type') || '';
async function latestReleases() {
    return new Promise(resolve => {
        request_1.default({
            url: `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'User-Agent': 'CI',
            },
        }, (error, response, body) => {
            const result = JSON.parse(body);
            core.debug(`body: ${result}`);
            core.debug(`code: ${response.statusCode}`);
            if (!error && response.statusCode == 200) {
                resolve(result);
            }
        });
    });
}
async function releaseAssets(RELEASE_ID) {
    return new Promise(resolve => {
        request_1.default({
            url: `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${RELEASE_ID}/assets?name=${FILE}`,
            method: 'POST',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': CONTENT_TYPE,
            },
            body: fs_1.default.readFileSync(path_1.default.join(DIR, FILE)),
        }, (error, response, body) => {
            const result = JSON.parse(body);
            core.debug(`body: ${result}`);
            core.debug(`code: ${response.statusCode}`);
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
        });
    });
}
async function deleteReleaseAssets(ASSET_ID) {
    return new Promise(resolve => {
        request_1.default({
            url: `https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${ASSET_ID}`,
            method: 'DELETE',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'User-Agent': 'CI',
            },
        }, (error, response, body) => {
            const result = JSON.parse(body);
            core.debug(`body: ${result}`);
            core.debug(`code: ${response.statusCode}`);
            if (!error && response.statusCode == 204) {
                resolve('');
            }
        });
    });
}
(async () => {
    core.debug(FILE);
    const result = await latestReleases();
    core.debug('RELEASE_ID', result.id);
    for (const asset of result.assets) {
        if (asset.name == `${FILE}`)
            await deleteReleaseAssets(asset.id);
    }
    await releaseAssets(result.id);
})();
