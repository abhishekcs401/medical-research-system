# Stage 1: Build Angular App
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Copy custom nginx config to the correct location
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular build output to Nginx default root
COPY --from=build /app/dist/medical-research-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
