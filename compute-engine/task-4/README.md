# Compute Engine: Task 4

### Create the same application as in task 4 but this time make use of the Google Cloud SQL managed service.

In this exercise we will be setting up the same kind of application but this time we will be making use of the Google Cloud SQL service to manage our database.  
Since Cloud SQL is a serverless service, the task at hand will focus on how to make sure our connection from our application to Cloud SQL is secure and shield our SQL instance from the outside world.

The steps to perform:
1. Create a Cloud SQL instance in europe-west1-c
2. Test the connection towards it from your local computer
3. Create a new network called training-network that includes an app-subnet
4. Create a Compute Engine instance named application that situates itself in the app-subnet which will host the application
5. Authorize the instance for connections with Cloud SQL
6. Move the application to the corresponding instance and expose the application

Documentation:  
[Google Cloud VPC](https://cloud.google.com/vpc/docs/vpc)  
[Google Compute Engine](https://cloud.google.com/compute/docs/instances)  
[Google Cloud SQL](https://cloud.google.com/sql/docs/postgres)  
[NestJS](https://docs.nestjs.com/)  
[PM2 (Process manager)](https://pm2.keymetrics.io/docs/usage/quick-start/)  