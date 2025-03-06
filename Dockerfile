# Etapa 1: Build
FROM node:18.19.0 AS build

WORKDIR /app

# Copie apenas os arquivos essenciais para instalar dependências
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Instale o Angular CLI (localmente para evitar conflitos globais)
RUN npm install @angular/cli

# Copie o restante dos arquivos do projeto
COPY . .

# Compile a aplicação Angular
RUN npx ng build --configuration=production

# Etapa 2: Servidor Nginx
FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/

# Copie os arquivos construídos para o diretório padrão do Nginx
COPY --from=build /app/dist/bluebossa/browser /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 8080

# Inicie o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
