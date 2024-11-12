import time
from flask import jsonify
from pprint import pprint

def after_parse_endpoint(parser, cache):
    try:
        clock = parser.scope.children["testbench"].children["clock"].data
        num_clocks = len(clock)
        num_cycles = int((len(clock) - 1) / 2)
    except KeyError:
        raise Exception("Could not find clock data in the VCD content")
    
    # calculate time taken to parse and cache the data
    start_time = time.time()
    full_parse2(cache, parser.scope, num_clocks)
    end_time = time.time()
    
    return (num_clocks, num_cycles , end_time - start_time)

###########
# how vcd scope is structured
# scope
# { "name": "<scope name>"
#   "children" : {"<children name>" : child}
# }
# child can be scope or signal record
# signal record
# { "name": "<signal name>"
#   "type": {"sigType": "<vcd signal type>",
#            "width": <bit width of signal (integer)>},
#   "data": [<data records>],
# }
# data record format
# [<time (number)>, <value (string, format dependent on datatype)>]

# for every cycle, this will store into the cache the signals at that cycle, maintaining the hierarchy
# structure will be the exact same, but data will be a single value instead of a list of values

discard_terms = {"unnamed", "genblk"}
def full_parse(cache, root_scope, num_clocks):
    def process_scope(scope, timestamp):
        result = {"name": scope.name}
        if hasattr(scope, 'children'):
            result["children"] = {}
            for name, child in scope.children.items():
                if any(term in name.lower() for term in discard_terms):
                    continue
                
                result["children"][name] = process_scope(child, timestamp)
        else:
            if hasattr(scope, 'data'):
                data = scope.data
                value = None
                latest_matching_time = -1
                for time, val in data:
                    if time <= timestamp:
                        # Update the value if this is a later or equal timestamp
                        if time >= latest_matching_time:
                            latest_matching_time = time
                            value = val
                    else:
                        break
                result["value"] = value
                result["type"] = {
                    "sigType": scope.sigType,
                    "width": scope.width
                }
        return result

    clock = root_scope.children["testbench"].children["clock"].data
    for i in range(num_clocks):  # +1 to include the last cycle      
        cycle_number = (i-1) // 2
        is_negedge = i % 2 == 0
        is_negedge_str = "neg" if is_negedge else "pos"
        timestamp = clock[i][0]
        current_data = process_scope(root_scope, timestamp)
        cache.set(f"cycle_{cycle_number}_{is_negedge_str}", current_data)

    return "Parsing and caching complete"


def full_parse2(cache, root_scope, num_clocks):
    # Dictionary to store the last accessed index for each signal
    signal_indices = {}
    
    def process_scope(scope, timestamp, path=""):
        result = {"name": scope.name}
        if hasattr(scope, 'children'):
            result["children"] = {}
            for name, child in scope.children.items():
                if any(term in name.lower() for term in discard_terms):
                    continue
                
                current_path = f"{path}.{name}" if path else name
                result["children"][name] = process_scope(child, timestamp, current_path)
        else:
            if hasattr(scope, 'data'):
                data = scope.data
                scope_path = path
                
                # Initialize index for this signal if not already done
                if scope_path not in signal_indices:
                    signal_indices[scope_path] = 0
                
                value = None
                latest_matching_time = -1
                current_index = signal_indices[scope_path]
                
                # Start from the last known position
                for i in range(current_index, len(data)):
                    time, val = data[i]
                    if time <= timestamp:
                        # Update the value if this is a later or equal timestamp
                        if time >= latest_matching_time:
                            latest_matching_time = time
                            value = val
                            signal_indices[scope_path] = i
                    else:
                        break
                
                result["value"] = value
                result["type"] = {
                    "sigType": scope.sigType,
                    "width": scope.width
                }
        return result

    clock = root_scope.children["testbench"].children["clock"].data
    for i in range(num_clocks):  # +1 to include the last cycle      
        cycle_number = (i-1) // 2
        is_negedge = i % 2 == 0
        
        is_negedge_str = "neg" if is_negedge else "pos"
        
        timestamp = clock[i][0]
        
        current_data = process_scope(root_scope, timestamp)
        
        cache.set(f"cycle_{cycle_number}_{is_negedge_str}", current_data)

    return "Parsing and caching complete"