---
layout: post
title:  "Outbound HTTP and HTTPS on IBM i"
date:   2024-10-03
excerpt: IBM i provides DB2 HTTP and HTTPS functions, and the open source community provides more HTTP and HTTPS functions to connect your i to the REST of the world!
author: john-weirich
draft: false
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
  - http
  - db2
  - REST
  - API
---
This post discusses DB2 HTTP and open source functions and commands that allow your IBM i to talk with the REST of the world (See what I did there?).

## Two sets of DB2 Services for HTTP

HTTP DB2 services have been around for a while on IBM i. An original set of HTTP services are found in the SYSTOOLS library.  This set of functions are java based and require a JVM to run.  They are documented [here](https://www.ibm.com/docs/en/i/7.5?topic=systools-http-function-overview).  This blog post will not talk much about them, but we will provide an example since it is good to know that they are exist and available to use.

In 2024, a new set of HTTP functions came to DB2 on the IBM i Operating system.  This new set of functions are found in the QSYS2 library.  They are documented [here](https://www.ibm.com/docs/en/i/7.5?topic=programming-http-functions-overview).  These are NOT Java based and do not require a JVM to run.  We will give a few examples to show how to use them too.

</br>

### Why did IBM give us new HTTP functions in DB2 when we already had them?

To Quote the documentation:

> These HTTP functions exist in QSYS2 and have lower overhead than the SYSTOOLS HTTP functions. Additional benefits of the QSYS2 HTTP functions are HTTP authentication, proxy support, configurable redirection attempts, and configurable SSL options.

### Are they secure?

Both sets of functions allow you to tailor an HTTP header for different types of authorization.  Both sets of functions are also capable of doing HTTPS / TLS encryption with 2 way authentication.

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

### What are the older java based functions?

Here is the list of HTTP functions that are available in the SYSTOOLS library.

[HTTPDELETEBLOB and HTTPDELETECLOB scalar functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpdeleteblob-httpdeleteclob-scalar-functions)
[HTTPDELETEBLOBVERBOSE and HTTPDELETECLOBVERBOSE table functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpdeleteblobverbose-httpdeleteclobverbose-table-functions)
[HTTPGETBLOB and HTTPGETCLOB scalar functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpgetblob-httpgetclob-scalar-functions)
[HTTPGETBLOBVERBOSE and HTTPGETCLOBVERBOSE table functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpgetblobverbose-httpgetclobverbose-table-functions)
[HTTPPOSTBLOB and HTTPPOSTCLOB scalar functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httppostblob-httppostclob-scalar-functions)
[HTTPPOSTBLOBVERBOSE and HTTPPOSTCLOBVERBOSE table functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httppostblobverbose-httppostclobverbose-table-functions)
[HTTPPUTBLOB and HTTPPUTCLOB scalar functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpputblob-httpputclob-scalar-functions)
[HTTPPUTBLOBVERBOSE and HTTPPUTCLOBVERBOSE table functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpputblobverbose-httpputclobverbose-table-functions)

#### HTTP Generic functions in SYSTOOLS

These generic HTTP functions allow you to specify the operation (GET, PUT, POST, or DELETE) as an argument, and they are exclusive to SYSTOOLS.

[HTTPBLOB and HTTPCLOB scalar functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpblob-httpclob-scalar-functions)
[HTTPBLOBVERBOSE and HTTPCLOBVERBOSE table functions](https://www.ibm.com/docs/en/i/7.5?topic=overview-httpblobverbose-httpclobverbose-table-functions)

#### HTTP Utility functions in SYSTOOLS

HTTP Utility functions are common functions to help with common HTTP related tasks.

[HTTPHEAD scalar function](https://www.ibm.com/docs/en/i/7.5?topic=overview-httphead-scalar-function)
[BASE64DECODE scalar function](https://www.ibm.com/docs/en/i/7.5?topic=overview-base64decode-scalar-function)
[BASE64ENCODE scalar function](https://www.ibm.com/docs/en/i/7.5?topic=overview-base64encode-scalar-function)
[URLDECODE scalar function](https://www.ibm.com/docs/en/i/7.5?topic=overview-urldecode-scalar-function)
[URLENCODE scalar function](https://www.ibm.com/docs/en/i/7.5?topic=overview-urlencode-scalar-function)

{% endwrap %}

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200" %}

### What are the new HTTP functions?

With the exception of HTTPHEAD and the generic functions, all of the older SYSTOOLS http functions are also available in a new QSYS2 function.  We also get an additional function for PATCH operations.  With the new set of functions comes a new naming convention that utilizes snake casing (underscores to separate words) and forgoes the use of the word 'CLOB', which is implied when the word 'BLOB' is not used.

[HTTP_DELETE and HTTP_DELETE_BLOB scalar function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-delete-http-delete-blob)
[HTTP_DELETE_VERBOSE and HTTP_DELETE_BLOB_VERBOSE table function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-delete-verbose-http-delete-blob-verbose)
[HTTP_GET and HTTP_GET_BLOB scalar function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-get-http-get-blob)
[HTTP_GET_VERBOSE and HTTP_GET_BLOB_VERBOSE table function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-get-verbose-http-get-blob-verbose)
[HTTP_PATCH and HTTP_PATCH_BLOB scalar function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-patch-http-patch-blob)
[HTTP_PATCH_VERBOSE and HTTP_PATCH_BLOB_VERBOSE table function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-patch-verbose-http-patch-blob-verbose)
[HTTP_POST and HTTP_POST_BLOB scalar function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-post-http-post-blob)
[HTTP_POST_VERBOSE and HTTP_POST_BLOB_VERBOSE table function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-post-verbose-http-post-blob-verbose)
[HTTP_PUT and HTTP_PUT_BLOB scalar function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-put-http-put-blob)
[HTTP_PUT_VERBOSE and HTTP_PUT_BLOB_VERBOSE table function](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-put-verbose-http-put-blob-verbose)

#### HTTP Utility functions in QSYS2

The Utility functions in QSYS2 don't include a replacement for HTTPHEAD, but the encoding/decoding functions are there.

[BASE64_DECODE scalar function](https://www.ibm.com/docs/en/ssw_ibm_i_75/db2/rbafzscabase64decode.htm)
[BASE64_ENCODE scalar function](https://www.ibm.com/docs/en/ssw_ibm_i_75/db2/rbafzscabase64encode.htm)
[URL_DECODE scalar function](https://www.ibm.com/docs/en/ssw_ibm_i_75/db2/rbafzscaurldecode.htm)
[URL_ENCODE scalar function](https://www.ibm.com/docs/en/ssw_ibm_i_75/db2/rbafzscaurlencode.htm)

{% endwrap %}

## How do I use these functions?

These functions are great for programmatically interacting with web based applications.  Most web based applications publish API's that allow you to interact with them.  You can imbed these DB2 functions in an RPG program, or call them with RUNSQL or run them in a CL program with RUNSQL or RUNSQLSTM.

</br>

#### To be verbose or not?

The verbose versions gives the results in table form, while the non-verbose versions only return a single result.  So whether or not you should use a verbose function or not depends on the response you are expecting from the API you are calling.  If you only expect or need 1 result, the non-verbose function is typically fine.

The following silly example shows you just one of the ways you can use them.

</br>

#### Programmatically Add an Emoji to a Gitlab merge request

Gitlab provides hundreds of documented of API's for interacting with it programmatically.  They even have APIs devoted to adding and emojis on issues, merge requests, or code snippets.

I love emojis, don't you?  Lets use QSYS2.HTTP_POST to add an emoji to a merge request, because why not?

</br>

#### Setting up authentication

In order to talk to the Gitlab server, we have to authenticate.  Gitlab, like many other web applications, has many forms of authentication.  Since I'm using the free Gitlab.com cloud based version of Gitlab, I'm limited to authenticating with a **Personal Access Token**.  This token can be generated at the user level here in the Gitlab UI:

![Gitlab: Generate a Personal Access Token](/assets/images/2024/10/Gitlab-Personal-Access-Token.png)

**note** Before publishing this article, the Personal Access Token used in the examples was deactivated.

#### DB2 SQL Code

And here is the DB2 SQL code using the qsys2 function http_post_verbose that will create an emoji reaction on our merge request:

```sql
select * from table(qsys2.http_post_verbose(
  URL => 'https://gitlab.com/api/v4/projects/54663827/merge_requests/12/award_emoji',
  REQUEST_MESSAGE => '{"name": "blowfish"}',
  OPTIONS => '{
     "header":"Authorization, Bearer glpat-Lf72AEvRRdLE5ZzfMT73",
     "header": "content-type, application/json",
     "sslTolerate": "true"   
     }'
  )) as X;
```

And heres a short clip of it working:

<video src="/assets/video/HTTP_POST.mp4" autoplay muted loop class="object-cover w-full h-full"></video>

{% wrap "px-2 mt-8 rounded-lg pb-2 border border-gray-300 bg-gray-200 break-all" %}

</br>

#### The response

Results are provided in table format, with the response message and response header.

| Response Message | Response Header |
| -----------------| --------------- |
| {"id":28929480,"name":"blowfish","user":{"id":13161585,"username":"JDubbTX","name":"John Weirich","state":"active","locked":false,"avatar_url":"https://gitlab.com/uploads/-/system/user/avatar/13161585/avatar.png","web_url":"https://gitlab.com/JDubbTX"},"created_at":"2024-10-10T01:18:11.747Z","updated_at":"2024-10-10T01:18:11.747Z","awardable_id":288981842,"awardable_type":"MergeRequest","url":null} | {"HTTP_STATUS_CODE":201,"Set-Cookie":"_cfuvid=XFU7jUuq9T9FrxGmoBO6yQ3YTfj0w0LQ_co7NGc6sC0-1728523588339-0.0.1.1-604800000; path=/; domain=.gitlab.com; HttpOnly; Secure; SameSite=None","Date":"Thu, 10 Oct 2024 01:26:28 GMT","Content-Type":"application/json","Content-Length":401,"Connection":"keep-alive","cache-control":"max-age=0, private, must-revalidate","content-security-policy":"default-src 'none'","etag":"W/\"96529b9675b71df90b0dc95bed25e38a\"","vary":"Origin","x-content-type-options":"nosniff","x-frame-options":"SAMEORIGIN","x-gitlab-meta":{"correlation_id":"24df3901242fadbc1ece9c4bb68822f9","version":"1"},"x-request-id":"24df3901242fadbc1ece9c4bb68822f9","x-runtime":0.136002,"strict-transport-security":"max-age=31536000","referrer-policy":"strict-origin-when-cross-origin","gitlab-lb":"haproxy-main-60-lb-gprd","gitlab-sv":"api-gke-us-east1-b","CF-Cache-Status":"DYNAMIC","Report-To":{"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v4?s=qN5kSgXc4srxWK1W0C%2BjEfOIP0g%2BsGx0se6HDT7KG65ecsAf2S2IsB5SrJck7KlcrAt80fwP4QcQ0vexcuBOFTp2kqN60IDx0NyQZdEh3vtGJeKV%2FNTUSz58NUs%3D"}],"group":"cf-nel","max_age":604800},"NEL":{"success_fraction":0.01,"report_to":"cf-nel","max_age":604800},"Server":"cloudflare","CF-RAY":"8d02d2898d4a695e-FRA"} |

{% endwrap %}

</br>

### Code break down

Lets break down the code above.

> `select * from table(qsys2.http_post_verbose( .... )) as X;`

This is standard notation for calling a db2 table function.  'X' in this case represents the name of the resulting table, which I don't really care about, so I just called it 'X'.  In verbose functions it might make sense to call it 'RESPONSE', because response data from the API is what is returned in the table function.

> `URL => 'https://gitlab.com/api/v4/projects/54663827/merge_requests/12/award_emoji',`

This is the URL, or internet address for the api call.  It includes the base URL, `https://gitlab.com/api/v4` and the rest contains the routing information for the request.  54663827 is the ID of the project in Gitlab.com, and 12 is the number of the merge request.  The last part specifies that we want to add an emoji.  This is all documented [here](https://docs.gitlab.com/ee/api/emoji_reactions.html#add-a-new-emoji-reaction).

> `REQUEST_MESSAGE => '{"name": "blowfish"}',`

This parameter provides the JSON formatted data we are sending to the API.  The format of the data must match the content-type.

> `OPTIONS => '{ . . . }`

HTTP functions allow for many JSON formatted options, documented [here](https://www.ibm.com/docs/en/i/7.5?topic=functions-http-get-http-get-blob#rbafzscahttpget__HTTP_options__title__1). The options parameter can specify information about header, authentication, encryption, proxy, timeout, and more, so its best to read the documentation to see all that is available.

> `"header":"Authorization, Bearer glpat-Lf72AEvRRdLE5ZzfMT73",`

This header option enables authentication with the host.  In this case we are using the user access token that we generated in the Gitlab UI above and providing it as a bearer token.

> `"header": "content-type, application/json",`

A second header option specifies the content-type of the request message.  We are sending a JSON formatted message, so we specify `application/json`.  Content-type specifies the format of the request, or the response.

> `"sslTolerate": "true"`

This option enables toleration of soft errors, such as expired certificate or certificate not in certificate store.  We need this because we have yet to set up a certificate store, or trust store.  Its important to understand that this option can allow for man-in-the-middle attacks, so it should be used with caution.

## Make It More Secure

If you were to delete the `"sslTolerate": "true"` from the request, you would likely get a **SQL 443** error that mentions `GSKit error is 6000 - Certificate is not signed by a trusted authority.`  This means that our authentication is only 1 way - the server is authenticating the user via the bearer token but our application can't authenticate the server.  So `"sslTolerate": "true"` leaves us open to man-in-the-middle attacks.  To get rid of this error we need to have a trust store that GSKit can use.

## Set up a Certificate Trust Store

If you are using the SYSTOOLS http functions, this doesn't apply.  The SYSTOOLS http functions use the java trust store.  The QSYS2 HTTP functions use a different trust store that is not set up by default.

The documentation mentions this:

> By default, the HTTP functions use the system default certificate store: /QIBM/USERDATA/ICSS/CERT/SERVER/DEFAULT.KDB. By default, this certificate store does not exist. The Digital Certificate Manager (DCM) can be used to create this certificate store and add certificates to this certificate store.

So you should be able to set up the default KDB trust store using the DCM (Digital Certificate Manager), and after that my assumption is that you won't need to explicitly refer to it, since its the default.  Since I don't have access to the DCM, I've never tried it, but plan to work with those in my organization who do have access in the near future.

IBM's documentation also offers a different solution for the trust store, which is to extract the JAVA trust store to a separate KDB trust store useable by the QSYS2 functions.  There is a DB2 script you can run in a Run Sql Scripts session to create it.  There script is located [here in the documentation](https://www.ibm.com/docs/en/i/7.5?topic=programming-http-functions-overview#rbafyhttpoverview__HTTP_SSL__title__1), but I will reprint it below.

</br>

### IBM's DB2 Script to create a KDB Trust Store

```sql
-- The following SQL script generates a KDB trust store from a Java trust  
-- store using an intermediate JKS trust store.  The IFS directory and  
-- name of the KDB trust store are set in the NEW_TRUST_DIRECTORY and 
-- NEW_TRUST_STORE variables below. 
--  
-- Create an SQL schema to contain temporary variables. 
-- The user must have permission to create a schema.  
-- 
CREATE SCHEMA FROM_JAVA_TRUST_STORE;
SET SCHEMA FROM_JAVA_TRUST_STORE;
SET PATH CURRENT PATH, FROM_JAVA_TRUST_STORE;

--
-- Define global variables for parameters to the procedure for generating new trust store. 
-- 

-- Specify the IFS directory to use for the new trust store.
-- In this example, we use /home/javaTrustStore
-- The user must have *W authority to /home in order to create this  
-- directory.  
CREATE OR REPLACE VARIABLE   NEW_TRUST_DIRECTORY VARCHAR(80) CCSID 37;
SET NEW_TRUST_DIRECTORY='/home/javaTrustStore'; 

-- Specify the name of the new trust store name
-- In this example, the name is fromJava.KDB
CREATE OR REPLACE VARIABLE   NEW_TRUST_STORE VARCHAR(80) CCSID 37;
SET NEW_TRUST_STORE = NEW_TRUST_DIRECTORY CONCAT '/fromJava.KDB'; 

-- Specify the password for the trust store.  This
-- should be changed to keep the new trust store secure. 
CREATE OR REPLACE VARIABLE   NEW_TRUST_STORE_PASSWORD VARCHAR(80) CCSID 37;
SET NEW_TRUST_STORE_PASSWORD= 'abc123';

-- Specify the Java trust store to use. 
CREATE OR REPLACE VARIABLE   JAVA_TRUST_STORE VARCHAR(80) CCSID 37;
SET JAVA_TRUST_STORE='/QOpenSys/QIBM/ProdData/JavaVM/jdk80/64bit/jre/lib/security/cacerts';

-- Specify the Java trust store password.  The default password is changeit.
-- If the password has been changed on the system, the correct value will need to be used. 
CREATE OR REPLACE VARIABLE   JAVA_TRUST_STORE_PASSWORD VARCHAR(80) CCSID 37; 
SET JAVA_TRUST_STORE_PASSWORD = 'changeit';

-- Specify the name of a temporary JKS format TRUST STORE.  
-- In this example, jksExport is used.
CREATE OR REPLACE VARIABLE JKS_TRUST_STORE VARCHAR(80) CCSID 37; 
SET JKS_TRUST_STORE = NEW_TRUST_DIRECTORY CONCAT '/jksExport';

-- Specify the password of the temporary JKS format TRUST STORE. 
-- In this example, xyz789 is used as the password.
CREATE OR REPLACE VARIABLE JKS_TRUST_STORE_PASSWORD VARCHAR(80) CCSID 37; 
SET JKS_TRUST_STORE_PASSWORD = 'xyz789' ;


-- Step 1.  Use QCMDEXC and QSH and mkdir to create a directory in which 
--          to save the new store file
CALL QSYS2.QCMDEXC( 'QSH CMD(''mkdir ' CONCAT NEW_TRUST_DIRECTORY CONCAT ''')');


-- Step 2.  Use QCMDEXC and QSH to run the keytool command to export 
--          the default java certificate store in PKCS12 format
CALL QSYS2.QCMDEXC(
   'QSH CMD(''keytool -importkeystore ' CONCAT
   ' -srcstorepass ' CONCAT JAVA_TRUST_STORE_PASSWORD CONCAT
   ' -srckeystore ' CONCAT JAVA_TRUST_STORE CONCAT
   ' -destkeystore ' CONCAT JKS_TRUST_STORE CONCAT
   ' -srcstoretype JKS -deststoretype PKCS12 ' CONCAT 
   ' -deststorepass ' CONCAT JKS_TRUST_STORE_PASSWORD CONCAT ''')');


-- Step 3.  Create an SQL procedure that will call the QSYS/QYMKIMPK API to 
--          create a keystore from the PKCS12 keystore.  A SQL7909 warning from
--          this step can be ignored. 
CREATE OR REPLACE PROCEDURE ImportKeyStore(
     STOREPATH CHAR(100) CCSID 37, 
     STOREPATHLEN INT,  
     STOREFORMAT CHAR(9) CCSID 37, 
     STOREPASSWORD CHAR(100) CCSID 37,
     STOREPASSWORDLEN INT,   
     STOREPASSWORDCCSID INT,    
     IMPORTPATH CHAR(100) CCSID 37,     
     IMPORTPATHLEN INT,     
     IMPORTFORMAT CHAR(9) CCSID 37,  
     IMPORTVERSION CHAR(11) CCSID 37,   
     IMPORTPASSWORD CHAR(100) CCSID 37,   
     IMPORTPASSWORDLEN INT,     
     IMPORTPASSWORDCCSID INT,     
     ERRORCODE CHAR(100) FOR BIT DATA) 
    LANGUAGE C PARAMETER STYLE GENERAL EXTERNAL NAME 'QSYS/QYKMIMPK';

-- Step 4.  Call the SQL procedure to call the QSYS/QYKMIMPK API to 
--          create the new keystore to be used. 
CALL IMPORTKEYSTORE(
  STOREPATH => NEW_TRUST_STORE, 
  STOREPATHLEN => LENGTH(NEW_TRUST_STORE), 
  STOREFORMAT => 'OBJN0100',	            
  STOREPASSWORD => NEW_TRUST_STORE_PASSWORD, 
  STOREPASSWORDLEN => LENGTH(NEW_TRUST_STORE_PASSWORD), 
  STOREPASSWORDCCSID => 37, 
  IMPORTPATH => JKS_TRUST_STORE, 
  IMPORTPATHLEN => LENGTH(JKS_TRUST_STORE), 
  IMPORTFORMAT => 'OBJN0100', 
  IMPORTVERSION => '*PKCS12V3 ',
  IMPORTPASSWORD => JKS_TRUST_STORE_PASSWORD,
  IMPORTPASSWORDLEN => LENGTH(JKS_TRUST_STORE_PASSWORD), 
  IMPORTPASSWORDCCSID => 37, 
  ERRORCODE => X'00000000000000000000000000000000000000000000000000000000000000');

-- Use the new trust store to verify it works.
-- This step assumes that the system has a connection to the internet and that
-- a network firewall is not interposing its own TLS certificate on the connection.
values http_get(
   URL => 'https://www.ibm.com/support/pages/sites/default/files/inline-files/xmldoc.xml',  
   OPTIONS => '{"sslCertificateStoreFile":"' CONCAT NEW_TRUST_STORE CONCAT '"}'); 

-- Cleanup the schema 
DROP SCHEMA FROM_JAVA_TRUST_STORE;
```
after using the script above to create the trust store, modify your SQL to include the path to the trust store, like this:

```sql
  select * from table(qsys2.http_post_verbose(
  URL => 'https://gitlab.com/api/v4/projects/54663827/merge_requests/12/award_emoji',
  REQUEST_MESSAGE => '{"name": "blowfish"}',
  OPTIONS => '{
     "header":"Authorization, Bearer glpat-Lf72AEvRRdLE5ZzfMT73",
     "header": "content-type, application/json",
     "sslCertificateStoreFile": "/home/javaTrustStore/fromJava.KDB"
     }'
  )) as X;
```

Tada!, now your api call is secured from man-in-the-middle attacks.  However, this API only gives us a single result.  Its silly to use the 'verbose' function when a non-verbose function will do.  Here is the same function in non-verbose form:

```sql
values qsys2.http_post(
  URL => 'https://gitlab.com/api/v4/projects/54663827/merge_requests/12/award_emoji',
  REQUEST_MESSAGE => '{"name": "blowfish"}',
  OPTIONS => '{
     "header":"Authorization, Bearer glpat-Lf72AEvRRdLE5ZzfMT73",
     "header": "content-type, application/json",
     "sslCertificateStoreFile": "/home/javaTrustStore/fromJava.KDB"  
     }'
  );
```

 The returned response is presented in a single column:

```text
{"id":28929480,"name":"blowfish","user":{"id":13161585,"username":"JDubbTX","name":"John Weirich","state":"active","locked":false,"avatar_url":"https://gitlab.com/uploads/-/system/user/avatar/13161585/avatar.png","web_url":"https://gitlab.com/JDubbTX"},"created_at":"2024-10-10T01:18:11.747Z","updated_at":"2024-10-10T01:18:11.747Z","awardable_id":288981842,"awardable_type":"MergeRequest","url":null}
```
</br>

### SYSTOOLS version

Below is the same request using systools HTTPPOSTCLOBVERBOSE.  The syntax is very similar, with a few exceptions.

1. All options must be specified in HTTPHeaders instead of OPTIONS and there are fewer of them.
2. The header information is in XML format instead of JSON.
2. We don't need to specify a trust store because the SYSTOOLS HTTP functions use the built in JAVA trust store.

```sql
select * from table(systools.httppostclobverbose(
  URL => 'https://gitlab.com/api/v4/projects/54663827/merge_requests/12/award_emoji',
  HTTPHEADER => 
  '<httpHeader>
    <header name="Authorization" value="Bearer glpat-Lf72AEvRRdLE5ZzfMT73"/>
    <header name="Content-Type" value="application/json"/>
  </httpHeader>',
  REQUESTMSG => '{"name": "blowfish"}'))
as X;
```

### Performance comparison

Disclaimer - Do your own performance testing, as results will vary.  I ran the statements listed above 10 times in ACS Run Sql Scripts, starting with a new connection / job before the 1st run.  In my case the IBM i server is based in Germany and the Gitlab server is based in California, so the round trip is quite large.  I also have no control over system resources, network configuration, etc.

</br>

#### QSYS2.HTTP_POST_VERBOSE

Iteration, Time in Seconds
1st run: 3.265
2nd run: 0.851
3rd run: 1.089
4th run: 0.867
5th run: 0.884
6th run: 1.021
7th run: 0.807
8th run: 0.899
9th run: 0.714
10th run: 0.820
Average over 10 runs: 1.1217

</br>

#### SYSTOOLS.HTTPPOSTCLOBVERBOSE

Iteration, Time in Seconds
1st run: 5.367
2nd run: 1.193
3rd run: 1.162
4th run: 1.533
5th run: 1.345
6th run: 1.171
7th run: 1.170
8th run: 1.730
9th run: 1.032
10th run: 1.013
Average over 10 runs: 1.6716

</br>

#### Performance Observations

The documentation for the QSYS2 HTTP functions states *These HTTP functions exist in QSYS2 and have lower overhead than the SYSTOOLS HTTP functions.*  That appears to be accurate based on my own testing, with a more than **half a second performance gain** averaged over 10 runs for the QSYS2 function.  When only considering only the 1st run for the job the performance gain is even greater, where QSYS2 function has a **2 second benefit**.

When performance isn't important for a specific use case, it might make sense to use a SYSTOOLS function, since you don't have the extra step of creating a trust store.

</br>

### Gotchas

* If you are having problems using any of the functions, there are some specific permissions you must have.  For me, I would receive a SQL0443 error that stated `GSKit Error is 6003 - Access to key database is not allowed`. I got this error even with `"sslTolerate": "true"` which didn't make sense to me. If you are getting the 6003 error, give [this article](https://www.scottklement.com/archives/ftpapi/201111/msg00048.html) from Scott Klement a read.  You probably need to be granted access to the *SYSTEM certificate store in the DCM.

* I had issues using the SYSTOOL HTTP functions to call [Argo CD API](https://argo-cd.readthedocs.io/en/latest/developer-guide/api-docs/) in my organization.  I kept getting a 415 Unsupported Media Type error.  Once I switched to the QSYS2 functions, it worked fine.  I never was able to get SYSTOOLS HTTPPOSTCLOBVERBOSE working with Argo, after trying several things.  The Gitlab.com example above does work, so I'm a bit stumped what the issue could be.

</br>

### What are some alternatives for using HTTP in IBM i programs?
#### cURL / QshOni's QSHCURL

cURL is a widely used command for HTTP/HTTPS communication. Its so widely used, that many API docs provide example cURL commands to call them.  cURL can be installed on IBM i via YUM package manager, and called from the PASE command line, or via QSH 5250 command. You can also use Richard Schoen's [QshOni open source package](https://github.com/richardschoen/QshOni).  It comes with a command called QSHCURL that makes using cURL a snap.

Here is the emoji example above, using cURL:

```bash
curl --request POST --header "PRIVATE-TOKEN: glpat-Lf72AEvRRdLE5ZzfMT73" "https://gitlab.com/api/v4/projects/54663827/merge_requests/12/award_emoji?name=blowfish"
```
To use this command in a 5250 QSH command, you first need to set an environmental variable.  See [this post](https://www.seidengroup.com/2021/07/08/solving-getaddrinfo-thread-failed-to-start/) for more information.

```
ADDENVVAR ENVVAR(QIBM_MULTI_THREADED) VALUE(Y) REPLACE(*YES)
QSH CMD('/QOpenSys/pkgs/bin/curl --request POST --header "PRIVATE-TOKEN: glpat-Lf72AEvRRdLE5ZzfMT73" "https://gitlab.com/api/v4/projects/54663827/merge_requests/12/award_emoji?Yname=blowfish"')                                          
```

QshOnI makes the task of using CURL from a 5250 program easier.  You must first follow the instructions to install it in the readme of the [QshOnI Git Repo](https://github.com/richardschoen/QshOni).  Once installed, add the QSHONI library to your library list and you can use the QSHCURL command.  Here is the same Gitlab example using QSHCURL.

```text
QSHCURL CMDLINE('--request POST --header "PRIVATE-TOKEN: glp
                at-Lf72AEvRRdLE5ZzfMT73" "https://gitlab.com
                /api/v4/projects/54663827/merge_requests/12/
                award_emoji?name=blowfish"')                
        DSPSTDOUT(*YES)                                     
```

![QSHCURL](/assets/images/2024/10/QSHCURL.png)

The nice thing about QSHCURL is that it provides several IBM i friendly options for evaluating the HTTP response.  You can display it, log it to the job log, save it to an IFS file, or print it out.  Pretty much anything you could ever want.

![QSHCURL Display Response](/assets/images/2024/10/QSHCURL_output.png)

</br>

#### HTTP API

Scott Klement's [HTTP API open source project](https://www.scottklement.com/httpapi/httpapi_zip.html) has been around quite a while and is used quite a bit.  With so many options thee days, I have yet to use it.

</br>

#### Use a web enabled open source language

Node.js, Python, Java, and R are all available IBM i languages, and they all have the ability to make HTTP REST Api calls either natively or through add on packages.  They are all viable options, depending on what you want to do and what your skill set is.

## Wrapping up

This post originally was going to be about just the DB2 functions, but it ended up including lots of other ways to interact with another server via HTTP calls.  With such versatility, there seems to be limitless possibilities for making your IBM i talk with the *REST* of the world.