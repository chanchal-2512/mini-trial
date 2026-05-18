FROM python:3.9-slim

# Create and switch to workspace directory
WORKDIR /app

# Copy all project static pages, JSON datastores, and server scripts
COPY . .

# Match the fallback port specified in your server code
EXPOSE 8000

# Execute the application
CMD ["python", "server.py"]