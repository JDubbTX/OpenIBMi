---
layout: post
title:  "Setting up a Gitlab Runner for IBM i"
date:   2024-11-07
excerpt: Two approaches to Gitlab Runners for IBM i
author: john-weirich
draft: true
seo:
  title: 
  description:
  image: 2024/10/DB2-HTTP.png
images: # relative to /src/assets/images/
  feature: 2024/10/DB2-HTTP.png
  thumb: 2024/10/DB2-HTTP.png
  align: # object-center (default) - other options at https://tailwindcss.com/docs/object-position
  height: 1/2
tags:
  - Gitlab
  - IBM i
  - SSH
  - CiCd
---

This post will cover using a gitlab runner with ssh executor on IBM i.  Gitlab pipelines are powerful.  They are written in YAML.  They can be bash or powershell.  Since IBM i can run Bash (unfortunately not Powershell), we can have a Gitlab runner that runs our pipeline commands on the IBM i.

Gitlab itself doesn't run the commands though.  Instead, it uses a _runner_.  A gitlab runner can come in several flavors, but the common thing about them is that they all run on a host.  The code that runs on the host is provided by Gitlab's 

If you want to use Gitlab for Ci/Cd, one early choice you need to make is:

1. Use Gitlab.com's Gitlab-hosted runners
2. Create your own self-managed runners.  

There are many things to consider when planning your Gitlab Runner strategy.
If you are using a self managed Gitlab instance, you want to run self-managed runners.  If you are using gitlab.com as your Gitlab instance, you can choose whether you want to use a Gitlab-hosted runner, or a self-managed runner.  Either are viable solutions for writing IBM i pipelines.

You may work in an organization where things like having a [FIPS compliant runner](https://docs.gitlab.com/runner/install/index.html#fips-compliant-gitlab-runner) is necessary.

Perhaps you want to just get started writing pipelines for IBM i, and are looking for an easy solution for creating a runner that can run commands on IBM i over SSH.  Could we just run the gitlab-runner thing on our own laptop?  We could just install 'gitlab-runner' on our own machine and register it, but that means we then have extra software installed on our precious hardware.  We could run a VM on our machine or we could just use docker to run it.  That is where the SSH executor comes in.  

To recap, a basic ci/cd pipeline includes steps like build, test, and deploy.  More complex pipelines can have steps like container building, linting, vulnerability scanning, auditing, etc.  
