# band

Cross-platform workflow management MVP (frontend) built with Next.js, TypeScript, Tailwind, Redux Toolkit, RJSF.

Frontend scripts:
- npm run dev
- npm run build
- npm start

Backend (Spring Boot + Postgres via Docker):
- docker-compose up -d db   # start Postgres
- mvn -f backend/pom.xml spring-boot:run  # start backend locally
- docker-compose up -d backend  # build and run backend container
