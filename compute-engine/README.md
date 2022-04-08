# Compute Engine

### Task 1
Set up a Compute Engine instance with a small NestJS API that is accessible from a public IP address.

### Task 2 (Optional)
Create a Github Action structure from the previous steps to automate the deployment process of this application.

### Task 3
Duplicate the instance and set up a network load balancer in front of the two instances.
Make sure the two instances can only be accessed through the load balancer endpoint and not via their public IP address.

### Task 3
Set up a Compute Engine instance with a small Node.JS (NestJS) API that is accessible from a public IP address. Connect the instance with a database and have some CRUD operations take place on the API. Make sure the instance connects with the database over public IP.

### Task 4
Set up a Compute Engine instance with a small Node.JS (NestJS) API that is accessible from a public IP address. Connect the instance with a database and have some CRUD operations take place on the API. Make sure the instance connects with the database over private IP -> The connection does not go outwards.

### Task 5
Set up two Compute Engine instances with a different small Node.JS (NestJS) API accessible from a public IP address. When accessing one of them, get some data through an endpoint of the other but make sure the request is handled internally and does not make use of the public endpoint -> Route internally with use of VPC
