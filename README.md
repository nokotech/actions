# actions

## Releases Actions

```
jobs:
  XXXXX:
    steps:

      .
      .
      .

      - name: Latest Publish
        uses: nokotech/actions/release@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          owner: <<owner>>
          repo: <<repository>>
          dir: <<upload file path>>
          file: <<upload file name>>
          content-type: application/xxx
```
