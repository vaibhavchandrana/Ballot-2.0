#!/bin/sh

# Apply database migrations
echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the server
echo "Starting server..."
# exec "$@"
python3 manage.py runserver 0.0.0.0:8000