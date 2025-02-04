CREATE TABLE IF NOT EXISTS focus_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studyTime INT NOT NULL,
    breakTime INT NOT NULL,           
    actualStudyDuration INT NOT NULL, 
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
