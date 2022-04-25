# Compute Engine

### Task 1
Set up a Compute Engine instance with a small NestJS API that is accessible from a public IP address.

### Task 2
Set up a managed instance group of two Compute Engine instances with a simple NestJS application like in task 1.
Make sure the managed instance group always keeps two instances running even when one goes down.
Make sure the two instances can only be accessed through a load balancer endpoint and not via their public IP address.

### Task 3
Set up a Compute Engine instance with a small Node.JS (NestJS) API that is accessible from a public IP address. Connect the instance with a database and have some CRUD operations take place on the API. Make sure only the Compute Engine can access the database, but still allow ssh from your local machine.

### Task 4
Create the same application as in task 4 but this time make use of the Google Cloud SQL managed service.

### Task 5
Set up a Compute Engine instance with a small Node.JS (NestJS) API that is accessible from a public IP address. Create a RabbitMQ instance and connect the NestJS app with the RabbitMQ instance. The NestJS application should be able to send a message over the queue when triggered on an endpoint. The same application will then consume the message from the queue and log it.
Check to see if the message is present in the logs of the instance.

### Task 6
Create the same application as in task 5 but this time make use of the managed Google Cloud Memorystore service.
