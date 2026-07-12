# MicroservicesProject
This is the microservices Project using different tech stack.

# Key things to remember 
# what problems i faced during execution

	1. Frontend localhosthost:8000 url dependency -- D
		Ans: We will be specifying the domain url in realtime Production Environment
	2. Size of images are high -- InProgress
	3. Mysql is not getting started properly
		Ans: we have to give the init folder path /mysql-init and that folder should be in the      compose file path. MySQL will automatically execute the sql commands present under 01-create-databases.sql file,present inside that folder.

        Whatever sql files present under mysql-init, get executed by sql for first time.
	
	4. Deployment to Aws server
        Ans: React frontend we configuring REACT_APP_API_URL=http://localhost:8080 but in real timw it will be domain name of production environment. As we don't have domain name we will be giving AWS private Ip as domain and build the image as below.
                docker build --build-arg REACT_APP_API_URL=http://13.234.11.114:8000 \
        -t harishgundimeda/shopflow-frontend-service:v2 .

    5. CORS error ?
        Ans: Other services will be not running due to cors error, we need to add  ALLOWED_ORIGINS value with http://AmazonPublicIP:3000