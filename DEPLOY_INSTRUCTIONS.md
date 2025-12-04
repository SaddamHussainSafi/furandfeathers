# Deployment Instructions

## 1. Backend Deployment

The backend is a Spring Boot application packaged as a JAR file.

### Prerequisites
- Java 17 installed (`java -version`)
- MySQL Database running
- `uploads/` directory exists and is writable

### Steps
1.  **Copy Artifact**: Move `backend/target/backend-0.0.1-SNAPSHOT.jar` to your server.
2.  **Create Uploads Directory**: Ensure an `uploads` folder exists in the same directory where you run the JAR.
    ```bash
    mkdir uploads
    ```
3.  **Run the Application**:
    ```bash
    java -jar backend-0.0.1-SNAPSHOT.jar
    ```
    *Note: For production, run this as a system service (Systemd) or use `nohup`.*

## 2. Frontend Deployment

The frontend is a React application built with Vite.

### Steps
1.  **Copy Artifacts**: Copy the contents of `frontend/dist/` to your web server's root directory (e.g., `/var/www/html`).
2.  **Configure Web Server**: You need a web server (like Nginx or Apache) to serve these static files and proxy API requests to the backend.

## 3. Nginx Configuration (Reverse Proxy)

Configure Nginx to serve the frontend and forward `/api` requests to the backend running on port 8080.

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html; # Path to frontend/dist content
    index index.html;

    # Serve Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API to Backend
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Serve Uploaded Files
    location /uploads {
        proxy_pass http://127.0.0.1:8080;
        # Or serve directly if they are on the same disk:
        # alias /path/to/backend/uploads;
    }
}
```

## 4. Verification
1.  Navigate to your domain.
2.  Login with Google.
3.  Check `/api/pets/my-pets` (should return 200 OK).
4.  Upload a pet image and verify it loads.
