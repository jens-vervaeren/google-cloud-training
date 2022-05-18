# Compute Engine: Task 2

### Task 2: Set up a managed instance group of two Compute Engine instances

For this exercise, we will setup a managed instance group that manages two Compute Engine instances.
The instances in the managed instance group, or MIG for short, will be accessible through the use of a load balancer.

In the previous exercise, we saw a more classic example of spinning up a Compute Engine VM where we run a startup script and run a long-lived process on it.  
For managing MIG's however this process would be to slow as updating MIG's happens by spinning up new Compute Engine VM's by the use of instance templates and it would get quite tedious managing the startup scripts.  
We can simplify this process by making use of containerized applications. 
To achieve this we will introduce a new technology called **Docker**.  
Docker can create images of our application that serve as a base to start containers. To help you along, we have included a small introduction file explaining the basiscs.  

Just like in task 1, we will give a detailed overview of the steps you need to complete to get to the desired solution.  
The goal of this task is to discover different functionalities of the Google Cloud VPC as load balancing relies on a certain chain of proxies and services you will encounter later.  

The tasks you need to perform to handle this exercise:
1. Build a NestJS application
2. Create a Dockerfile to build the application image
3. Publish your image to Google Cloud Artifact Registry
4. Create a training-network with a training-subnet just like task 1
5. Create the instance template your managed instance group will run from using the previously created docker image
6. Start the managed instance group with a size of two
7. Load balance the managed instance group with an External HTTP load balancer scheme. This task consists of the following steps:  
    * Set up a health check for our load balancer
    * Create and attach a backend service that will route the requests to one of our instances in the managed instance group
    * Create a HTTP URL map to route incoming requests to the newly created backend service
    * Create a HTTP target proxy to route incoming requests to the previously created url map
    * Create a forwarding rule to route incoming requests on the reserverd load balancer ip to our target proxy previously created
8. To see our managed instance group updates in action, publish a new image to our Artifact Registry
9. Create a new instance template that makes use of the the new image
10. Start a rolling update of the managed instance group that applies the new image

Documentation:  
[Docker](https://docs.docker.com/)  
[Gcloud CLI reference](https://cloud.google.com/sdk/gcloud/reference)  
[Google Cloud VPC](https://cloud.google.com/vpc/docs/vpc)  
[Google Artifact Registry](https://cloud.google.com/artifact-management/docs/overview)  
[Google Compute Engine](https://cloud.google.com/compute/docs/instances)  
[Google Load Balancing](https://cloud.google.com/load-balancing/docs/load-balancing-overview)  
