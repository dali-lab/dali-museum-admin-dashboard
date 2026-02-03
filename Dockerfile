FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_REACT_APP_BASE_API_URL="https://dali-museum-exhibit-backend.fly.dev"
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Test nginx config during build
RUN nginx -t

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
