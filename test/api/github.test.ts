import nock from 'nock';
import * as github from '../../src/api/github';

describe('release.js', () => {
    it('latestReleases success', async () => {
        nock('https://api.github.com/')
            .get('/repos/OWNER/REPO/releases/latest')
            .reply(200, {});
        await github.latestReleases('OWNER', 'REPO', '');
    });

    it('releaseAssets success', async () => {
        nock('https://uploads.github.com')
            .post('/repos/OWNER/REPO/releases/RELEASE_ID/assets?name=README.md')
            .reply(200, {});
        await github.releaseAssets('OWNER', 'REPO', '', '', 'README.md', '', 'RELEASE_ID');
    });

    it('deleteReleaseAssets success', async () => {
        nock('https://api.github.com/')
            .delete('/repos/OWNER/REPO/releases/assets/ASSET_ID')
            .reply(204, {});
        await github.deleteReleaseAssets('OWNER', 'REPO', '', '', 'ASSET_ID');
    });
});
