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
  - node-red
  - docker
  - odbc
  - kafka
  - nodejs
---

## Summary

This blog post will show how easy it is to create an ODBC connection to you IBM i's DB2 tables, run a query in Node-RED that publishes messages to a Kafka Cluster.

## What is ODBC?

**Open Database Connectivity** (ODBC) is a specification for database API.  The API can be used with several databases, including DB2, Ms Sequel Server.  It is dependent upon database specific drivers, which is why the IBM DB2 driver is listed as one of the prerequisite software.

## What is Node-RED?

Node-RED is an open source, low-code, browser based message flow technology that is written in Node.js.  It allows wiring together 'nodes' of different types for easy transmission and translation of data, for example ODBC and Kafka.

Node-RED is also a common dashboarding tool.  In fact, The Bearded Geek (Matt Seeberger) has a cool [IBM i dashboard](https://ibmicommunity.thebeardedgeek.com/2020/11/ibm-i-node-red-admin-dashboard-example/) that runs on Node RED.  If you have time, check it out - its what inspired me to get in to node red in the first place.

Node-RED allows you work in a browser window, wiring together the different nodes that are needed for your application and customizing the nodes as you go along.  JavaScript functions can also be written inside a node.

## What is Kafka and why would I want to connect to it?

Kafka is an event streaming technology.  At a high level, it can used to make highly redundant and high through-put messaging system of message brokers, message producers, and message consumers.  

This blog won't go into detail about Kafka's history, or why its useful.  Its enough to know that many modern architected cloud applications use Kafka technology to provide the messaging infrastructure between microservices.

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

### Here are a few links to get you started with Kafka

* The video on [this page](https://www.confluent.io/what-is-apache-kafka/) gives a pretty good run down. 
* An explanation of Kafka in children's storybook form: [Gently Down the Stream](https://www.gentlydownthe.stream/) 

{% endwrap %}

There are loads more Kafka resources on the web, just start googling.  I started getting into Kafka when other important techie folks in my organization were excited about using it in their distributed applications that run in the cloud.  I had heard that it could be run on IBM i as well, so I decided to check it out.

## Prerequisites

</br>

{% svg "IBM_i_logo", "mt-1 mr-2 h-12 w-12 text-blue-500 float-top" %}

For most of this tutorial we will not interact directly with an IBM i partition, but the ODBC portion assumes that you have a Username / Password to an IBM i partition, and you know its IP address, or DNS address.  You'll also need to know the name of a library with a table that you have read access to.

If you don't have an IBM i, head on over to [pub400.com](https://pub400.com) and create a free login.  You'll then have to figure out how to create a table in your library and populate it with some data, or you can just query one of the [system tables](https://www.ibm.com/docs/en/i/7.5?topic=views-i-catalog-tables).

</br>

{% svg "ubuntu-icon", "mt-1 mr-2 h-8 w-8 text-blue-500 float-left" %}

### Ubuntu

I use a windows 11 laptop for running all the software in this blog.  Even though I use Windows, that doesn't mean I run the software in Windows natively.  While the prerequisites listed below can run natively in Windows, I find the linux version of ODBC to be more configurable and user friendly.  This is why I choose to use a Ubuntu image in WSL (Windows Subsystem for Linux) on my windows laptop.  Ubuntu is one of the most widely used linux distributions, with a vast user community and loads of resources on the web.  So by using a Ubuntu distro running in WSL on my Windows laptop, I get the best of both worlds.

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-100" %}

{% columns %}

{% cols "bg-gray-100 rounded-lg" %}

Many guides exist online for installing Ubuntu in WSL on Windows, but really its as simple as heading over to the windows store, searching for _UBUNTU_ and installing it.  You can choose to install a specific version of Ubuntu, or just install _Ubuntu_ to get the latest LTS version.

Part of the install process will guide your through setting up a default user and password, and then you can run a Ubuntu command line from your Windows _Start_ menu

{% endcols %}

{% cols "bg-gray-100 rounded-lg" %}

![Ubuntu can be installed in the Windows Store](/assets/images/Ubuntu-Windows-Store.png)

{% endcols %}

{% endcolumns %}

{% endwrap %}



The good news is that Windows and WSL is not a requirement - all of this software runs happily on a mac or linux machine (and with the exception of Docker, IBM i) as well.  If you are on a Mac, you can skip the Ubuntu install - you can run the rest of this stuff natively.

</br>

{% svg "docker-symbol-blue-logo", "mt-1 mr-2 h-8 w-8 text-blue-500 float-left" %}

### Docker Desktop

In this example, I chose to run my Kafka cluster in a Docker container.  There are different flavors of Docker, specifically Docker Desktop, vs Docker Engine.  On a development machine, you would typically use [Docker Desktop](https://docs.docker.com/get-docker/).  As Docker is proprietary software, I should mention that there is an open source alternative called [Podman](https://podman.io/) that is available on linux.  I choose to use Docker since its very easy to install on my Windows machine, integrates nicely with WSL, and is also free to use for individuals.

</br>

{% svg "vscode", "mt-1 mr-2 h-8 w-8 text-blue-500 float-left" %}

### Visual Studio Code

I use [Visual Studio Code](https://code.visualstudio.com/) for pretty much all of my source code management.

</br>

{% svg "ODBC", "mt-1 mr-2 h-8 w-8 text-blue-500 float-left" %}

### ODBC DB2 Driver and the unixODBC package

The ODBC driver for IBM i can be installed in Ubuntu pretty easily.  We will follow [IBM's instructions](https://ibmi-oss-docs.readthedocs.io/en/latest/odbc/installation.html#debian-based-and-ubuntu-based-distribution-setup) and run the following command on the Ubuntu command line:

```bash
curl https://public.dhe.ibm.com/software/ibmi/products/odbc/debs/dists/1.1.0/ibmi-acs-1.1.0.list | sudo tee /etc/apt/sources.list.d/ibmi-acs-1.1.0.list
```

Once the install completes, lets go ahead and create a Data Source Name (DSN) connection to your IBM i.  In my case, I'll be connecting to tales in one of my libraries on PUB400.COM.  To create a connection, we need to create a _.odbc.ini_ file in your home directory.  We can use VSCode to do this by opening a Ubuntu terminal, typing `code ~/.odbc.ini`, then pasting in this info:

```text
[PUB400]
Description            = PUB400
Driver                 = IBM i Access ODBC Driver 64-bit
System                 = pub400.com
UserID                 = ********
Password               = ********
Naming                 = 0
DefaultLibraries       = ********
TrueAutoCommit         = 1
```

Of course you will enter an appropriate description for the DSN - I'm using PUB400 as the description since that is where I am connecting.  The system can be the DNS or IP address of your IBM i.  You will also enter your UserID, Password, and DefaultLibrary name.

</br>

#### unixODBC

After setting up the DSN, another ODBC related prerequisit for this tutorial is to install the unixODBC package.  Head back to your ubuntu command line and enter the following:

```bash
sudo apt-get install unixodbc unixodbc-dev
```

After installing the ODBC driver for IBM i, creating a DSN, and installing the unixodbc package, you can test your DSN with the help of the [isql](https://manpages.ubuntu.com/manpages/jammy/man1/isql.1.html) command, passing the name of your DSN as an argument.  This puts you into an interactive prompt where you can run sql statements, or get infomation :

```bash
jweirich@LAPTOP-97G89Q4N:~$ isql PUB400
+---------------------------------------+
| Connected!                            |
|                                       |
| sql-statement                         |
| help [tablename]                      |
| quit                                  |
|                                       |
+---------------------------------------+
SQL> quit
```


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

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-100" %}

:fire: In the above docker-compose.yml both a kafka and a zookeeper service are defined.  Kafka communicates with the zookeeeper service on port 2181.  For kafka, we assign 2 ports, 9092 and 29092.  The 9092 port is advertised only from within the container, so if we want to interact with kafka from outside the container, on our local machine we have to use port 29092.  

The `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP` is where you would configure SASL (Username / PW) authentication, as well as SSL encryption.

{% endwrap %}

When you first start your Ubuntu Bash prompt, you will be in your home directory. 

1. Create a folder in your home directory named _projects_ and change into that directory: `mkdir projects && cd projects`. 

2. Create folder named _console-consumer-producer-basic_ and save the yaml code as _docker-compose.yml_.  :fire: **Hint:** you can start a VSCode window inside the current folder by simply typing `code .` on the command line, then paste in the contents of the file, save, and close.

3. Run the docker command below that will pull the specified docker images, run the zookeeper and kafka services in a container named _console-consumer-producer-basic_.  You can specify a container name in your yaml, but if you don't docker will use the name of the folder as the name of the container.

  ```text
  docker-compose up -d
  ```

Once started, open up Docker Desktop and the container should look like this:

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

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-100" %}

### Installing Node.JS in Ubuntu running in WSL

1. Get to a Bash command line in Ubuntu.

2. Install cURL: `sudo apt-get install curl`

3. Install NVM: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash`

4. Verify the installation of NVM: `command -v nvm`

5. Install the latest LTS version of NodeJS: `nvm install --lts`

{% endwrap %}

</br>

{% svg "node-red-icon", "mt-1 mr-2 h-8 w-8 text-black-500 float-left" %}

### Node-RED

There are several options for installing Node-RED, including running it in a docker container like we are doing with kafka.  For this tutorial, I'm opting to install it locally in Ubuntu running in WSL on my Windows Laptop.  I'm opting not to run Node-RED in a docker container for a number of reasons.  First, because in order for a Node-RED running in a container to talk to Kafka running in a container, you have to create a [docker network bridge](https://docs.docker.com/network/drivers/bridge/), which is more than I want to get into in this blog post.  Second, because later we will want to install Node-RED on IBM i, and the IBM i operating system doesn't support running docker containers.  That means this installation is very similar to what you would do if you want to run Node-RED on IBM i.

After deciding to install NODE-RED in WSL Ubuntu, there are still a couple of choices listed in the [node-red documentation](https://nodered.org/docs/getting-started/local).  Ubuntu supports SNAP packages, and that is one option, but I choose to install it using NPM, cheifly because the SNAP install doesn't allow git integrations.

Follwing the Node-RED documentation linked above, the command to install Node-RED globally (in Ubuntu) is `sudo npm install -g --unsafe-perm node-red`.  

After the Node-RED install has completed, you can run Node-RED by running the command `node-red`.

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-100" %}

:fire: **Note:** The `node-red` command has several options that provide the ability to use a different settings file than the default **~/.node-red/settings.js**, or specify a different port than the default of **1880**.  You can read up on the different options [here](https://nodered.org/docs/getting-started/local).

{% endwrap %}

By default, Node-RED will publish the Node-RED web interface locally on port 1880, and there will be a link provided in the logs.

```text
jweirich@LAPTOP-97G89Q4N:~/projects/node-red$ node-red
9 Dec 20:32:44 - [info]

Welcome to Node-RED
===================

9 Dec 20:32:44 - [info] Node-RED version: v3.1.1
9 Dec 20:32:44 - [info] Node.js  version: v18.18.0
9 Dec 20:32:44 - [info] Linux 5.15.133.1-microsoft-standard-WSL2 x64 LE
9 Dec 20:32:44 - [info] Loading palette nodes
9 Dec 20:32:45 - [info] Settings file  : /home/jweirich/.node-red/settings.js
9 Dec 20:32:45 - [info] Context store  : 'default' [module=memory]
9 Dec 20:32:45 - [info] User directory : /home/jweirich/.node-red
9 Dec 20:32:45 - [warn] Projects disabled : set editorTheme.projects.enabled=true to enable
9 Dec 20:32:45 - [info] Creating new flows file : /home/jweirich/.node-red/flows.json
9 Dec 20:32:45 - [info] Server now running at http://127.0.0.1:1880/
9 Dec 20:32:45 - [warn]

---------------------------------------------------------------------
Your flow credentials file is encrypted using a system-generated key.

If the system-generated key is lost for any reason, your credentials
file will not be recoverable, you will have to delete it and re-enter
your credentials.

You should set your own key using the 'credentialSecret' option in
your settings file. Node-RED will then re-encrypt your credentials
file using your chosen key the next time you deploy a change.
---------------------------------------------------------------------
```

Other important bits of information are also displayed when you run node-red, such as version information, and the location of your settings and flows files.

A warning shows about using a system-generated key for encrypting the flow credentials file.  We should deal with the warning and do what it says.  Open up the **settings.js** file listed to modify it.  Remember you can use VSCode as a text editor by simply typing _code_ and the location of the file you would like to edit on the ubuntu command line, like this: `code ~/.node-red/settings.js`.

```json
/** By default, credentials are encrypted in storage using a generated key. To
* specify your own secret, set the following property.
* If you want to disable encryption of credentials, set this property to false.
* Note: once you set this property, do not change it - doing so will prevent
* node-red from being able to decrypt your existing credentials and they will be
* lost.
*/
credentialSecret: "JDubbsSuperSecretProperty",
```

### Project Mode

**Optional:**  If you are interested in using Node-RED's git integration, called 'Projects', in the same **settings.js** go ahead and enable it by changing **false** to **true**:
```json
        projects: {
            /** To enable the Projects feature, set this value to true */
            enabled: true,
            workflow: {
                /** Set the default projects workflow mode.
                 *  - manual - you must manually commit changes
                 *  - auto - changes are automatically committed
                 * This can be overridden per-user from the 'Git config'
                 * section of 'User Settings' within the editor
                 */
                mode: "manual"
            }
        },
```
{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-100" %}

:fire: Once the Node-RED server has started, the Ubuntu command line is locked.  You can stop the server with `ctrl-c` and restart it with the same `node-red` command.  You should do this any time you change the settings in **settings.js**.

{% endwrap %}

## Building your First Flow in Node-RED

Upon loading the web interface, you will be greated with a welcome window with tips.

![Node-RED welcome screen](/assets/images/Node-RED-1.png)

Feel free to read through the different tips, or just hit the `x` in the corner to close out of the welcome window.

Lets look at some of the components of the Node-RED editor window.

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

## Component Breakdown

{% columns %}

{% cols "bg-gray-100 rounded-lg" %}

{% dl %}
{% dt %} 1. Palette {% enddt %}
{% dd %} Available nodes are listed categorically in the Palette. {% enddd %}

{% dt %} 2. Workspace {% enddt %}
{% dd %} This is where you construct your flows. {% enddd %}

{% dt %} 3. Deploy {% enddt %}
{% dd %} Press this when you are ready to test your work. {% enddd %}

{% dt %} 4. Menu {% enddt %}
{% dd %} The menu provides various options and configuration. {% enddd %}

{% dt %} 5. Side Bar {% enddt %}
{% dd %} 

The Side Bar contains Panes for the following:
* Information
* Help
* Debug Messages
* Configuration nodes

{% enddd %}

{% enddl %}

{% endcols%}

{% cols "bg-gray-100 rounded-lg" %}

![Node-RED parts](/assets/images/Node-RED-2.png)

{% endcols%}

{% endcolumns %}


{% endwrap %}

We will start bulding our flow by adding an ODBC connection to the IBM i.  Start by adding an inject and a debug node to the workspace, side by side, and wire them together by dragging a line between them:

<video src="/assets/video/Node-Red-1.mp4" autoplay muted loop class="object-cover w-full h-full"></video>

One thing you probably noticed that tiny blue dot appears any time you make a change.  This blue dot is a notification that you have undeployed changes that will not take effect in your application until you deploy them.  

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

:bulb: **Inject**:  An inject node is the "trigger" for the flow.  It includes a button that injects a message into the start of a flow, meaning any nodes that have been wired to it.  A message can be anything - a timestamp, a javascript object, some plain text, *or even some SQL*.

:bulb: **debug**: A debug node prints message contents to the debug pane.  These are very useful when building flows in Node-RED.  They help you know the exact content of a message as it leaves one of your nodes.

:bulb: **blue dot**: A notification that there are undeployed changes.

{% endwrap %}

In order to test our flow, we need to:

1. Deploy it by pressing the deploy button
2. Click on the debug pane so that we can see the output from the debug node
3. Click on the inject node to initiate the flow.

<video src="/assets/video/Node-Red-2.mp4" autoplay muted loop class="object-cover w-full h-full"></video>

If you saw a message pop up in the debug pane that has a msg.payload number, then SUCCESS.  The documentation for an inject node says "The default payload is a timestamp of the current time in millisecs since January 1st, 1970", and that is what you should see.  I didn't link you to some external help site, because all you need to do to get documentation for a specific node, is to click on the node while the **Help** pane in the sidebar is selected.  Nice!

## Adding the ODBC Node

None of the built-in nodes in the pallete allow an ODBC connection, so we need to install more nodes into our pallete from the open source community.

The steps are:

1. Click the **menu**, then **manage palette** (or you could just use the shortcut alt+shift+p)
2. Click the **install** tab
3. Search for `node-red-contrib-odbc`
4. Click the **install** button
5. Click the **install** button on the pop up dialogue

<video src="/assets/video/Node-Red-3.mp4" autoplay muted loop class="object-cover w-full h-full"></video>

The notification at the end says that two nodes were added to palette, **ODBC_CONNECTION**, and **ODBC**.  Wait, if two nodes were added, why is only the ODBC node now visible in the left hand Palette view?  Thats because **ODBC_CONNECTION** is a special type of node called a configuration node.  Configuration nodes are associated with regular nodes, and provide reusable configurability for those nodes.

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

:bulb: **Configuration Node**:  A special type of node that holds reusable configuration that can be shared by regular nodes in a flow.

{% endwrap %}

We will discuss the **ODBC_CONNECTION** configuration node more in a bit.  For now, perform the following steps:

1. Drag the newly installed ODBC node onto the workspace
2. Rewire the nodes so that ODBC is in between the inject node and debug node.

<video src="/assets/video/Node-Red-4.mp4" autoplay muted loop class="object-cover w-full h-full"></video>

What's this?  A red triangle has appeared on the newly placed ODBC node.  The red triangle is telling us there is an error in the node's configuration.  That makes sense, because we haven't configured it yet.  Node-RED is a bit magical, but not so magic as to guess how the ODBC node is to connect to the database.  Therefore we must configure it.

1. Double click on the ODBC node
2. Click the Pencil button next to `Add new ODBC_CONNECTION`
3. In the *Add new ODBC_CONNECTION config node* dialogue, enter `DSN=PUB400` for the Connection String.
4. Click the **Add** button
5. Enter a simple SQL statement, like `Select * from customer` in the Query box.
6. Click **Done**.







