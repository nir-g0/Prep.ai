-- Users table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Resumes Table
CREATE TABLE Resumes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    dir_hash TEXT NOT NULL UNIQUE,
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

--Prep Sessions Table
CREATE TABLE Sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    resume_id INT,
    position_type VARCHAR(255) NOT NULL,
    session_data JSONB,
    score INT,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (resume_id) REFERENCES Resumes(id)
);