# Staff Portal Scaffold

This folder is a standalone scaffold for `staff.sgcnr.net`.

It is now prepared for automatic deployment through the repo workflow.

## Files

- `index.html`
- `staff.css`
- `staff.js`
- `staff-gate-config.js`
- `staff-auth/`

## Staff database login

The staff portal now supports a real database-backed first login flow.

Included backend files:

- `staff-auth/bootstrap.php`
- `staff-auth/config.example.php`
- `staff-auth/schema.sql`
- `staff-auth/me.php`
- `staff-auth/login.php`
- `staff-auth/change-password.php`
- `staff-auth/logout.php`

Recommended production setup:

1. Copy `staff-auth/config.example.php` to `staff-auth/config.php`
2. Fill in the real database credentials
3. Run `staff-auth/schema.sql`
4. Create staff accounts in `staff_accounts`
5. For first-login accounts:
   - set `password_hash` to `password_hash(staff_id)`
   - set `password_reset_required = 1`
6. After first login the portal will automatically force the user to a password reset screen

Custom login note:

- each staff member signs in with the username stored in `staff_id` or the mapped username column
- passwords are checked against the configured password-hash column
- display name, clearance, and portal access are read from the mapped staff table columns
- this means you can fully control staff logins from your own database without Discord bot login replacing the staff password flow

Fallback:

- if the staff database backend is not configured yet, the portal falls back to `staff-gate-config.js`
- that fallback should only be temporary

## Existing table compatibility

The staff auth backend can also work with a simpler table like:

- `staff_id`
- `username`
- `password_hash`
- `is_temp_password`
- `last_login`
- `created_at`
- `updated_at`

Use `staff-auth/config.php` to map the backend to that structure:

- `staff_record_id_column = staff_id`
- `staff_username_column = username`
- `staff_password_hash_column = password_hash`
- `staff_password_reset_column = is_temp_password`
- `staff_last_login_column = last_login`

Optional richer fields such as display name, clearance, issued by, active, and portal access can be added later.

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

## Applications desk

The staff portal now also includes an `Applications` workspace with:

- shared application list
- status updates
- assignment controls
- private applicant / staff live chat

Backend files:

- `staff-auth/applications-bootstrap.php`
- `staff-auth/applications-list.php`
- `staff-auth/applications-detail.php`
- `staff-auth/applications-update.php`
- `staff-auth/applications-message.php`
- `staff-auth/applications-schema.sql`

Important setup note:

- the public website auth side and the staff portal must point at the same application tables
- if the main public auth DB and the staff DB are different, set `applications_mysql_dsn`, `applications_mysql_user`, and `applications_mysql_password` in both config files to the same shared database

Application permissions:

- `portal_access = app_review` lets a staff account open applications and reply in the applicant chat
- `portal_access = app_manage` lets a staff account review applications and also change status or assignment
- `portal_access = management` or `all`, or `clearance = Admin/Manager/Management`, also grants full application management access

## Auto deploy

The GitHub workflow can deploy this folder automatically to `staff.sgcnr.net`.

Required repository secrets:

- `ZAP_STAFF_FTP_USER`
- `ZAP_STAFF_FTP_PASS`

Recommended setup:

- create an additional FTP account in Plesk that is rooted directly to `staff.sgcnr.net`
- use that account only for the staff portal workflow

If those staff FTP secrets are missing, the staff deploy job is skipped and only the public website is deployed.
