# Compilação
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /build

COPY etl-java/pom.xml .

RUN mvn dependency:go-offline

COPY etl-java/src ./src

RUN mvn clean package

#Execução
FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd -m appuser

COPY --from=build /build/target/etl-java-1.0-SNAPSHOT.jar app.jar

USER appuser

ENTRYPOINT ["java", "-jar", "app.jar"]
