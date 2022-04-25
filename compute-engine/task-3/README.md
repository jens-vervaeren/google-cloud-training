# Compute Engine: Task 3

### Set up a Compute Engine instance with a small NestJS API that is able to perform some CRUD operations on a database

For this exercise, you will setup a Compute Engine instance that will run a small NestJS API that is able to make some CRUD operations on a database.  
Since you have finished task 1, you might be able to guess some steps you might need to do like spin up two Compute Instances.  
Therefore this task focuses more on setting up a database on a Compute Engine and ensuring only the application can access it.

The steps to perform:
1. Create a new network called training-network that includes an app-subnet and a database-subnet
2. Create a Compute Engine instance named application that situates itself in the app-subnet which will host the application
3. Create a Compute Engine instance named database that situates itself in the database-subnet which will host the database
4. Prepare the database to accept the connection coming from the application
5. Create the CRUD NestJS application
6. Move the application to the corresponding instance and expose the application

Documentation:
[Google Cloud VPC](https://cloud.google.com/vpc/docs/vpc)  
[Google Compute Engine](https://cloud.google.com/compute/docs/instances)  
[Postgres installation](https://www.cherryservers.com/blog/how-to-install-and-setup-postgresql-server-on-ubuntu-20-04#introduction)
[NestJS](https://docs.nestjs.com/)  
[PM2 (Process manager)](https://pm2.keymetrics.io/docs/usage/quick-start/)  
