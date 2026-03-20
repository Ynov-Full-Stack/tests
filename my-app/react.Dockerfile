FROM node:20

# working directory
WORKDIR /app

#Add app/node_module to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@5.0.1 -g

EXPOSE 3000