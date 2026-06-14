## Development

### Prerequisites

- Node.js
- Docker Desktop

---

### Start database (PostgreSQL)

Run database using Docker Compose:

```bash
docker compose up -d
```

Stop database:

```bash
docker compose down
```

---

### Install dependencies

```bash
npm install
```

---

### Run backend in development mode

```bash
npm run dev
```

Server should be available at:

```
http://localhost:3000
```

---

### Prisma Studio (database GUI)

Used to inspect and edit database data:

```bash
npx prisma studio
```

---

### Prisma migrations

Create and apply a new migration:

```bash
npx prisma migrate dev --name migration_name
```

Reset database (⚠️ deletes all data):

```bash
npx prisma migrate reset
```

---

### Generate Prisma Client

Run after schema changes if needed:

```bash
npx prisma generate
```