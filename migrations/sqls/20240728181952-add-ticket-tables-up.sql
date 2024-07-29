CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    movies_session_id INT NOT NULL REFERENCES movies_sessions(id)
);

SELECT setval('tickets_id_seq', 1000);