import requests;

data = {
    'ADname': '范老板',
    'password':'12345',
}

r = requests.get('http://localhost:8080/Alogin', params=data)

print(r.text)
