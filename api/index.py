from flask import Flask, request, jsonify
from flask_caching import Cache
from flask_cors import CORS
from pyDigitalWaveTools.vcd.parser import VcdParser
from parsing import full_parse
from pprint import pprint

import logging

app = Flask(__name__)
CORS(app)
cache = Cache(app, config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 60000,
    'CACHE_THRESHOLD': 10000
})

@app.route("/api/helloworld/")
def hello_world():
    return "Hello, World!"

@app.route("/api/parse/", methods=["POST"])
def parse_vcd_content():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No JSON data in the request"}), 400
        
        if 'fileContent' not in data:
            return jsonify({"error": "No VCD content in the request"}), 400
        
        vcd_content = data['fileContent']
        
        if not vcd_content:
            return jsonify({"error": "Empty VCD content in the request"}), 400

        # Parse VCD content
        vcd = VcdParser()
        vcd.parse_str(vcd_content)
        
        # Extract clock data and count cycles
        try:
            clock = vcd.scope.children["testbench"].children["clock"].data
            num_clocks = len(clock)
            num_cycles = int((len(clock) - 1) / 2)
            print(len(clock))
        except KeyError:
            return jsonify({"error": "Could not find clock data in the VCD content"}), 400
        
        full_parse(cache, vcd.scope, num_clocks)
        
        header_data = {
            "num_clock": num_clocks,
            "num_cycles": num_cycles,
        }
        return jsonify(header_data)

    except Exception as e:
        logging.error(f"Error processing VCD content: {str(e)}")
        # return the actual exception message
        return jsonify({"error": str(e)}), 500

@app.route("/api/parse_local/", methods=["POST"])
def parse_localvcd_content():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No JSON data in the request"}), 400
        
        if 'localFilename' not in data:
            return jsonify({"error": "No VCD content in the request"}), 400
        
        filename = data['localFilename']
    
        with open(f"uploads/{filename}.vcd", 'r') as vcd_file:
            # Parse VCD content
            vcd = VcdParser()
            vcd.parse(vcd_file)
            
            # Extract clock data and count cycles
            try:
                clock = vcd.scope.children["testbench"].children["clock"].data
                num_clocks = len(clock)
                num_cycles = int((len(clock) - 1) / 2)
                print(len(clock))
            except KeyError:
                return jsonify({"error": "Could not find clock data in the VCD content"}), 400
            
            full_parse(cache, vcd.scope, num_clocks, num_cycles)
            
            header_data = {
                "num_clock": num_clocks,
                "num_cycles": num_cycles,
            }
            return jsonify(header_data)

    except Exception as e:
        logging.error(f"Error processing VCD content: {str(e)}")
        # return the actual exception message
        return jsonify({"error": str(e)}), 500

@app.route("/api/get_signals/<cycle_number>/<edge>", methods=["GET"])
def get_signals(cycle_number, edge):
    try:
        is_posedge = edge == "pos"
        
        parsed_data = cache.get(f"cycle_{cycle_number}_{edge}")
        if not parsed_data:
            return jsonify({"error": "No parsed data available (not in cache)"}), 400
        
        # return a test response with a json object
        return jsonify({
            "endpoint": "/api/parse/", 
            "cycle_number": cycle_number,
            "edge": edge,
            "signals": parsed_data
        })
    
    except Exception as e:
        logging.error(f"Error getting signals: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500