# Pet Adoption Network - AI Coding Guidelines

## Project Overview
Full-stack pet adoption platform with Spring Boot backend (Java 17) and React frontend (Vite). Supports role-based access for adopters, shelters, and admins with JWT authentication and Google OAuth.

## Architecture
- **Backend**: REST API under `/api` prefix, JPA entities (Pet, User), services for business logic, CORS enabled for frontend dev server.
- **Frontend**: React functional components with hooks, react-router-dom for routing, axios for API calls with JWT interceptor.
- **Data Flow**: Frontend authenticates via `/api/auth/login`, stores JWT in localStorage, includes in API requests. File uploads handled via multipart/form-data to `uploads/` directory.
- **Why**: Separated concerns for scalability; backend focuses on data/security, frontend on UX. Role-based routing ensures proper access control.

## Key Workflows
- **Start Development**: Backend - `./mvnw spring-boot:run` (port 8080); Frontend - `cd frontend && npm run dev` (port 5173).
- **Build**: Backend - `./mvnw clean install`; Frontend - `npm run build`.
- **Test**: Backend - `./mvnw test`; Frontend - ESLint via `npm run lint`.
- **Debug**: Check MySQL logs for DB issues; use browser dev tools for frontend API calls; backend logs via Spring Boot console.
- **Database**: MySQL with `spring.jpa.hibernate.ddl-auto=update`; reset via `DROP DATABASE testtt; CREATE DATABASE testtt;`.

## Conventions and Patterns
- **Backend**: Use Lombok for entities/DTOs; @Autowired for dependencies; custom queries in repositories (e.g., `findAllWithOwners` in PetRepository).
- **Frontend**: Centralize API calls in `src/api.js` with axios instance; use AuthContext for user state; role-based components in `pages/{role}/`.
- **File Handling**: Uploads to `backend/uploads/`, served at `http://localhost:8080/uploads/{filename}`; use UUID for unique filenames.
- **Security**: JWT in Authorization header; Google OAuth for registration/login; CORS allows localhost:5173.

## Integration Points
- **External APIs**: Google OAuth for auth; MySQL for persistence.
- **Cross-Component**: AuthContext provides user/token to components; API responses use DTOs (e.g., PetResponse) to avoid exposing entities.
- **Dependencies**: Spring Boot starters for web/security/JPA; React with Vite for fast dev; axios for HTTP.

Reference: `backend/pom.xml` for deps, `frontend/package.json` for scripts, `backend/src/main/resources/application.properties` for config.