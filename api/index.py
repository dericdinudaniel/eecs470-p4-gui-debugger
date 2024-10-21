from flask import Flask, request, jsonify
from flask_caching import Cache
from flask_cors import CORS
from pyDigitalWaveTools.vcd.parser import VcdParser

import logging
import re
from io import StringIO

app = Flask(__name__)
CORS(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route("/api/helloworld/")
def hello_world():
    return "Hello, World!"

@app.route("/api/parse/", methods=["POST"])
def parse_vcd_content():
    data = request.json
    # print(f"Received data: {data['fileContent']}")  # Debug print statement
    # return {"status": "success"}, 200
    
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
            num_cycles = len(clock)
        except KeyError:
            return jsonify({"error": "Could not find clock data in the VCD content"}), 400
        
        # Find timescale (this regex needs to be adjusted based on your VCD format)
        import re
        pattern = r'\$timescale\s+(\d+)ps\s+\$end'
        match = re.search(pattern, vcd_content)
        timescale = int(match.group(1)) if match else None
        
        parsed_data = {
            "num_cycles": num_cycles,
            "timescale": timescale
        }
        
        # Store the parsed data in cache if needed
        cache.set('parsed_data', parsed_data)

        return jsonify(parsed_data)

    except Exception as e:
        logging.error(f"Error processing VCD content: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/api/get_signals/<cycle>/", methods=["GET"])
def get_signals(cycle):
    try:
        # Get the parsed data from cache
        parsed_data = cache.get('parsed_data')
        if not parsed_data:
            return jsonify({"error": "No parsed data found in cache"}), 400
        
        # Get the VCD content from cache
        vcd_content = cache.get('vcd_content')
        if not vcd_content:
            return jsonify({"error": "No VCD content found in cache"}), 400
        
        # Parse VCD content
        vcd = VcdParser()
        vcd.parse_str(vcd_content)
        
        # Get the clock data
        clock = vcd.scope.children["testbench"].children["clock"].data
        
        # Get the timescale
        timescale = parsed_data['timescale']
        
        # Get the signals at the specified cycle
        cycle = int(cycle)
        signals = {}
        for signal_name, signal_data in vcd.scope.children["testbench"].children.items():
            if signal_name == "clock":
                continue
            signals[signal_name] = signal_data.data[cycle]
        
        return jsonify(signals)
    
    except Exception as e:
        logging.error(f"Error getting signals: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500