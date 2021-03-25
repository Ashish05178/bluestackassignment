As asked in assignment this is a web application to fetch the popular videos from Youtube, save them into the database, and list down the video on a webpage from the database.

API-

1.In this application we are using youtube api for fetching the videos (we can also use different nodejs library like “yt-trending-scraper” for scraping but that can failed because this library works as long as YouTube keeps its web page layout the same. Therefore, there is no guarantee that this library will work at all times ).

2.After fetching all the details we are checking the video id from db if video is present then updating the info otherwise saving each videos as a separate document in db so we can search them easily using id.

3.Second endpoint will return the videos list.

4.Third endpoint will the video in db using id and return details of videos.

Frontend-

           In frontend we have 2 pages
In First page we are fetching all the videos from second api endpoint and show them in grid view.
Videos can be also refreshed to latest using refresh button which will hit the first api.
In Second page video is autoplay as soon as page load and all the video related details will be there from third api. 
Below are the library and framework used for developing the web application-

1.Mongodb(Nosql) used for database.
2.API developed using nodejs, express and graphql.
3.Frontend developed using HTML,CSS,JS,php.
4.Apache used for running php.
5.Docker used for creating images and container.
6.Ubuntu 20 used for vm os.

Instructions to set up and run the solution on a LINUX environment-

1-Clone the repo from github
2-Install docker if that is not there in vm
3-Now we have 2 folder
Frontend, API
4-Enter the youtube api key secret in backend folder=> app.js=> fetchVideos function. 5-Now we will create mongo container for database-

docker run -d -p 27017:27017 -v ~/mongo:/data/db --name mongodb mongo:latest    
6-Now go to inside that container and create collection Videos inside bluestack db with below commands-
docker exec -it mongodb bash
show dbs
use bluestack (will create new db if it is not present)
db.createColloction("Videos")

7-Now change the mongo connecting address in backend=> app.js file(we can add mongodb container ip or conatiner name).Use below command to find ip of mongo container-

docker inspect -f '{{.NetworkSettings.IPAddress}}' mongodb
8-Now navigate inside api folder there we have docker file to create the image-
use below command to create the docker image-

	docker build -t apiserviceimage                 
9- Now create the container using the image with below code-
docker run -d --name apiservice -p 3000:3000 apiserviceimage

10-Now check the logs of apiservice container to see if everything is working fine with below command-
docker logs apiservice

11-Now if both container is working fine then we will create the docker container for running the apache2 server for php file

12- Go to frontend folder and run below docker command to create container with apache image from docker hub-
docker run -d -p 80:80 --name my-apache-php-app -v "$PWD":/var/www/html php:7.2-apache

We mapped this container to port 80 so any request come to our ip will redirect to our frontend
