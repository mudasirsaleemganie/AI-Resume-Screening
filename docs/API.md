# API summary

Base URL: `/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create candidate account |
| POST | `/auth/login` | Public | Sign in |
| GET | `/auth/me` | Authenticated | Current user |
| GET | `/jobs` | Public/authenticated | List open or managed jobs |
| GET | `/jobs/:id` | Public/authenticated | Job details |
| POST | `/jobs` | Recruiter/Admin | Create job |
| PATCH | `/jobs/:id` | Owner/Admin | Update job |
| POST | `/applications/:jobId` | Candidate | Upload and screen resume |
| GET | `/applications/mine` | Candidate | Candidate applications |
| GET | `/applications/job/:jobId` | Owner/Admin | Ranked applicants |
| PATCH | `/applications/:id/status` | Owner/Admin | Human decision/status |
| GET | `/admin/analytics` | Admin | Platform analytics |
| GET | `/admin/users` | Admin | User list |
| PATCH | `/admin/users/:id` | Admin | Role/account management |
| GET | `/admin/audit` | Admin | Recent audit events |

Authenticated endpoints use:

```http
Authorization: Bearer <jwt>
```

Resume upload uses `multipart/form-data` with the field name `resume`.

