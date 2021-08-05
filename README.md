# Whatsapp Redirect
A Node.js API made to organize and redirect users to WhatsApp groups during a digital product launch.

## 🧐 Motivation
When launching a digital product, sending potential buyers to a WhatsApp group is a really popular strategy. However, when the number of people interested increases, it becomes really laborious to frequently change the link that redirects leads to the group whenever the group is filled. 

That said, this API was designed to automatically store WhatsApp group links and redirect your potential clients to the latest group that isn't full.

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
