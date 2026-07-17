Issue: How to View Environment Variables on Windows

Problem:
Needed a way to inspect environment variables on a Windows machine for debugging Docker Compose and application configuration.

Solution:

Git Bash

printenv
env
echo $VARIABLE_NAME
printenv | grep VARIABLE_NAME

Command Prompt (CMD)

set
echo %VARIABLE_NAME%

PowerShell

Get-ChildItem Env:
$env:VARIABLE_NAME
View .env file contents
Git Bash: cat .env
CMD: type .env
PowerShell: Get-Content .env

Key Learning:

Environment variables stored in the current shell can be viewed using printenv, env, set, or Get-ChildItem Env: depending on the terminal.
A .env file is not automatically loaded into the shell—it is simply a text file until an application (such as Docker Compose) or a script reads it.
Checking environment variables is a useful first step when troubleshooting configuration issues related to Docker, CI/CD, or application deployment.d