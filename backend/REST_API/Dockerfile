FROM maven:3.9.10-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml ./pom.xml

RUN mvn dependency:go-offline

COPY /src ./src

RUN mvn clean package -DskipTests

FROM  eclipse-temurin:21-jre AS prod

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]