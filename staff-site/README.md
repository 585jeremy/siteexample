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

Required repository secret:

- `ZAP_STAFF_SERVER_DIR`

That secret should point to the FTP directory used by the `staff.sgcnr.net` document root.

Example values depend on the hosting setup, such as:

- `./staff.sgcnr.net/`
- `./subdomains/staff/httpdocs/`

If that secret is missing, the staff deploy job is skipped and only the public website is deployed.
