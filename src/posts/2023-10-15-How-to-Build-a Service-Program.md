---
layout: post
title:  "How to Build an ILE Service Program"
date:   2023-10-15
excerpt: How to build an ILE Service Program, the right way.
author: john-weirich
draft: false
seo:
  title: How to Build an ILE Service Program
  description:
  image: RPG-ILE.png
images: # relative to /src/assets/images/
  feature:
  thumb: RPG-ILE.png
  align: # object-center (default) - other options at https://tailwindcss.com/docs/object-position
  height: # optional. Default = h-48 md:h-1/3
tags:
  - rpgle
  - ile
  - service-program
---

## Do It The Right Way

Service programs are a unique feature of ILE, allowing you to combine modules and procedures, written in one of the five ILE languages, into one set of procedures that are called by reference.  Unlike regular programs, service programs can have multiple entry points.  Service program generally do not exist on their own - usually they are bound to an ILE program.

## A Very Brief History of ILE

ILE, or the Integrated Language Environment, is a feature of the IBM i operating system since 1993.  The original AS400 operating system used the Original Program Model (OPM).  The extended program model (EPM) was later introduced for the C and Pascal programming languages.

<!-- Todo Add more history -->

## Service program building blocks

To build a service program, 3 things are needed

1. A Prototype
2. A Module
3. Binder Language

From those 3 items we can create a service program that can be bound into other programs.

## The Prototype

A prototype defines the parameters and return values that are necessary to call the exported procedures that are provided by your service program.  

Prototypes are externalized from the module so that they can be copied into the calling programs and procedures that need them.  I also copy them into the module of the service program itself.

All prototype code will be saved in source files inside a folder named `QPTYPESRC` which is in the root of your project.  The filename of this prototype file is `PRINTER.RPGLEINC`.  It will define all prototypes for exported procedures in the PRINTER module.

QPTYPESRC/PRINTER.RPGINC contents:

```rpgle
**FREE
///
// Title: printThis
// Description: Print stuff in 2 columns
///  
Dcl-Pr printThis ExtProc('*DclCase');
  inLabel Char(21) Const;
  inValue VarChar(100) Const;
End-Pr;
```

