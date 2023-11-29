---
layout: post
title:  "RIP PDM"
date:   2023-04-03
excerpt: Is this the end of greenscreen programming for IBM i?
author: john-weirich
draft: false
seo:
  title:
  description:
  image: # 2020/09/svg-shortcode.svg
images: # relative to /src/assets/images/
  feature:
  thumb: # 2020/09/svg-shortcode.svg
  align: # object-center (default) - other options at https://tailwindcss.com/docs/object-position
  height: # optional. Default = h-48 md:h-1/3
tags:
  - style
  - tips
  - vscode
---

Does this look familiar to you?

```text
`wrkmbrpdm library/file`
position to member
Edit Code for a minute
F3, (Y to save)
14, Enter (compile)
wrksplf
F18 (go to bottom of listing)
search listing for errors
go back into PDM and edit code for a minute
....etc... etc... etc...
```

Well, stop it.

Seriously.

I don't care if you have a custom user option file that solves the world's problems.  Just stop it.

You will not see any PDM examples anywhere in this blog.  That's because modern IBM i developers **do not use PDM**.  There is better out there.

Trust me.

Even if you have a custom user option file that solves the worlds problems.  Just stop it.

## For the un-initiated

PDM stands for Programming Development Manager.  It is one of the oldest and well loved greenscreen IDE's.  PDM's editor is SEU (Source Edit Utility).  

If you haven't noticed by now, IBM back in the day had a penchant for what I call TLA's (Three Letter Acronyms) (see what I did there?).  That's because IBM i commands are typicially arranged in 3 letter abbreviation or acronym groupings.  For example DSP is the the abbreviation prefix for Display commands, and WRK is the abbreviation for work commands, MBR is for member, OBJ is for object, etc.  These abbreviations are incorporated into commands like WRKMBRPDM (Work with Members in PDM) or STRSEU (Start Source Edit Utility). Once you start to understand the standard 3 letter acronyms IBM commands start to just make sense.

## Here's looking at you, kid . . .

Sure, I know there are a few PDM and SEU stalworts out there.  You know who you are.  Is your favorite band from the 90', 80's or (gasp) the 70's?  Did you grow up on red kool-aid and Robotron and Inspector Gadjet and Pippy Long Stocking and Wayne's World?  A few grey hairs on your head?  This blog post is for you!

## How it used to be

At some point in the past, instead of developing on actual terminals, we (us IBM i developers) started using terminal emulators.  Terminals are great - you can open as many instances as you want, and position them however you want.  They are light-weight and fast.  There is a free 5250 emulator for download from IBM built into the Access Client Solutions tool.  There is even an open source version TN5250.  Now were talkin', right?  Function keys and line commands are great, right?  They let you zoom around at lightning speed!  Lots of peopole swear by the green screen.  Some folks still do.  If this is you, I'm sorry, we can't be friends.

## How it is now

There are better options than PDM.  Some of them have been around for a while, while others are relatively new.  There are several paid options, with one completely free and open source option.

## If you work at an organization with $$$

[Miworkplace](https://reg.miworkplace.com/buy/) is a paid option with a free trial from Remanin software.  At the time of this writing, for a single seat its $10/month or $99/year, or 5 seats for $495/year.  For this you get a whole ton of [features](https://miworkplace.com/index.php?content=features).  I've never used it, but it looks nice.

## If you work at an organization with $$$$

[RDI](https://www.ibm.com/products/rational-developer-for-i) is for you.  This is what I use at Nelnet on a daily basis for most work, although the last year or two I've been using VSCODE for some things.  This is sold by the good folks at IBM.  They have [a few confusing pricing options](https://www.ibm.com/products/rational-developer-for-i/pricing), but you'll notice right off the bat that are there aren't  really accessible to a developer who just wants to learn how to write RPGLE, or work in a modern IDE on their own.  At least there is a free trial.  RDi is an Eclipse based tool, though its based on a pretty old version of Eclipse at this point.

## If you work at an organization with $$$$$ and wants to be an early adopter

Then there is also [Merlin](https://www.ibm.com/docs/en/merlin/1.0).  This is IBM's modern offering.  I got to hand it to IBM, they are really trying hard with this one.  IBM wants to shed that crotchety old green screen developer tool persona and wow us with something new.  They want to be Modern so bad, they put the word 'Modern' in the tool's name. Seriously, MERLIN is a somewhat creative anagram for "Modernization Engine for Lifecycle Integration online".  See what they did?  :expressionless:  

Merlin is more than a development environment.  In addition to a full blown editor that runs in the cloud, it is said to include a full ci/cd toolset, as well as integrations with other IBM i offerings, like IWS, and more to come.  The price of Merlin is [listed in thier official documentation](https://ibm.github.io/merlin-docs/#/./guides/overview/faq?id=how-is-merlin-priced), $4,500 per developer at the time of this writing. Thats not chump change, as this is targeted towards organizations who want to modernize rather than individuals - and lets face it, what IBM i shop doesn't.   You can also kick the wheels and see what all the hubub is about with a [Merlin Test Drive](https://ibm.github.io/merlin-docs/#/./guides/overview/sandbox). 

## If you work at an organization with no $, or you are learning this on your own and you don't have $

IF you don't have extra cash, VSCODE with the [Code For IBM i extension](https://marketplace.visualstudio.com/items?itemName=HalcyonTechLtd.code-for-ibmi) is the modern editor for you.  Now anybody can have a modern IDE, that supports free form RPG, and does modern things like code linting, automatic formatting, peek, and a host of other tools you would expect, like a Db2 interface, an integrated debugger and code coverage, and it works well with VSCODE's integrated GIT capabilities.  I've been watching this tool mature over the last few years and its gone from a novel alternative with a few goodies, to a full fledged tool.  The best part is its completely open source and always has been.  I will eventually write a blog post, or several about VSCODE because frankly, everyone should use it.  Even if you have RDi or Merlin - give it a try.  