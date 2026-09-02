# Five Container Task Manager

Java, React, MySQL, Redis ve Nginx kullanılarak hazırlanmış beş containerlı görev yönetimi uygulaması.

## Mimari

```text
Browser
   |
   v
Nginx Gateway :8088
   |
   +-- / ---------> React Frontend
   |
   +-- /api/* ----> Spring Boot Backend
                         |
                         +--> MySQL
                         |
                         +--> Redis


----------------------
Containerlar:

Servis	        Görevi	                     Host portu
gateway 	Sistemin giriş noktası    	8088
frontend	React arayüzü            	3000
backend	        Spring Boot REST API    	8082
database	MySQL veritabanı        	3306
redis    	Önbellek	                Dahili 6379


Teknolojiler
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Cache
- React
- Vite
- MySQL 8.4
- Redis 7
- Nginx
- Docker
- Docker Compose
