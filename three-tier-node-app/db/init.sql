CREATE DATABASE IF NOT EXISTS appdb;
USE appdb;

CREATE TABLE IF NOT EXISTS system_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  environment VARCHAR(50) NOT NULL,
  hostname VARCHAR(100),
  cpu_load FLOAT,
  total_memory_mb INT,
  free_memory_mb INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);