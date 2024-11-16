# Event Publisher Dockerfile
# Step 1: Use a Node.js image as the base
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the application port (assuming the publisher is running on port 3000)
EXPOSE 3002

# Step 7: Command to run the app
CMD ["npm", "run", "start:dev"]
