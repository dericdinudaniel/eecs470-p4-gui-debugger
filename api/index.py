from flask import Flask, request, jsonify
from flask_caching import Cache
from flask_cors import CORS
from pyDigitalWaveTools.vcd.parser import VcdParser
from parsing import full_parse

import logging

app = Flask(__name__)
CORS(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route("/api/helloworld/")
def hello_world():
    return "Hello, World!"

@app.route("/api/parse/", methods=["POST"])
def parse_vcd_content():
    data = request.json
    
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No JSON data in the request"}), 400
        
        if 'fileContent' not in data:
            return jsonify({"error": "No VCD content in the request"}), 400
        
        vcd_content = data['fileContent']
        
        # Log the received content (be careful with large contents)
        logging.info(f"Received VCD content length: {len(vcd_content)}")

        # Parse VCD content
        vcd = VcdParser()
        vcd.parse_str(vcd_content)
        
        # Extract clock data and count cycles
        try:
            clock = vcd.scope.children["testbench"].children["clock"].data
            num_cycles = int((len(clock) - 1) / 2)
        except KeyError:
            return jsonify({"error": "Could not find clock data in the VCD content"}), 400
        
        full_parse(cache, vcd.scope, num_cycles)
        
        header_data = {
            "num_cycles": num_cycles,
        }
        return jsonify(header_data)

    except Exception as e:
        logging.error(f"Error processing VCD content: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/api/get_signals/<cycle>/", methods=["GET"])
def get_signals(cycle):
    try:
        parsed_data = cache.get(f"cycle_{cycle}")
        if not parsed_data:
            return jsonify({"error": "No parsed data available (not in cache)"}), 400
        
        # return a test response with a json object
        return jsonify({
            "endpoint": "/api/parse/", 
            "cycle": cycle,
            "signals": parsed_data
        })
    
    except Exception as e:
        logging.error(f"Error getting signals: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500