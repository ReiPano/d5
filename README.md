# User Story

To start the dev server write: ```npm run quickstart ```.
To start the server write: ```symfony serve --no-tls```.

Before starting the angular dev server make sure to modify the url property in the ```shared.service.ts```. In order to use the application from a mobile device or other devices connected to the same network, enter the local ip address of the computer. Otherwise replace the current value with ```http://lacalhost:8000```.

The user interface is responsive. However, using Chrome's build in feature to simulate a mobile device may cause problems. In order to properly test the application, the usage of a mobile device is recommended. 

# Features

  - User login
  - User logout
  - User register
  - User modify profile picture and background image
  - Add new post
  - View post
  - Delete post
  - View user's post
  - Vire other users posts
  - Logout
