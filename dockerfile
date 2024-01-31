# Use the official Node.js image as a parent image
FROM node:17

# Set environment variables for Node.js and React
ENV NODE_ENV production

# Create a directory for the app in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the app files to the container
COPY . .

# Build the React app
# RUN npm run

# Expose the port that the app will run on (adjust if needed)
EXPOSE 3000

# Define the command to start the app
CMD [ "npm", "start" ]
