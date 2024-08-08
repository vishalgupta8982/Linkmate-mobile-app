FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/linkmate-0.0.1-SNAPSHOT.jar /linkmate.jar
ENTRYPOINT ["java", "-jar", "/linkmate.jar"]
EXPOSE 8080
