FROM node:12 as build

RUN useradd -ms /bin/bash code
RUN mkdir /code
RUN chown -R code:code /code
USER code
WORKDIR /code

COPY package.json package-lock.json /code/
RUN npm ci

COPY --chown=code:code . /code/

RUN npm run build

RUN rm -rf node_modules

FROM node:12

ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

RUN useradd -ms /bin/bash code

RUN mkdir /code
RUN chown -R code:code /code
USER code
WORKDIR /code

ENTRYPOINT [ "npm", "run", "start" ]

COPY --chown=code:code package.json package-lock.json /code/
RUN npm ci

COPY --chown=code:code --from=build /code /code
