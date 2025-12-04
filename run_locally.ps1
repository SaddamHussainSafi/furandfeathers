# Start Backend
Write-Host "Starting Backend..."
Start-Process -FilePath "java" -ArgumentList "-jar", "backend\target\backend-0.0.1-SNAPSHOT.jar" -WorkingDirectory "backend" -NoNewWindow

# Note: Frontend is static. In production, serve 'frontend/dist' with Nginx.
# For local testing of the production build, you can use 'serve':
# npx serve -s frontend/dist
