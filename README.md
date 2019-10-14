# actions

[![Node+CI](https://github.com/nokotech/actions/workflows/Node%20CI/badge.svg)](https://github.com/nokotech/actions/actions?workflow=Node+CI)
[![codecov](https://codecov.io/gh/nokotech/actions/branch/master/graph/badge.svg)](https://codecov.io/gh/nokotech/actions)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nokotech/actions/blob/master/LICENSE)


## Releases Actions

```
jobs:
  XXXXX:
    steps:

      .
      .
      .

      - name: Latest Publish
        uses: nokotech/actions/release@release
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          owner: <<owner>>
          repo: <<repository>>
          dir: <<upload file path>>
          file: <<upload file name>>
          content-type: application/xxx
```
