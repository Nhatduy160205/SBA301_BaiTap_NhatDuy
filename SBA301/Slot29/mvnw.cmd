@echo off
set "BASE=%~dp0"
if "%BASE:~-1%"=="\" set "BASE=%BASE:~0,-1%"
java -classpath "%BASE%\.mvn\wrapper\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%BASE%" org.apache.maven.wrapper.MavenWrapperMain %*
