---
layout: post
title:  "Node-RED with ODBC and Kafka"
date:   2023-12-04
excerpt: How to use Node-Red to quickly connect your IBM i to the outside world with ODBC and Kafka
author: john-weirich
draft: false
seo:
  title: Node-RED with ODBC and Kafka
  description:
  image: 30_printable_base64.png
images: # relative to /src/assets/images/
  feature:
  thumb: 30_printable_base64.png
  align: # object-center (default) - other options at https://tailwindcss.com/docs/object-position
  height: # optional. Default = h-48 md:h-1/3
tags:
  - Node-RED
  - Docker
  - ODBC
  - Kafka
  - NodeJS
---

## Summary

This blog post will show how easy it is to create a connection from you IBM i's DB2 tables to a Kafka Cluster.  We will create basic flows that run a query on your IBM i, then 

## What is Node-RED?

Node-RED is an open source, low-code, browser based message flow technology that is written in Node.js.  It allows wiring together 'nodes' of different types for easy transmission and translation of data, for example ODBC and Kafka.

Node-RED is also a common dashboarding tool.  In fact, The Bearded Geek (Matt Seeberger) has a cool [IBM i dashboard](https://ibmicommunity.thebeardedgeek.com/2020/11/ibm-i-node-red-admin-dashboard-example/) that runs on Node RED.  If you have time, check it out - its what inspired me to get in to node red in the first place.

Node-RED allows you work in a browser window, wireing together the different nodes that are needed for your application and customizing the nodes as you go along.  JavaScript functons can also be written inside a node.

## What is Kafka and why would I want to connect to it?

Kafka is an event streaming technology.  At a high level, it can used to make highly redundant and high through-put messaging system of message brokers, message producers, and message consumers.  

This blog won't go into detail about Kafka's history, or why its useful.  Its enough to know that many modern architected cloud applications use Kafka technology to provide the messaging infrastructure between microservices.

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

### Here are a few links to get you started with Kafka

* The video on [this page](https://www.confluent.io/what-is-apache-kafka/) gives a pretty good run down. 
* An explaination of Kafka in children's storybook form: [Gently Down the Stream](https://www.gentlydownthe.stream/) 

{% endwrap %}

There are loads more Kafka resources on the web, just start googling.  I started getting into Kafka when other important techie folks in my organization were excited about using it in their distributed applications that run in the cloud.  I had heard that it could be run on IBM i as well, so I decided to check it out.

## Prerequisites

</br>

{% svg "docker-symbol-blue-logo", "mt-1 mr-2 h-8 w-8 text-blue-500 float-left" %}

### Docker Desktop

In this example, I chose to run my Kafka cluster in a Docker container.  There are different flavors of Docker, specifically Docker Desktop, vs Docker Engine.  On a development machine, you would typically use [Docker Desktop](https://docs.docker.com/get-docker/).  As Docker is proprietary software, I should mention that there is an open source alternative called [Podman](https://podman.io/) that is available on linux.  I choose to use Docker since its very easy to install on my Windows machine, and also free to use for individuals.

</br>

{% svg "vscode", "mt-1 mr-2 h-8 w-8 text-blue-500 float-left" %}

### Visual Studio Code

I use [Visual Studio Code](https://code.visualstudio.com/) for everything.

</br>

{% svg "kafka-logo", "mt-1 mr-2 h-8 w-8 text-black-500 float-left" %}

### Kafka

After installing Docker and Visual Studio Code, you'll go to a bash prompt and download, install, and run Kafka locally in a Docker container.  There are many resources available on the web to do this, but here is one more.

First, create a docker-compose.yml file with these contents:

```text
version: '2'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - 22181:2181
  
  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - 29092:29092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

:fire: In the above docker-compose.yml both a kafka and a zooker service are defined.  Kafka communicates with the zookeeeper service on port 2181.  For kafka, we assign 2 ports, 9092 and 29092.  The 9092 port is advertised only from within the container, so if we want to interact with kafka from outside the container, on our local machine we have to use port 29092.  

The `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP` is where you would configure SASL (Username / PW) authentication, as well as SSL encryption.

{% endwrap %}

Since I mainly use WSL Ubuntu in Windows for such purposes, I started a Ubuntu Bash prompt and created a folder in my home directory's `projects` folder named `console-consumer-producer-basic` and saved the yaml code as `docker-compose.yml`.  The I ran a docker command that will pull the specified docker images, run the zookeeper and kafka services in a container named `console-consumer-producer-basic`.  You can specify a container name in your yaml, but if you don't docker will use the name of the folder as the name of the container.

```
docker-compose up -d
```

Once started, the container should look like this in your docker desktop application

![Alt text](/assets/images/Kafka-Docker.png)

*The other two containers shown listed in the screenshot above are development containers I use for writing this blog, and publishing IBM i code to gitlab & github.*

You can then run `netstat -tl6` on your bash prompt to confirm the zookeeper / kafka ports are listening

```text
jweirich@LAPTOP-97G89Q4N:~$ netstat -tl6
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp6       0      0 [::]:29092              [::]:*                  LISTEN
tcp6       0      0 [::]:22181              [::]:*                  LISTEN
```

</br>

{% svg "nodejs-icon", "mt-1 mr-2 h-8 w-8 text-black-500 float-left" %}

### Node.JS

Since we aren't using a snap package to install Node-RED (explaination below) we need to install Node.JS before we can install Node-RED.  At the time of this writing, the latest LTS version of Node.JS is 20.  We will follow the [instructions given by microsoft to install Node.JS in WSL](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl).

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

### Installing Node.JS in Ubuntu running in WSL

1. Get to a Bash command line in WSL Ubuntu.

2. Install cURL: `sudo apt-get install curl`

3. Install NVM: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`

4. Verify the installation of NVM: `command -v nvm`

5. Install the latest LTS version of NodeJS: `nvm install --lts`

{% endwrap %}

</br>

{% svg "node-red-icon", "mt-1 mr-2 h-8 w-8 text-black-500 float-left" %}

### Node-RED

There are several options for installing Node-RED, including running it in a docker container like we are doing with kafka.  For this tutorial, I'm opting to install it locally on my windows PC, in WSL Ubuntu.  I'm opting not to run Node-RED in a docker container for a number of reasons.  First, because in order for a Node-RED running in a container to talk to Kafka running in a container, you have to create a [docker network bridge](https://docs.docker.com/network/drivers/bridge/), which is more than I want to get into in this post.  Second, because later we will want to install Node-RED on IBM i, and the IBM i operating system doesn't support running docker containers.

After deciding to install NODE-RED in WSL Ubuntu, there are still a couple of choices listed in the [node-red documentation](https://nodered.org/docs/getting-started/local).  Ubuntu supports SNAP packages, and that is one option, but I choose to install with npm, cheifly because the SNAP install doesn't allow git integrations.



