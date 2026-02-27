# cprg-phase1

REFLECTION AND DOCUMENTATION 

 

The project is to build a secure web application. The main goal is to configure HTTPS correctly and apply caching strategies, with maintaining clean structure. The application is a basic express-based application that includes setting up HTTPS, multiple routes and cache control for different routes and understand how security affects performance. 

Part A  

We chose a client feedback application that allows user messages, contains static content CSS, routes that cannot be cached and routes that can be cached safely, this eventually made it easier to show how decisions related to security and caching decisions work in real life. 

Part B – SSL certificate 

Open SSL to create self-signed certificate, we chose this method, as the project runs locally, we do not have a real domain name, Lets encrypt require a real domain name.  

(https://www.codegenes.net/blog/whats-the-difference-between-openssl-and-letsencrypt/)  

Steps we followed, to setup the structure: -  

npm init -y 

npm install express helmet – to install  

Then to create folder for the certificate , we used:- 

mkdir cert 

And then we ran this command  

Openssl req -nodes -new -x509 \ 

-keyout cert/server.key \ 

-out cert/server.cert \ 

-days 365 

And when it asked for details, we filled country, state, organization, common name, we used localhost – we used the same info as given in teh class activity assignment (except for the company name) 

We faced a problem at first, one file appeared instead of both, server.key and server.cert 

When checked carefully, we realized, there were some formatting issues in the command, and we were not completely doing all certificate information prompt, also there were some slashes placed incorrectly. 

After correcting the command and details correctly, we were able to create both files correctly and we realized small errors can affect how files are generated. 

We learned, .key file is the private key, .cert is the certificate, both are required to run https server. 

Browsers will show a warning for self-signed certificate that is normal for local development. 

Part C – secure http headers 

We used Helmet middleware in express to add security headers. 

It helps to protect the application by automatically setting important http headers. 

The main headers we used – content security policy (csp) , x-frame-options , x-content-type-options , hsts (http strict transport security) 

 

Why are these headers important 

Csp: helps to prevent certain types of attacks like cross-site scripting. 

x-frame-options: prevents the site to load inside iframe, and reduces clickjacking attacks. 

x-content-type-options: stops browser so it doesnot guess the incorrect file types. 

Hsts: makes sure browser used https and not http 

 

Challenges we faced with helmet: 

Initially we were not sure where to place helmet in server file. We learned that middleware order matters in express. When we placed helmet before routes, the headers were applied correctly and understood how request handling in express works. 

 

Part D routes and cache control 

Several routes were created to know different caching strategies.  

Get/ 

Purpose: home page 

Cache: default behavior 

Reason: no sensitive data is shown here. 

Get /feedback 

Purpose: to show all feedback thread 

Cache policy: no-store 

Reason: this may contain user related content, so it should not be stored in browser cache. 

Get /feedback/:id  

Purpose: shows single feedback thread 

Cache: no store 

Reason: this has more detailed information, so should not be cached. 

post /feedback/:id/message 

Purpose: adds a new message  

Cache: no store 

Reason: post requests change data, should never be cached. 

Static files ( css) 

Cache policy: public, max-age=86400 

Reason: css files are safe to cache so performance can be improved 

 

Reflection on caching decisions 

Decisions were taken m=by keeping in mind to balance performance and security 

 

For dynamic routes – caching was disabled completely to protect user data 

For static files – caching enabled to improve loading speed.  

 

Part E testing 

Ran the server using 

Node server.js 

And then visited  

https://localhost:3000 

Browser showed security warning because of self-signed certificate and accepted it for local testing. 

We confirmed, https was working, routes are loading properly, headers are being used, static files are cached. 

Part F – Lessons learned  

How https works at basic level 

To generate ssl certificate using OpenSSL 

Small errors in command can cause unexpected results 

Middleware order is important in express 

Caching affects security and performance both 

The confusing part was ssl certificate generation, as we could not understand initially, why only one file appeared. When command was corrected and information was properly filled, issue got resolved. 

Private key accidently committed to github 

During set up of https, we faced another problem, after generating ssl certificate, private key inside cert folder, we committed the entire project to github, so github flagged the repository as a private key file server.key had been uploaded publicly. 

We made a mistake by not realising that private keys should not committed, we just thought the certificate and key files were just normal setup files. . 

This was a problem, as private key is sensitive, if someone get the access, they can misuse it to impersonate the server. 

Github detected it and warned us, we realized security is not just about writing code, its also about protecting configuration files. 

Steps taken:  

We removed private key file form repository 

We added the cert/ folder to .gitignore file so it wont be tracked again. 

As key was already pushed, new ssl certificates were generated new ssl certificates to replace old ones. 

We cleaned the repository and restarted the local setup 

After regenerating he keys and updating sever configuration, we restarted node.js server and confirmed that https was working again on https://localhost:3000 

We learnt –  

Private keys should not be pushed to github. 

.gitignore is very important for security 

Small configuration files can create security risks. 

Github has built in security detection tools. 

After removing the private key, and adding cert/ folder to .gitignore file, we thought the problem was solved, but there was still an error when we restarted the server. 

The issue was we pushed the cert folder before adding it to .gitignore 

The server process might be running in the background. 

Fixing github issue: 

So we added cert/ to .gitignore file, committed the changes, removed the exposed key from repository, and regenerated a new ssl for safety to ensure private key is not tracked in future. 

Fixing the error port 3000 

After fixing github, server did not start properly, we got to know port 3000 was already being used by previous node process,  

To check which process was using the port,  

Lsof -I :3000 was used 

This showed the process ID that was using the port 

Then the process was stopped using the command 

Kill -9 <PID> 

After that we started the server again, node server.js 

We learned, private keys must never be pushed to github, .gitignore is necessary for all sensitive files, even after git history is fixed, local process can still cause issues. As errors are not related to code always, but in the background processes. 

 

We researched using chatgpt and gemini nd google as well.