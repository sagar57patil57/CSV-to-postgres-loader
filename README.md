# CSV-to-postgres-loader

This project implements a backend service that reads a CSV file, converts each row into a structured JSON, and stores the processed data in a PostgreSQL db.

The CSV headers can contain dot notation (e.g., address.city) which are automatically converted into nested JSON objects. Required fields are mapped to table columns, while remaining fields are stored as JSON in additional_info.

Tech Stack: Node.js, Express, PostgreSQL,Docker

How to Run
1. Start the services
docker compose up --build

This will start the API server and PostgreSQL database.

2. Trigger CSV processing

Send a POST request to:

POST http://localhost:3003/process-csv

The API will process the CSV file, store the data in PostgreSQL, and return the processing summary.

Check Stored Data:
docker exec -it users_db psql -U postgres -d users_db

Then run:
SELECT * FROM users;
