FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies including devDependencies (needed for build)
RUN npm install

# Explicitly install missing dependencies if they were not in package.json
RUN npm install @nestjs/config @nestjs/passport passport @nestjs/mapped-types bcrypt passport-local @types/passport-local

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
