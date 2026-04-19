import time
import random
from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Route for rendering the Beautiful HTML frontend
@app.route('/')
def index():
    return render_template('index.html')

# API Route that the frontend pulls fake "real-time" data from
@app.route('/api/metrics')
def metrics():
    # Simulate some live server processing/metrics
    cpu_usage = round(random.uniform(10.0, 85.0), 1)
    memory_usage = round(random.uniform(30.0, 95.0), 1)
    active_instances = random.randint(3, 12)
    uptime = int(time.time() * 1000) # milliseconds

    data = {
        "status": "Healthy",
        "cpu": cpu_usage,
        "memory": memory_usage,
        "instances": active_instances,
        "timestamp": uptime
    }
    return jsonify(data)

if __name__ == '__main__':
    # Local development server execution
    app.run(host='127.0.0.1', port=8080, debug=True)
application=app