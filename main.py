import firebase_admin
from firebase_admin import credentials, messaging
from flask import Flask, render_template, request, Response, session, jsonify

app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY="dev",
)

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

FIREBASE_CONFIG = {
    "apiKey": "copy_your_firebase_config",
    "authDomain": "copy_your_firebase_config",
    "projectId": "copy_your_firebase_config",
    "storageBucket": "copy_your_firebase_config",
    "messagingSenderId": "copy_your_firebase_config",
    "appId": "copy_your_firebase_config",
    "measurementId": "copy_your_firebase_config",
    "vapidkey": "copy_your_firebase_config"
}

# ask permission for push notification from user
@app.route("/", methods=["GET"])
def permission_notification():
    print("ask permission for notification")
    return render_template("get_permission.html")


# save FCM_token somewhere like database
# here we save it in session
@app.route("/save_token", methods=["POST"])
def save_token():
    fcm_token = request.json.get('fcm_token')
    
    if not fcm_token:
        return {'error': 'no token received'}, 404
    
    session["FCM_token"] = fcm_token
    return jsonify({"success": "ok"})


# send push notificatoin to user device
@app.route("/send_push_request", methods=["GET"])
def send_push():
    token = session.get('FCM_token')
    message = messaging.Message(
        data={
            "title": "clicked",
            "body": "click on push notification to redirect",
            "click_action": "http://127.0.0.1:8000/clicked_notification",
            "image": "",
            "custom_key": "custom_value",
        },
        token=token,
    )
    try:
        response = messaging.send(message)
        return {"notification response": response}
    except:
        return {'error':'error sending push notification'}


@app.route("/clicked_notification")
def clicked_notification():
    return render_template('clicked.html')


# render firebase-messaging-sw.js if it placed in another folder
@app.route("/firebase-messaging-sw.js")
def worker():
    content = render_template("/firebase-messaging-sw.js")
    return Response(content, mimetype="text/javascript")


# firebase_credentials if user is authenticated
@app.route("/get_firebase_conf", methods=["GET"])
def get_firebase_conf():
    is_authenticated = True
    if not is_authenticated:
        return jsonify({'error': 'not authenticated'}), 401
    
    return jsonify(FIREBASE_CONFIG)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
