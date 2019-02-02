FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV LDAP_PASSWORD=**Test123
ENV JWT_SECRET=s98f498ef1dz98e1fsq65f1z9ef1
ENV JUMPCLOUD_API_KEY=1f78911d4b8583ec5023657e8678168004f8a562
ENV LDAP_USERNAME=Yaty
ENV LDAP_ORG_ID=5c1b4554225be15e269b1dd0

EXPOSE 8080
CMD [ "npm", "start" ]
