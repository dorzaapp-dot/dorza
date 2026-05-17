# 20260517 — Add GitHub secrets for markdown export

## What this enables

When a client submits the onboarding form, `onboard-submit` pushes their
intake markdown to a GitHub repo as a file under `outputs/`. This creates
a permanent, version-controlled record of each brief without needing manual
downloads from Supabase.

## Secrets to add

Supabase Dashboard → Edge Functions → `onboard-submit` → Secrets tab:

| Secret | Value |
|--------|-------|
| `GITHUB_TOKEN` | Personal access token with `repo` scope (fine-grained or classic) |
| `GITHUB_OWNER` | GitHub username or org that owns the target repo |
| `GITHUB_REPO` | Repository name (e.g. `dorza-briefs`) |
| `GITHUB_BRANCH` | Branch to commit to — defaults to `main` if not set |
| `GITHUB_EXPORT_DIR` | Folder path inside the repo — defaults to `outputs` if not set |

## How to create the GitHub token

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
2. Set **Resource owner** to the account/org that owns the repo
3. Set **Repository access** → Only select repositories → pick the target repo
4. Under **Permissions** → Contents → **Read and write**
5. Generate and copy the token — paste it as `GITHUB_TOKEN`

## Behaviour

- If any of `GITHUB_TOKEN`, `GITHUB_OWNER`, or `GITHUB_REPO` are missing, the push is skipped with a warning log — the submission still succeeds.
- Files are written to `{GITHUB_EXPORT_DIR}/user-profile-{id}-{timestamp}.md`
- The commit message is: `Add user profile markdown export: {businessName} ({id})`
