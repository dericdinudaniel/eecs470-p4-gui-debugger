from flask import Flask, request, jsonify
from flask_caching import Cache
from pyDigitalWaveTools.vcd.parser import VcdParser
import re 

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route("/api/helloworld")
def hello_world():
    return "Hello, World!"

@app.route("/api/parse", methods=["POST"])
def parse_vcd_content():
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
        vcd.parse_string(vcd_content)
        
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