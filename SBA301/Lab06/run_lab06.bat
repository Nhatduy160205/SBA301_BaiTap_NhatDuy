@echo off
echo ========================================================
echo   Starting SBA301 - Lab 06 (Spring Boot JWT Security)
echo   Listening on: http://localhost:8005
echo ========================================================
cd /d %~dp0
if exist target\lab06jwt-1.0.0.jar (
    java -jar target\lab06jwt-1.0.0.jar
) else (
    java -classpath ".mvn/wrapper/maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=." org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
)
pause
