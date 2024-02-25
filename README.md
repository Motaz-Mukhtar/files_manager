# Files Manager Website

A platform that allows users to manage and organize their files efficiently. Users can upload, download, view, and delete files using this web application, you can try it (The project still under development) [here](http://54.165.42.34)

## Features

- **File Upload**: Easily upload files from your device to the website.

- **File Download**: Download files stored on the website to your device.

- **File Viewing**: View the contents of text files directly within the browser.

- **File Deletion**: Delete unwanted files from your account.

## Tehcnologies Used (MERN Stack)

- **Frontend**: Html5, Css3, React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, RedisDB
- **File Storage**: Local file system.
- **Authentication**: Bearer Authentication.

## API Routes

The backend server provides the following API routes:

**GET /api/status**: Return the status of mongodb server and redis server.

    $ curl http://localhost:5000/api/status
    {"redis": true, "mongodb": true}
    $
\
**GET /api/auth/connect**: Log in an existing user.

    $ curl -X POST http://localhost:5000/api/auth/connect
    \ -H "Authorization: Bearer Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE="
    {token: "301bfdca-4edc-1e54-aaae-1c121317ad8d"}
    $
\
**GET /api/auth/disconnect**: Log out the current user.

    curl http://localhost:5000/api/auth/disconnect
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"


\
**POST /api/auth/users**: Sign up user.
    
    $ curl 0.0.0.0:5000/users -XPOST 
    \ -H "Content-Type: application/json"
    \ -d '{ "email": "test@gmail.com", "password": "abab1234!" }'
    {"id":"5d1c7cad03a394508232451d","email":"test@gmail.com"}
    $
\
**GET /api/users/me** (Authorization required): Retrieve the current user data.

    $ curl http://localhost:5000/api/users/me
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"
    {"id":"5d1c7cad03a394508232451d","email":"test@gmail.com"}
    $
\

**POST /api/files** (Authorization required) : Upload a new file.

    $ curl -X POST http://localhost:5000/api/files
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"
    \ -H "Content-Type: application/json"
    \ -d '{ "name": "myText.txt", "type": "file", "data": "SGVsbG8gV2Vic3RhY2shCg==" }' ; echo ""
    {"id":"5f1e879ec7ba06511e683b22","userId":"5d1c7cad03a394508232451d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}
    $

\
**GET /api/files/:fileId**: Get details of a specific file.

    $ curl http://localhost:5000/api/files/5f1e879ec7ba06511e683b22
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"
    {"id":"5f1e879ec7ba06511e683b22","userId":"5d1c7cad03a394508232451d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}
    $

\
**GET /api/files** (Authorization required): Get a list of files uploaded by the current user.

    $ curl http://localhost:5000/api/files
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"
    [{"id":"5f1e879ec7ba06511e683b22","userId":"5d1c7cad03a394508232451d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}]
    $

\
**GET /api/files/:fileId/data**: Get the data/content of a specific file (if the file was private the server will return not found error 404).

    $ curl http://localhost:5000/api/files/5f1e879ec7ba06511e683b22/data
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"
    {"data": "Hello Webstack!"}
    $
\
**GET /download/:fileId**: Download a specific file uploaded by the user.

\
**PUT /api/files/:fileId/publish** (Authorization required): Make a specific file public.

    $ curl http://localhost:5000/api/files/5f1e879ec7ba06511e683b22/publish
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"
    $
\
**PUT /api/files/:fileId/unpublish** (Authorization required): Make a specific file private.

    $ curl http://localhost:5000/api/files/5f1e879ec7ba06511e683b22/unpublish
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"    
    $

\
**DELETE /api/files/:id** (Authorization required): Delete a specific file.

    $ curl http://localhost:5000/api/files/5f1e879ec7ba06511e683b22
    \ -H "X-Token: 301bfdca-4edc-1e54-aaae-1c121317ad8d"    
    $

## License

This project is licensed under the MIT license - see the [LICENSE](https://github.com/Motaz-Mukhtar/files_manager/blob/main/LICENSE) file for details.
