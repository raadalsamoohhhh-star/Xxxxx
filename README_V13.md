# دعوتي برو V13 — Template System

V13 adds a managed template registry and admin template management UI.

## Added
- `data/templates.json`: server-side template catalog.
- `/admin/templates`: manage visibility, featured status, name and category.
- `/api/admin/templates`: GET/PATCH registry API.
- Template-specific supported sections are enforced in the editor.
- Existing templates share the same invitation data model while allowing per-template section capabilities.

## Important
Admin authentication remains demo-level in this project. The registry is file-backed for local development and should move to PostgreSQL/Prisma before production.
