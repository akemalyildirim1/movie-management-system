CREATE TABLE IF NOT EXISTS user_roles
(
    id   INT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO user_roles
(id, name)
VALUES (1, 'manager'),
       (2, 'customer');

CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    username   TEXT NOT NULL UNIQUE,
    password   TEXT NOT NULL,
    age        INT  NOT NULL,
    role_id    INT  NOT NULL REFERENCES user_roles (id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

CREATE INDEX idx_users_username ON users (username);

SELECT setval('users_id_seq', 1000);