[Link to the Code](https://github.com/JDubbTX/IBMiExamples/tree/main/QPTYPESRC/PRINTER.RPGLEINC)

### Explanation of the Prototype code
Our prototype is coded in fully-free RPGLE code. Included are comments in ILEDOCS format that provide the Title and Description of the procedure. 

There is one procedure named `printThis`, with two parameter fields, a 21 character field named `inLabel`, and a varchar field of length 100 name `inValue`.  

Both fields use the keyword `Const` because they are not meant to be modified by the called procedure.  This is what you typically do for input only parameters.

Using `ExtProc('*DclCase')` means that the procedure name `printThis` will be exported as mixed case instead of upper case, which is better if you look at call stacks often.  If we had not included this, the procedure would be exported as `PRINTTHIS`.

## The Module

First we will create a simple module with a single entry point, or exported procedure that has one purpose - printing output to a spool file using the data that is passed in via 2 parameters.  Start by adding a new folder and file to your project.

QPRPGLESRC/PRINTER.RPGLE contents:

```rpgle
**free
ctl-opt NoMain option(*srcstmt) ReqPrExp(*require);
/copy ./qptypesrc/printer.rpgleinc
// Procedure for Printing to a spool file
dcl-proc printThis export;
  dcl-pi *n;
    inLabel char(21) const;
    inValue varchar(100) const;
  end-pi;

  Dcl-f QPRINT printer(132) static;
  dcl-ds line len(132) inz qualified;
    Label    char(21);
    *n       char(1);
    Val      char(100);
  end-ds;

  line.Label = inLabel;
  line.Val = inValue;
  write QPRINT line;

  return;
  
end-proc;
```
[Link to the Code](https://github.com/JDubbTX/IBMiExamples/blob/main/QRPGLESRC/PRINTER.RPGLE)

### Explanation of Module code

>```rpgle
>**free
>ctl-opt NoMain option(*srcstmt) ReqPrExp(*require);
>/copy ./qptypesrc/printer.rpgleinc
>```

All RPGLE examples in this blog will be in fully free-form RPGLE.  By putting `**FREE` on line 1 of our source file, the rpgle compiler allows us to start our code in column 1, instead of column 7.

Then a few control specifications:

  1. `NoMain` - there is no main procedure in this module
  2. `option(*srcstmt)` - statement numbers for the listing are generated from the source ID and line sequence numbers.
  3. `ReqPrExp(*require)` - a prototype definition is required for all exported procedures.  While this is keyword is optional, by including it we ensure that we don't forget to add a prototype definition to our prototype file - the module will not compile unless we do.

Finally, we use `/copy` with a relative path to the prototype file in order to make prototyped procedures and field definitions available to this module.

>```rpgle
>dcl-proc printThis export;
>  dcl-pi *n;
>    inLabel char(21) const;
>    inValue varchar(100) const;
>  end-pi;
>```

The `dcl-proc` keyword declares the start of a procedure definition in our module.  We give it a name `printThis` and make it available to calling programs via the `export` keyword.  Without the `export` keyword, this procedure would only be callable from within the module.

Next a procedure interface with *n for the name.  The *n is commonly used instead of a name since its already mentioned in the `dcl-proc` above.

The procedure interface matches the prototype in terms of parameter definitions.

>```rpgle
>  Dcl-F QPRINT printer(132) static;
>```

A file named `QPRINT` is declared with `Dcl-F`. The keyword `printer(132)` means that the file is a programed described file with device type `PRINTER` that is opened for output.  

Since this is a called procedure in a service program, it is important to use the keyword `static` so that the file's control information is kept in static storage.  If we didn't use `static` a new printer file named QPRINT would be created every time we called the procedure, The calling program's job would generate a large number of 1 line spool files.

>```rpgle
>  dcl-ds line len(132) inz qualified;
>    Label    char(21);
>    *n       char(1);
>    Val      char(100);
>  end-ds;
>```

This data structure named `line` has the same length as the `QPRINT` printer file.  It is initialized with the `inz` keyword. Subfields in this data structure must be qualified with the data structure name because we used the `qualified` key word.

The subfields of the `line` data structure will define the print layout.  There are 21 and a 100 char subfields `Label` and `Val` separated by an unnamed single character subfield.

</br>

### Building the Module

With our prototype and module, we can build our module with a CL create command, `CRTRPGMOD`.  The **Code for IBM i** extension makes it easy by selecting `actions` (ctl+e) and then `Create RPGLE Module`.

![Alt text](/assets/images/BuildPrinterModule1.gif)

In order to provide a text description for our module object, the CRTRPGMOD command needs to have the `text` parameter added to it.  This can be set up as a customizable prompt for the action which will be discussed in a future blog post.

## The Service Program

Service programs are created with the CRTSRVPGM command.  Its easy to create a service program from a module with this command:

```text
CRTSRVPGM SRVPGM(PRINTER) EXPORT(*ALL) TEXT('PRINTER Procedures')
```

The above command assumes you will create a service program in the current library from a module named `PRINTER`.  By default the service program will have the same name as the module.  The `EXPORT(*ALL)` part of the command specifies that we will export, or make available, all exportable procedures in the module.

Again, the Code for IBM i extension makes creating a service program easy with actions.

We now have a nice new service program that can be bound to calling programs.  However, we have a problem.  The problem is that our service program has a randomly generated signature instead of a user defined signature.

</br>

#### So What?
 
With a randomly generated signature on our service program, all calling programs will need to be recompiled any time we add a procedure to the service program.  If we didn't, we would get a signature violation error at run time.  Thats not very convenient if you are trying to write modern re-useable code.  In fact, the more re-use of the service program, the harder it becomes to ever change it.  Fortunately, we can control the signature of our service program with Binder Language.

</br>

#### Wait, whats a signature again?

A service program's signature is something that is assigned at object creation time.

>Signatures are generated from the procedure and data item names that are exported from the service program. ([Documentation link](https://www.ibm.com/docs/en/ssw_ibm_i_75/ilec/ilesp.htm))


#### Introducing Binder Language

To create a service program, its best to use binder language.  While not required, by referencing a binder language file during service program creation, you take control of the signature of exported procedures.  This benefits you down the road - by having a static signature, calling programs don't have be to recompiled whenever your service program is recreated.

Create a file named `PRINTER.BND` inside a project directory named `QSRVSRC` with the following contents.  'PRINTER' will be the name of the service program that we end up creating.

QSRVSRC/PRINTER.BND contents:

```text
/* Binder Language for PRINTER Service Program */
STRPGMEXP PGMLVL(*CURRENT) SIGNATURE('PRINTER    V0001')
    EXPORT SYMBOL("printThis")
ENDPGMEXP
```

[Link to the Code](https://github.com/JDubbTX/IBMiExamples/blob/main/QSRVSRC/PRINTER.BND)

### Explanation of Binder Language code

Binder language has just a few commands and is simple to understand.  `STRPGMEXP` starts a list of program exports and `ENDPGMEXP` ends a list of program exports.  `PGMLVL(*CURRENT)` means that the following list of exports is the current list of exports.  Specify `PGMLVL(*PREVIOUS)` on the old list and `PGMLVL(CURRENT)` on the new list is one way to avoid the signature fault violation, but the author recommends just specifying `SIGNATURE('NAME V0001')` to explicitly control the signature.  As long as new exports are added at the bottom of the list, you will avoid problems.

</br>

#### The Service Program - Enhanced

To make use of our binder language, we need to include the path to it in our `CRTSRVPGM` command:

```text
CRTSRVPGM  SRVPGM(PRINTER) SRCSTMF('./QSRVSRC/PRINTER.BND') TEXT('PRINTER Procedures')
```

in the above command, we have replaced `EXPORT (*ALL)` with the `SRCSTMF` parameter and provided a path to the file that contains our binder language, listing all the exports and the signature.  This way of creating a service program is more desireable, because you can add new procedures to the module and list of exports, but keep the same signature. Doing this means that calling programs don't need to be recompiled to avoid signature violations.

</br>

### Customizing Code for IBM i Actions

At the time of this writing, code for IBM i doesn't provide an action to create service programs using binder language.  You can add the following code to your `.vscode/actions.json` file for local development, and then you will have an action for it.

```json
  {
    "extensions": [
      "BND"
    ],
    "name": "Create Service Program (CRTSRVPGM with Binder Language)",
    "command": "CRTSRVPGM TEXT('${text|Enter a text description for the Service Program}') SRVPGM(&CURLIB/&NAME) SRCSTMF('&RELATIVEPATH')",
    "environment": "ile"
  },
```

## Summary

The above steps hopefully will aid you in creating modern, reusable procedures in your code.  By using binder language when we create our service program, we greatly increase the serviceability of our service program.  Do you have other stand practices when creating service programs?  If so, please mention them in the comments below.

In a future post we will discuss using binding directories to make our job of program creation easier.




