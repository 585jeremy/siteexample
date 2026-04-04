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

## Auto deploy

The GitHub workflow can deploy this folder automatically to `staff.sgcnr.net`.

Required repository secrets:

- `ZAP_STAFF_FTP_USER`
- `ZAP_STAFF_FTP_PASS`

Recommended setup:

- create an additional FTP account in Plesk that is rooted directly to `staff.sgcnr.net`
- use that account only for the staff portal workflow

If those staff FTP secrets are missing, the staff deploy job is skipped and only the public website is deployed.
