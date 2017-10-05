# Use an official Python runtime as a parent image
FROM node:8

# Set the working directory to /app
WORKDIR /

# Copy the current directory contents into the container at /app
ADD . /

# Install any needed packages specified in requirements.txt
RUN yarn install

# Make port available to the world outside this container
EXPOSE 7678

# Define environment variable
ENV NAME NODE_ENV
ENV NAME CONFIG_FILE

# Run app.py when the container launches
CMD ["npm", "run", "server"]