# Experiments (Archived)

This folder contains two architectural experiments that were built before the deployed Next.js MVP.

## Why these were built
- Evaluate a Ruby/Sinatra backend with a lightweight ORM and Turso (libSQL).
- Test a hybrid stack: Next.js UI + Ruby API on Vercel.
- Compare developer speed, deployability, and reliability against a pure Next.js app.

## What was learned
- Sinatra is fast to iterate, but serverless Ruby on Vercel adds cold-start and bundling friction.
- The hybrid stack increased integration overhead (CORS, deploy config, proxy rewrites, env drift).
- Turso/libSQL worked well locally but added operational surface area for an MVP.

## Why they were not deployed
- Vercel serverless Ruby had longer cold starts and more brittle deployment setup.
- The hybrid approach required extra infra/config that slowed iteration.
- The local-first Next.js MVP was more reliable and easier to ship.

## Key technical takeaways
- Sinatra + Turso is viable, but the serverless Ruby runtime on Vercel is a constraint.
- Mixed-stack deployments raise complexity costs that can outweigh feature gains early on.
- A local-first MVP with a small serverless proxy is the fastest path to real user feedback.

## Contents
- `ruby/`: Sinatra + ERB experiment.
- `fullstack/`: Next.js UI + Sinatra API hybrid.
