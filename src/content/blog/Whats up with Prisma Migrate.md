---
title: "Whats up with Prisma Migrate"
description: "A breakdown of common issues and practical solutions when working with Prisma Migrate in your development workflow."
pubDate: "March 20 2024"
---

I've taken a liking to [Prisma's migrate tool](https://www.prisma.io/docs/orm/prisma-migrate/getting-started) for my database migration needs, mostly because I still need to take the time to learn SQL beyond the basics. It's embarrassing, really.

## Why Choose Prisma for Database Migrations?

One of the reasons I've gravitated towards Prisma is its versatility; it's not actually limited to Node.js environments (like one might assume when reading the [Prisma Documentation](https://www.prisma.io/docs/orm/overview/prisma-in-your-stack/)), which makes it a flexible choice for various development contexts (for me, that's currently Golang).

I want to document how I've been utilizing Prisma's CLI to manage migrations in Postgres, which, thanks to Prisma, would be the same in SQLite and other relational databases.

## Working with the Prisma CLI

Okay, to initiate a project with Prisma and prepare for migrations, begin by executing the `npx prisma init` command. This sets the foundation for your project and generates the necessary files, including the `prisma` directory and the `schema.prisma` file.

```shell
npx prisma init
```

### Setting Up Your Database Connection

In addition to generating the `prisma/schema.prisma` file, this should auto-generate the `DATABASE_URL` environment variable in your project `.env` file if it exists; if not, one will be created.

You could update the `DATABASE_URL` to match your database values. We'll need them to work with the `prisma/schema.prisma` file.

We can run `prisma db pull` to automatically generate the Prisma schema. This generates the Prisma schema and automatically provides a comprehensive representation of your existing database structure, which is particularly useful for populated databases.

This is also a solid way to confirm the connection to your database. Prisma might not catch your `.env` file if you see database connection errors. You should figure it out because you won't be able to proceed without a connection to your database.

### Generating a Prisma Schema

```shell
npx prisma db pull
```

### Updating the Schema

We want to update the schema, which is a natural next step. A chunk of code creates a new post table with Prisma's universal syntax.

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String
  published Boolean  @default(false)
  slug      String   @unique
}
```

### Creating a Baseline Migration

Did someone say margaritas? Oh, migrations—yeah, that's cool, too. Applying updates to a database is straightforward with Prisma. You can specify a migration name directly in the command _or_ provide one when prompted. The first migration is referred to as the [baseline migration](https://www.prisma.io/docs/orm/prisma-migrate/getting-started#create-a-baseline-migration), and generally speaking, it's a good idea to give it a name that reflects this.

```shell
$ npx prisma migrate dev --name init

Applying migration `20240320191421_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240320191421_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.11.0) to ./node_modules/@prisma/client in 51ms
```

> Note I'm currently focused on development commands, as there are [additional considerations when working in production databases](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production). The TLDR for that link requires an understanding of the core philosophies behind Prisma. The development commands we're running are applying changes to a [shadow database](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database)

So here we're creating a migration with the name `init`, the migration name is up to you. Once complete, there should be some auto-generated SQL files in the `prisma/migrations` folder that correspond to the changes you've made in your `schema.prisma` file.

> Theres alot more CLI options in this command, an insightful help menu can be observerd by running the following command.
>
> ```shell
> npx prisma migrate --help
> ```

After running the migration, Prisma updates your database schema to match the schema defined in `schema.prisma`. This is where the magic happens—your database now has a new table called `Post` with the fields you defined: `id`, `createdAt`, `updatedAt`, `title`, `content`, `published`, and `slug`.

### Reviewing the SQL

How about that actual SQL though, huh?

```sql
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
```

Not bad. The SQL is pretty straightforward, and I thank Prisma for doing the heavy lifting here.

Prisma is not in any entreprisey code I'm working in; but I could imagine as the code-base scales; scenarios would arise where manual adjustments may need to be made to these auto generated migrations, so these should be reviewed but really that's cool. I've been using it as a way to familiarizing myself with the more advanced SQL syntax.

### Iterating on a Schema

The intial migration always feels great, but doesn't cover the complexities of mangaging and iterating on a database over time. I don't care to cover much here, but let's atleast apply another migration to the schema to see how Prisma handles this.

Consider a scenario where you wish to enhance your `Post` model by tracking the views each post receives. This can be achieved by adding a `views` field to your schema.

```diff
model Post {
	id String @id @default(uuid())
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
	title String
	content String
	published Boolean @default(false)
	slug String @unique
+	views Int @default(0)
}
```

Then, run the migration command, this time with an additional `--create-only` flag. The create only flag specifics that the the migration file should be created; but Prisma won't actually apply the migration.

```shell
$ npx prisma migrate dev --name add-views-to-post --create-only

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "railway", schema "public" at "monorail.proxy.rlwy.net:56681"

Prisma Migrate created the following migration without applying it 20240321123742_add_views_to_post

You can now edit it and apply it by running prisma migrate dev.
```

This command is slick because it provides the ability to customize or manually review changes before actually applying them. A nice subtly from Prisma here is the next steps they provide at the end of this output. `You can now edit it and apply it by running prisma migrate dev.`

So let's say our SQL is as expected.

```sql
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
```

And now we want to apply these changes to the development environment. We'll want to specific which environment when running this command; if no environment is passed, a helpful menu output will present itself. Otherwise, we should see an output similar to the one below.

```shell
$ npx prisma migrate dev

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "railway", schema "public" at "monorail.proxy.rlwy.net:56681"

Applying migration `20240321123742_add_views_to_post`

The following migration(s) have been applied:

migrations/
  └─ 20240321123742_add_views_to_post/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.11.0) to ./node_modules/@prisma/client in 94ms
```

This is the kind of workflow I've integrated into my Golang server. It's cool to me because it's a complete stand alone part of my project.

If you'd like to do the same and are wondering where to head next, check out some of these quick notes - [Connect Postgres to Go](articles/connect-to-postgresql-with-golang) and [How to Create a Postgres Instance on Railway](articles/how-to-create-a-postgresql-instance-in-railway).
