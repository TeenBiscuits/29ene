# Issue tracker

Issues and specs live in GitHub Issues for TeenBiscuits/29ene.
Use the gh CLI from this clone.

## Operations

- Create: `gh issue create --title "..." --body-file <file>`
- Read with discussion: `gh issue view <number> --comments`
- Read labels: `gh issue view <number> --json labels`
- List: `gh issue list --state open --json number,title,body,labels`
- Comment: `gh issue comment <number> --body-file <file>`
- Apply labels: `gh issue edit <number> --add-label "..."`
- Remove labels: `gh issue edit <number> --remove-label "..."`
- Close: `gh issue close <number> --comment "..."`

Write multiline bodies to a file and pass --body-file.
Use --repo TeenBiscuits/29ene when running outside this clone.

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", read the issue and its comments.

## Pull requests

PRs as a request surface: no.
