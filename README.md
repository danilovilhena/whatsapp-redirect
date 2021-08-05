# Whatsapp Redirect
A Node.js API made to organize and redirect users to WhatsApp groups during a digital product launch.

## 🧐 Motivation
When launching a digital product, sending potential buyers to a WhatsApp group is a really popular strategy. However, when the number of people interested increases, it becomes really laborious to frequently change the link that redirects leads to the group whenever the group is filled. 

That said, this API was designed to automatically store WhatsApp group links and redirect your potential clients to the latest group that isn't full.

## 🔢 How to use?
1. If you'd like to use a custom key, create a alphanumeric one. For this example, I'll use this custom key: danilo-key

1. Make a POST request to https://whatsapp.deta.dev/danilo-key to create a user. If you don't pass a custom key, we'll generate one and return it to you.

1. Include groups links making a POST request to https://whatsapp.deta.dev/danilo-key/add and add the URL in the request's body as the code below or add the ending of the WhatsApp link (in this example: E7XVpkrLPBrRr9krLPB) as a query parameter to the POST request, like `https://whatsapp.deta.dev/danilo-key/add?link=E7XVpkrLPBrRr9krLPB`:
```js
{
  link: "https://chat.whatsapp.com/E7XVpkrLPBrRr9krLPB"
}
```

4. Make a GET request to https://whatsapp.deta.dev/danilo-key to retrieve the current group URL. If you add the redirect parameter as true, the link you automatically redirect. Otherwise, it will return a object with the link.

## 💡 Useful tips
1. You don't have to create a custom key, but remember the generated one to use in the other endpoints.
1. You can add https://whatsapp.deta.dev/danilo-key&redirect=true directly in the href property, because it will redirect to the current group link.


## 🤖 API Routes
You can access this API in the following url: https://whatsapp.deta.dev. Here are the endpoints that are currently up:

### `POST /:key`  
**Creates a new user in the database**  
- **key:** Optional. If passed, uses its value as key. Otherwise, generates a random 6-digit key.  
  
**Response:**  
```js
{
  message: "Done! Here is your key: v8v7gm",
  key: "v8v7gm"
}
```

### `GET /:key?redirect=true`  
**Returns the link or redirects to the current group**  
- **key:** Key generated in the first endpoint described.
- **redirect:** Boolean. If true, automatically redirects to the group. Otherwise, returns a JSON object with the link. If omitted, the assumed value is false.

**Response:**  
```js
{
  link: "https://chat.whatsapp.com/E7XVpkrLPBrRr9krLPB"
}
```

### `POST /:key/add?link=`  
**Adds a new group link to the user's list**  
- **key:** Key generated in the first endpoint described.
- **link:** Ending of the WhatsApp link. For the link: https://chat.whatsapp.com/E7XVpkrLPBrRr9krLPB, you should pass: E7XVpkrLPBrRr9krLPB
**Response:**  
```js
{
  message: "New link added successfully!"
}
```

### `GET /:key/info`  
**Returns user information**  
- **key:** Key generated in the first endpoint described.

**Response:**  
```js
{
    "count": 0, // Number of accesses to this user's endpoint 
    "createdAt": "2021-08-05T01:13:25.888Z", 
    "key": "v8v7gm",
    "links": [
        "https://chat.whatsapp.com/GNJvHQjovSwAkzPypQZvWQ"
    ]
}
```

## 🛠 Technologies

- Node.js 
- <a href="https://expressjs.com">Express</a> 
- <a href="https://www.deta.sh">Deta</a> (Cloud service to deploy applications and databases)

## 👋 Contact
If you want to contact me you can reach me at danilo.vilhena@gmail.com

## 📙 License
This project uses the following license: <a href="https://github.com/danilovilhena/whatsapp-redirect/blob/main/LICENSE">MIT</a>.
