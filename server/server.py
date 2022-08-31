from flask import Flask, jsonify

app = Flask(__name__)
# barebones

@app.route("/")
def index():
    return 


@app.route("/login/<email>?<password>")
def login():
    return 

@app.route("/dashboard")
def dashboard():
    return 


@app.route("/logout")
def logout():
    return

@app.route("/renewToken")
def renewToken():
    return

if __name__ == "__main__":
    app.run(debug=True)