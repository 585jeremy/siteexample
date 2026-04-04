# Staff Portal Scaffold

This folder is a standalone scaffold for `staff.sgcnr.net`.

It is now prepared for automatic deployment through the repo workflow.

## Files

- `index.html`
- `staff.css`
- `staff.js`

## Included teams

- Management Team
- Admin Team
- Moderation Team
- Development Team
- Testing Team
- Translation Team
- Helper Team
- Security Team
- Content Creator Team
- Social Team

## Auto deploy

The GitHub workflow can deploy this folder automatically to `staff.sgcnr.net`.

Required repository secrets:

- `ZAP_STAFF_FTP_USER`
- `ZAP_STAFF_FTP_PASS`

Recommended setup:

- create an additional FTP account in Plesk that is rooted directly to `staff.sgcnr.net`
- use that account only for the staff portal workflow

If those staff FTP secrets are missing, the staff deploy job is skipped and only the public website is deployed.
