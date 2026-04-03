FROM node:22-alpine

# working directory
WORKDIR /app

#Add app/node_module to PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV HOST=0.0.0.0

# Dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@5.0.1 -g

# Application source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]