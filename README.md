# Google Cloud Training

This repository is designed to guide you through some basics of Google Cloud Platform.
It consists of tasks designed to let you experience the capabilities of the platform and tries to emulate some setups you might encounter while working for a client or Pàu Studio.
Every exercise folder is created in such a way it will outline the steps you need to take to get to the required end result, starting from more detailed explanations to more brief ones the more knowledge you gain.
Every task folder has a solution folder that includes a README file that will provide a solution on how to tackle the exercise and optionally a script that you can run to get to the desired end result.
Requirements to start tackling these exercises are that you at least have some experience with how to run and build a NestJS application locally and know your way around the command line.

An overview of the contents of each folder in order of which to tackle:

### Setting up your environment

This folder contains a small README file for the initial setup of the Google Cloud Platform environment and the gcloud CLI.

### Compute Engine

The exercises in this folder are designed to let you come into contact with the base Google Cloud building block, Compute Engine.
You will learn how to setup a Compute Engine, update it, install various packages and expose your code to the outside world, connect to a database and etc.
You will also be introduced to the Google Virtual Private Cloud or VPC for short.
The VPC allows you to manage which services, hosted on GCP, are publicly available or can directly access each other.
Last but not least, you will create multiple Compute Engines and assign them to a managed instance group after which you are able to put a load balancer in front of them.
An optional task in this section is to automate the deployment of a NestJS instance through the use of Github Actions.
