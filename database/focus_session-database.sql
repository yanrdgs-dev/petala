CREATE TABLE IF NOT EXISTS focus_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    studyTime INT NOT NULL,
    breakTime INT NOT NULL,           
    actualStudyDuration INT NOT NULL, 
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
