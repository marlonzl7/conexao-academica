# Compilação
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /build

COPY etl-java /build

RUN mvn clean package

#Execução
FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd -m appuser

COPY --from=build /build/target/etl-java-1.0-SNAPSHOT.jar app.jar

USER appuser

CMD ["java", "-jar", "app.jar"]
