curl -X POST http://localhost:8000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin","firstName":"admin","lastName":"admin","role":"Admin"}'

curl -X POST http://localhost:8000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"client@client.com","password":"client","firstName":"client","lastName":"client","role":"Client"}'

curl -X POST http://localhost:8000/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"driver@driver.com","password":"driver","firstName":"Annlin","lastName":"Gay","role":"Driver"}'
