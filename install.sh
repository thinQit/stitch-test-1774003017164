#!/bin/bash
set -e
npm install
npx prisma generate

cat <<EOF
ProjectFlow installed.
- Run: npm run dev
- Health: http://localhost:3000/api/health
EOF
