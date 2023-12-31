<p align="center">
    <img width=25% src="https://firebase.google.com/static/downloads/brand-guidelines/PNG/logo-built_white.png">
    <img width=35% src="https://flask.palletsprojects.com/en/3.0.x/_images/flask-horizontal.png">
</p>

> <p align="center">basic push notification with firebase and flask</p>

## Prerequisites

>Before diving into the implementation, make sure you have the following prerequisites in place:

- Sign up for a [Firebase account](https://firebase.google.com/) and create a new project.

- After creating the project, you’ll be redirected to the Firebase console. Click on the gear icon `(⚙️)` and select `Project settings`.

- Under the `General` tab, scroll down to the `Your apps` section and click on the `Add app` button then click on `</>` for webapp.

- Copy the Firebase configuration object containing keys and identifiers for your app. open the main.py file and paste the data in `FIREBASE_CONFIG`

- In the Firebase console, navigate to `Service accounts` click on `Generate new private key` download the `serviceAccountKey.json` file, and replace the file in the root of the project.

## Setting Up Virtual Environment and Installing Dependencies

first create an enviroment for python and install requirments package:
```shell
python -m venv .venv
# if you are in windows
source .venv/scripts/activate

# if you are in linux
source .venv/bin/activate

pip install -r requirements.txt

# now you are ready to run the app
python main.py
```

# Overview of Project Files

1.  <details>
    <summary>base.html</summary>

    If a user is on our website and a notification arrives, we need to display that notification to the user on every page, and `onMessage` method is precisely designed to accomplish this.

    </details>

2.  <details>
    <summary>firebase-messaging-sw.js</summary>

    > This is our `Service worker` that we register when the user grants us permission for notifications.

    - When attempting to register the worker in the browser, we retrieve the Firebase configuration from the API. We then utilize `onBackgroundMessage` to handle notifications, whether the page is in the foreground (has focus) or in the background, hidden behind other tabs, or completely closed.

    - We implement a `notificationclick event` listener for when a user clicks on a notification. The intended functionality, such as opening a new page with the URL set in the notification, will be executed. It's important to note that this event will occur across all user pages.

    - We have additional event listeners such as `push` and `pushsubscriptionchange` that we can leverage based on our specific requirements.


    </details>

3.  <details>
    <summary>worker_permission.js</summary>

    - If the user grants permission for notifications, we retrieve the Firebase configuration from the API and.

    - We use the `getToken` method to obtain a token generated by Firebase.

    - To persist this token, we need save it in the database so we send the token to the backend API.

    </details>

4.  <details>
    <summary>main.py</summary>

    1. In the firest view of this file, we render `get_permission.html`, which includes the worker_permission.js file to request permission from the user for creating a service worker.

    2. In the route for `/save_token`, we are currently saving the token in the session, just for the purpose of understanding the basics. However, the token would typically be stored in the database in a production scenario.

    3. In the route for `/send_push_request`, we currently send a simple push notification to a user using the token saved in the session. However, it's important to note that we can also send notifications to multiple users, depending on our specific needs.

    4. In the route for `/clicked_notification`, we simply render a page. This occurs when a user clicks on a notification that we have sent.

    5. In the route for `/firebase-messaging-sw.js`, we return a JavaScript file. This is necessary because the Firebase script attempts to create a worker by reading that route. However, our `firebase-messaging-sw.js` code is stored in a different folder, so we employ this workaround here.

    6. In the route for `/get_firebase_conf`, we send a JSON data of the Firebase configuration obtained from the Firebase website. Additionally, we can set authentication permissions to control access to this data.
    </details>
