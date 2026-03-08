#!/bin/sh
set -e

host="$1"
port="$2"
shift 2

echo "Waiting for PostgreSQL at $host:$port..."

while ! nc -z "$host" "$port" 2>/dev/null; do
  sleep 1
done

echo "PostgreSQL is ready!"
exec "$@"
