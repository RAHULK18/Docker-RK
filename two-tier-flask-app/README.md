🐳 Flask + MySQL Two-Tier Application (Docker Compose)

A simple two-tier web application built with Flask (Python) and MySQL 8.0, containerized using Docker Compose.
The application demonstrates service-to-service communication using Docker networking and secure configuration using environment files.
``` bash
📌 Features

Flask backend running in a container

MySQL 8.0 database container

Docker Compose orchestration

Environment variables managed via .env file

Persistent MySQL storage using Docker volumes

Healthchecks for both services

Deployed and tested on AWS EC2 (Ubuntu)

🏗️ Architecture
User Browser
     |
     |  HTTP :5000
     v
Flask Container
     |
     |  TCP :3306
     v
MySQL Container


Containers communicate using Docker’s internal DNS

Database data persists across restarts via volumes

🧰 Tech Stack

Backend: Python, Flask

Database: MySQL 8.0

Containerization: Docker, Docker Compose

OS: Ubuntu (EC2 compatible)

📂 Project Structure
two-tier-flask-app/
│
├── app.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env            # Environment variables (not committed)
├── .gitignore
├── templates/
│   └── index.html
└── README.md

🔐 Environment Variables

All sensitive values are stored in a .env file.

Example .env
MYSQL_HOST=mysql
MYSQL_DATABASE=devops
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_ROOT_PASSWORD=root


⚠️ .env is added to .gitignore and should never be committed.

⚙️ Docker Compose Overview
Services

mysql

MySQL 8.0

Persistent volume: mysql-data

Healthcheck enabled

flask

Flask app running on port 5000

Connects to MySQL using service name mysql

Healthcheck enabled

🚀 How to Run the Application
1️⃣ Clone the repository
git clone https://github.com/<your-username>/two-tier-flask-app.git
cd two-tier-flask-app

2️⃣ Create .env file
nano .env


(Add variables as shown above)

3️⃣ Build and start containers
docker compose up --build

4️⃣ Access the application
http://<EC2-PUBLIC-IP>:5000

🛑 Stop & Cleanup
Stop containers
docker compose stop

Stop and remove containers (keep DB data)
docker compose down

Full reset (⚠ deletes MySQL data)
docker compose down -v

🩺 Healthcheck Notes

MySQL uses mysqladmin ping

Flask healthcheck verifies HTTP response on /

If Flask appears unhealthy, ensure:

App is listening on 0.0.0.0

Port 5000 is open

Healthcheck endpoint exists