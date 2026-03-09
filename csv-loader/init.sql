CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar NOT NULL,
  age int NOT NULL,
  address jsonb,
  additional_info jsonb
);
