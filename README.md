# checkbox.io

Set up checkbox.io in ubuntu 16.04

```
sudo apt-get update && sudo apt-get upgrade
```

### Install Nginx

```
sudo apt-get install nginx
```

* check nginx status

```
vagrant@ubuntu-xenial:~/checkbox.io$ sudo systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Sat 2019-02-23 18:56:15 UTC; 37s ago
 Main PID: 29324 (nginx)
   CGroup: /system.slice/nginx.service
           ├─29324 nginx: master process /usr/sbin/nginx -g daemon on; master_process on
           ├─29325 nginx: worker process                           
           └─29326 nginx: worker process                           

Feb 23 18:56:15 ubuntu-xenial systemd[1]: Starting A high performance web server and a reverse proxy server...
Feb 23 18:56:15 ubuntu-xenial systemd[1]: Started A high performance web server and a reverse proxy server.
```

* Check firewall staus 

```
vagrant@ubuntu-xenial:~/checkbox.io$ sudo ufw status
Status: active
```

if the status is inactive

```
sudo ufw enable
```

* Add rules to the Firewall

```
sudo ufw allow 80
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 3002
sudo ufw allow 27017
```
* check Firewall status again

```
vagrant@ubuntu-xenial:~/checkbox.io$ sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
80                         ALLOW       Anywhere                  
OpenSSH                    ALLOW       Anywhere                  
Nginx HTTP                 ALLOW       Anywhere                  
3002                       ALLOW       Anywhere                  
27017                      ALLOW       Anywhere                  
80 (v6)                    ALLOW       Anywhere (v6)             
OpenSSH (v6)               ALLOW       Anywhere (v6)             
Nginx HTTP (v6)            ALLOW       Anywhere (v6)             
3002 (v6)                  ALLOW       Anywhere (v6)             
27017 (v6)                 ALLOW       Anywhere (v6)  
```

### Install MongoDB

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

* Start and check MongoDB status

```
sudo systemctl start mongod
sudo systemctl status mongod
```

```
● mongod.service - High-performance, schema-free document-oriented database
   Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
   Active: active (running) since Sat 2019-02-23 19:07:45 UTC; 2s ago
     Docs: https://docs.mongodb.org/manual
 Main PID: 30399 (mongod)
    Tasks: 19
   Memory: 28.3M
      CPU: 58ms
   CGroup: /system.slice/mongod.service
           └─30399 /usr/bin/mongod --quiet --config /etc/mongod.conf
```

* Enable automatically starting MongoDB when the system starts

```
sudo systemctl enable mongod
```

* Default MongoDB does not have user and password, so create user "myUserAdmin" with password "abc123"

```
mongo --port 27017
```

```
use admin
```
```
db.createUser(
  {
    user: "myUserAdmin",
    pwd: "abc123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

```
exit
```

* Authenticate as the user administrator.

```
mongo --port 27017 -u "myUserAdmin" -p "abc123" \
  --authenticationDatabase "admin"
```

### Set up environment variables

* Put the following setting at the end of file ~/.bashrc

```
vim ~/.bashrc
```

```
export MONGO_PORT=27017
export MONGO_IP=127.0.0.1
export MONGO_USER=myUserAdmin
export MONGO_PASSWORD=abc123
export MAIL_USER=csc519s19.rshu
export MAIL_PASSWORD=devops2019!
export MAIL_SMTP=smtp.gmail.com
export APP_PORT=3002
```

* Make it take effect

```
source ~/.bashrc
```


### Install Node.js and npm

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
```

* Check node.js version v10.15.1, npm version 6.4.1

```
nodejs -v
npm -v
```

* Go to folder 

```
cd /home/vagrant/checkbox.io/server-side/site
```

* Install npm modules

```
npm install
```

* Run the server script. In the mocha test, we do not need to execute this step, since we add server start and server close in the test case. Otherwise, the port 3002 is used, which causes issue. 

```
vagrant@ubuntu-xenial:~/checkbox.io/server-side/site$ node server.js 
Warning: missing space before text for line 3 of jade file "undefined"
express deprecated app.configure: Check app.get('env') in an if statement server.js:13:5
connect deprecated multipart: use parser (multiparty, busboy, formidable) npm module instead node_modules/connect/lib/middleware/bodyParser.js:56:20
connect deprecated limit: Restrict request size at location of read node_modules/connect/lib/middleware/multipart.js:86:15
Listening on port 3002...
connected!
connected!
connected!
connected!
```

* Set up and configure Nginx. Go to folder 

```
cd /etc/nginx
```

* Modify file **nginx.conf** and **./sites-available/default** by replacing with files from folder ./local-conf/.

* Restart nginx

```
sudo systemctl restart nginx
```

* Execute in ~/checkbox.io/server-side/site

```
node server.js
```

* Open browser http://192.168.33.250:80, and check http://192.168.33.250/api/study/vote/status, should see the results

### Mocha test

* Run the example test in /home/vagrant/checkbox.io/server-side/site

```
npm test
```

```
vagrant@ubuntu-xenial:~/checkbox.io/server-side/site$ npm test

> design-node@0.0.1 test /home/vagrant/checkbox.io/server-side/site
> mocha



  Array
    #indexOf()
      ✓ should return -1 when the value is not present

  main
    #start()
Example app listening at http://:::9001
      ✓ should start server on port 9001


  2 passing (32ms)
```

### Setup post-receive hooks in git

**post-receive**: This hook will run on a remote repository after a push has successfully been received and processed. This hook can be used for notifications or trigger other processes, such as a build.

We now try to demo a remote repository that locates on the same host with local repository.

* Create two folders

```
mkdir ~/deploy/production.git
mkdir ~/deploy/production-www
```

* Go into folder ~/deploy/production.git, and then run

```
git init --bare
```

The production.git folder is initialized as follows:

```
vagrant@ubuntu-xenial:~/deploy/production.git$ ls
branches  config  description  HEAD  hooks  info  objects  refs
```

* Go into folder ./hooks

```
cd hooks/
touch post-receive
```

Write into ./hooks/post-receive

```
#!/bin/sh

GIT_WORK_TREE=../production-www/ git checkout -f
echo "Pushed to production!"
```

* Make the post-receive script executable

```
chmod +x post-recieve
```

* Suppose our local repository locates at /home/vagrant/checkbox.io, go into folder

```
cd /home/vagrant/checkbox.io
```

* Check current remote repository we have set. By default, we only have the origin remote repository.

```
vagrant@ubuntu-xenial:~/checkbox.io$ git remote -v
origin	https://github.com/rshu/checkbox.io.git (fetch)
origin	https://github.com/rshu/checkbox.io.git (push)
```

* Let's add a new remote repository call prod, and specify the url of the remote repository. In our case, since they are located on the same host, we just need the path of remote repository.

```
 git remote add prod ../deploy/production.git/
```

* Check remote repository again

```
vagrant@ubuntu-xenial:~/checkbox.io$ git remote -v
origin	https://github.com/rshu/checkbox.io.git (fetch)
origin	https://github.com/rshu/checkbox.io.git (push)
prod	../deploy/production.git/ (fetch)
prod	../deploy/production.git/ (push)
```

* We would like trigger the post-receive hook by push to prod repository

```
vagrant@ubuntu-xenial:~/checkbox.io$ git push prod master 
Counting objects: 8884, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (8310/8310), done.
Writing objects: 100% (8884/8884), 11.93 MiB | 9.93 MiB/s, done.
Total 8884 (delta 1872), reused 0 (delta 0)
remote: Pushed to production!
To ../deploy/production.git/
 * [new branch]      master -> master
```

The message "Pushed to production!" is shown after pushing.
