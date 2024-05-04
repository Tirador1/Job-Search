# Step 1: Use a minimal Node.js base image
FROM node:18.19-alpine

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Expose the port that the API server will run on
EXPOSE 5000

# Step 7: Define the command to run your Node.js application
CMD ["node", "index.js"]
