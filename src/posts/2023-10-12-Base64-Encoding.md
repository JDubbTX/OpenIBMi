---
layout: post
title:  "Base 64 Encoding and Decoding with DB2"
date:   2023-10-12
excerpt: Base64 encoding is a method for converting binary data into ASCII text.
author: john-weirich
draft: false
seo:
  title:
  description:
  image: 30_printable_base64.png
images: # relative to /src/assets/images/
  feature:
  thumb: 30_printable_base64.png
  align: # object-center (default) - other options at https://tailwindcss.com/docs/object-position
  height: # optional. Default = h-48 md:h-1/3
tags:
  - rpg
  - db2
  - base64
---

Base64 encoding is a method for converting binary data into ASCII text. It's designed to prevent communication errors when transferring binary information.

The IBM i operating system provides two DB2 services that allow you to BASE64 encode and decode.

In this post we will discuss how to use these DB2 services, and why CCSID is an important consideration.  The examples given will utilize embedded SQL in an SQLRPGLE program.  We will make use of a service program exported procedure named 'print_this' that will be discussed in future post about service programs.  All code examples are freely available in my [IBMiExamples project on github](https://github.com/JDubbTX/IBMiExamples).

## The IBM i DB2 services for base64 encoding and decoding

[BASE64_ENCODE](https://www.ibm.com/docs/en/i/7.5?topic=functions-base64-encode) - returns the Base64 encoded version of a binary value.

[BASE64_DECODE](https://www.ibm.com/docs/en/i/7.5?topic=functions-base64-decode) - returns a character string that has been Base64 decoded

## Trying it out

First lets encode a string 'MyText' in base64 using a simple SQLRPGLE program.  As mentioned above, we will make use of service program sub-procedure named 'print_this' that simply prints 2 strings passed as parameters to a spool file.

``` rpgle
**free
ctl-opt actgrp(*new) bnddir('BNDUTIL');

// Start of Main Procedure
// Declare some stand-alone fields
Dcl-S PlainText   VARCHAR(100) INZ('MyText');
Dcl-S EncodedText VARCHAR(100);

/copy ./qptypesrc/printer.rpgleinc

// Print headings
print_this('Field Name' : 'Value');
print_this('---------------------' : '-----------------------------------------------------------');

print_this('PlainText' : %Trim(PlainText));

// Encode the text into a VARCHAR field
Exec SQL Values QSYS2.BASE64_ENCODE(:PlainText) Into :EncodedText;
print_this('EncodedText' : %trim(EncodedText));

return;
```

Spool file Output:

``` text
Field Name            Value                                                   
--------------------- --------------------------------------------------------
PlainText             MyText                                                  
EncodedText           1Kjjhaej                                                
```

Now, lets check that against a base64 encoder on the web: [https://www.base64encode.org/](https://www.base64encode.org/)

> ![bas64encode.org screen grab](/assets/images/base64-1.png)

The encoded value from our RPG program doesn't match the encoded value from www.base64encode.org.  The reason they don't match, is because of CCSID.  CCSID, or Coded Character Set Identifier, is what uniquely identifies the specific encoding of a code page.

If you read the documentation for base64_encode, it gives examples of base64 encoding for both the system default EBCDIC code page and UTF-8 (code page 1208).  On IBM i, the default character set is EBCDIC, with the specific code page varying by region.

> On IBM i, ebcdic is the default character set.

The code page for your machine is stored in a system value called QCCSID.  When your IBM i was delivered, it came with value 65535 - which isn't a real code page.  65535 is something IBM i uses to specify all character data tagging support support is turned off.  IBM recommends this value be changed.  In North America, the standard ebcdic code page for IBM i is 37.  For more information, read up on QCCSID [here](https://www.ibm.com/docs/en/i/7.5?topic=values-coded-character-set-identifier-qccsid-system-value).

With that understanding, if you want to base64 encode / decode like the rest of the world, and you probably do, you need to make a CCSID adjustments to your code:

{% columns %}

{% cols "bg-gray-100 rounded-lg" %}

In this version, the only modification needed was to add the CCSID keyword to the definition for `PlainText`.  I used the specific value of `1208`, but could also have used `*UTF8`.  


{% endcols %}

{% cols "bg-gray-100 rounded-lg overflow-x-auto" %}

``` diff-rpgle
**free
ctl-opt actgrp(*new) bnddir('BNDUTIL');

// Start of Main Procedure
// Declare some stand-alone fields
-Dcl-S PlainText   VARCHAR(100) INZ('MyText');
+Dcl-S PlainText   VARCHAR(100) INZ('MyText') CCSID(1208);
Dcl-S EncodedText VARCHAR(100);

/copy ./qptypesrc/printer.rpgleinc

// Print headings
print_this('Field Name' : 'Value');
print_this('---------------------' : '-----------------------------------------------------------');

print_this('PlainText' : %Trim(PlainText));

// Encode the text into a VARCHAR field
Exec SQL Values QSYS2.BASE64_ENCODE(:PlainText) Into :EncodedText;
print_this('EncodedText' : %trim(EncodedText));

return;
```

{% endcols %}

{% endcolumns %}

>:bulb: IBM's documentation suggests another method, which is to CAST the CCSID inline: `VALUES QSYS2.BASE64_ENCODE (CAST(EncodedText AS VARCHAR(10) CCSID 1208)) Into :EncodedText; `

Spool file Output:

``` text
Field Name            Value                                                   
--------------------- --------------------------------------------------------
PlainText             MyText                                                  
EncodedText           TXlUZXh0                                                
```


{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

## And Now to Decode

Lets add a few more lines to our example that decode the now encoded message.

{% columns %}

{% cols "bg-gray-100 rounded-lg" %}

In this version of the code, we first define a field `DecodedTextVarBinary` of type `sqltype(VARBINARY:100)` to receive the decoded text.

We define another field `TranslatedTextVarChar` of type `VARCHAR(100) CCSID(1208)` which allows us to translate the binary ebcdic data back to UTF-8 text.  

`QSYS2.BASE64_DECODE` is used to decode the encoded value `EncodedText`.  Because this is a SQL function, we prepend the argument with `:`, which indicates to the SQL precompiler that it is a host variable.  We also prepend `DecodedTextVarBinary` with `:` because it is another host variable.

Then, to get the translate the decoded value back to ccsid 1208 we simply just assign the value of `DecodedTextVarBinary` to `TranslatedTextVarChar`.  RPG handles the translation for us. 

:question: Unfortunately I haven't found a way to do this in one step.  If you know of a better way, please mention it in the comments below.

{% endcols %}

{% cols "bg-gray-100 rounded-lg overflow-x-auto" %}

``` diff-rpgle
**free 
ctl-opt actgrp(*new) bnddir('BNDUTIL');

// Start of Main Procedure
// Declare some stand-alone fields
Dcl-S PlainText   VARCHAR(100) INZ('MyText') CCSID(1208);
Dcl-S EncodedText VARCHAR(100);
+Dcl-S DecodedTextVarBinary  sqltype(VARBINARY:100);
+Dcl-S TranslatedTextVarChar VARCHAR(100) CCSID(1208);

/copy ./qptypesrc/printer.rpgleinc

// Print headings
print_this('Field Name' : 'Value');
print_this('---------------------' : '-----------------------------------------------------------');

print_this('PlainText' : %Trim(PlainText));

// Encode the text into a VARCHAR field
Exec SQL Values QSYS2.BASE64_ENCODE(:PlainText) Into :EncodedText;
print_this('EncodedText' : %trim(EncodedText));

+// Decode the encoded text into an EBCDIC VarBinary field
+Exec SQL Values QSYS2.BASE64_DECODE(:EncodedText) Into :DecodedTextVarBinary;
+print_this('DecodedTextVarBinary' : %trim(DecodedTextVarBinary));

+// Translate binary data in EBCDIC to UTF-8
+TranslatedTextVarChar = DecodedTextVarBinary;
+print_this('TranslatedTextVarChar' : %trim(TranslatedTextVarChar));

return;
```

{% endcols %}

{% endcolumns %}

{% endwrap %}

Spool file Output:

``` text
Field Name            Value                                                   
--------------------- --------------------------------------------------------
PlainText             MyText                                                  
EncodedText           TXlUZXh0                                                
DecodedTextVarBinary  (`èÁÌÈ                                                  
TranslatedTextVarChar MyText                                                  
```

In summary, while care must be given when defining fields with the correct CCSID values and field types, the IBM i operating system does give us the features we need to encode and decode in base64 just like the rest of the world.

Code used in this blog post is available in my GITHUB, [here](https://github.com/JDubbTX/IBMiExamples/blob/main/QRPGLESRC/BASE64TST.SQLRPGLE).

