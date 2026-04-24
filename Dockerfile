FROM node:18-alpine
WORKDIR /src
COPY . ./

ENV NEXT_PUBLIC_APP_URL=https://getpm.in

RUN yarn install --omit=dev
RUN yarn run build

EXPOSE 4000

CMD ["yarn", "start"]