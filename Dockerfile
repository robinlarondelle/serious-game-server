# Provide the base image of the docker container
FROM node:current-alpine

# Select what directory the following commands should use
WORKDIR /usr/src/app

# The copy command tells docker to copy the files from the current directory
# to a certain directory INSIDE the docker container
# In this case, we copy the package.json to the working directory
# We dont copy all the files so that we can cache these steps
COPY ./package.json .
COPY ./package-lock.json .

#When the package.json file is transfered to the workdir, we want to install the npm dependencies 
RUN npm install

# We cache these steps, so that we dont have to run these steps again 
# when we make a change in the code

# This command tells Docker to copy ALL the source files to the workdirectory
COPY . .

# Set the environment variables for our application
ENV NODE_ENV=development PORT=3000

# Expose the port to the outside world of the container
EXPOSE 3000

# This command makes the application run, just like you would in a normal terminal
CMD ["npm", "start"]
