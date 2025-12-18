#pull base images
FROM eclipse-temurin:17-jdk-alpine

#create a folder where the app will be stored
WORKDIR /app

#Copy the source code from your HOST machine to the computer
COPY src/Main.java /app/Main.java

#Compile the code
RUN javac Main.java

#run the application
CMD ["java", "Main"]
