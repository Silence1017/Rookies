import requests;

data = {
    'username': '范宇豪',
    'password':'123',
    'r_username': '罗某',
    'r_password': '123'
}

r = requests.get('http://localhost:8080/register', params=data)

print(r.text)
