Issue: Incorrect Jenkins Workspace Environment Variable

Issue Description:
The Jenkins pipeline failed because the workspace path was referenced using the incorrect environment variable ${env.workspace}. Jenkins environment variable names are case-sensitive, and workspace is not a valid property.

Solution:
Updated the pipeline to use the correct Jenkins workspace environment variable, ${env.WORKSPACE}, ensuring the .env file path was resolved correctly during execution.

Fix Applied:

# Incorrect
${env.workspace}/shopflow-project/.env

# Correct
${env.WORKSPACE}/shopflow-project/.env

Outcome:
The pipeline successfully located the project directory, updated the .env file with the generated JWT secret, and continued executing the remaining stages without workspace path errors.