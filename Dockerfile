FROM node:lts-buster

# Update package lists and install necessary dependencies
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

# Install PM2 globally
RUN npm install -g pm2

# Copy package.json and install dependencies before copying the rest of the application
COPY package.json .
RUN yarn install

# Copy the rest of the application code
COPY . .

# Define the command to start the application
CMD ["yarn", "start"]
