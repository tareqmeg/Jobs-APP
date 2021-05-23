DROP TABLE IF EXISTS jobs;

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title VARCHAR (255),
    company VARCHAR (255),
    clocation VARCHAR (255),
    curl VARCHAR (255),
    cdescription TEXT
)