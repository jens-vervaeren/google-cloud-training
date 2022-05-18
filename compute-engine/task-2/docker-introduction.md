# Docker

### A short introduction to help you along task 2
You might have noticed from the task 2 description that the completion of it requires some knowledge of Docker. While not required as a prerequisite to complete any of these exercises, an introduction to the technology might be in order if this is your first time working with it.

### What is Docker?
Docker is a technology that allows us to containerize applications. Now you might ask: What are containerized applications?  
Containerized applications simulate applications running in a specific environment, e.g.: a virtual machine with a certain amount of CPU and RAM which runs a particular OS and has a certain amount of packages installed.  
Containers are separated from the setup overhead of a physical machine however which allows them to quickly start and stop on any type of hardware that supports Docker.

### Containers and images
Containers start from an image. An image defines the starting point of a container when it is run. Think of them as the class you write to create your object, in this case container, from.
Images are build from Dockerfiles and just like classes, when building an image, we describe which functionalities our image has but this with the application we are going to run in mind while a class will mostly be more generic. Images can be created from other images, meaning they can inherit functionality from others so to speak.  

### Creating images
Look at the following Dockerfile which builds the starting point for a containerized NodeJS application:
```docker
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 80
CMD ["node", "src/index.js"]
```
While the steps performed here are hardly all of the commands of a Dockerfile, they represent the ones you will be encounter the most when building Docker images.  
The `FROM` instruction indicates we want to start building a certain base image, in this case node version 16. The `WORKDIR` instruction means that every subsequent `COPY` or `RUN` command will be handled in that directory. The `COPY` instruction copies the specified local files into the specified image location. The `RUN` instruction, as the name implies, runs a command to manipulate files or directories while building the image. The `EXPOSE` instruction exposes a port on the running container, in this case 80, we can use to connect or forward our traffic to. Lastly, the `CMD` instruction has no effect on the image itself but is rather the instruction that will be carried out when the container is started of the image we created here.  

In short, what this Dockerfile achieves is:  
Starting from a node 16 image, we copy our package.json files and install the production modules. After this, we copy all our source files over and set the image to expose port 80 and run the `node src/index.js` command whenever a container is started from it.

### Registries
Just like code, Docker images are stored somewhere on the cloud. Docker calls this a registry and storing or getting images on it acts the same way as with Git as Docker gives us the `docker push` and `docker pull` respectively.  
In case of both commands we have to specify the registry location and the image we want to get. In case no location is specified, Docker assumes it comes from their default location which is DockerHub (hub.docker.com).

### More information
While this is very short introduction to Docker it should help you to provide a starting point in your journey to finish task 2.  
In case you want to go for a deeper dive into Docker, I suggest reading the docs provided over at [https://docs.docker.com/](https://docs.docker.com/)