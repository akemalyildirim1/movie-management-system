CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age_restriction INT NOT NULL
);

SELECT setval('movies_id_seq', 1000);

CREATE TABLE time_slots (
    id INT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE (start_time, end_time)
);

INSERT INTO
    time_slots
        (id, start_time, end_time)
    VALUES
        (1, '10:00', '12:00'),
        (2, '12:00', '14:00'),
        (3, '14:00', '16:00'),
        (4, '16:00', '18:00'),
        (5, '18:00', '20:00'),
        (6, '20:00', '22:00'),
        (7, '22:00', '00:00');

CREATE TABLE movies_sessions (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    time_slot_id INT NOT NULL REFERENCES time_slots(id),
    room_id INT NOT NULL REFERENCES rooms(id),
    date TEXT NOT NULL,
    UNIQUE (date, time_slot_id, room_id)
);

SELECT setval('movies_sessions_id_seq', 1000);



