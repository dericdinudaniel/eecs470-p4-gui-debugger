import time
from flask import jsonify
from pprint import pprint

# the full_parse function underwent several iterations for speedups, and i left all the main versions here for reference

def after_parse_endpoint(parser, cache):
    try:
        clock = parser.scope.children["testbench"].children["clock"].data
        num_clocks = len(clock)
        num_cycles = int((len(clock) - 1) / 2)
    except KeyError:
        raise Exception("Could not find clock data in the VCD content")
    
    # calculate time taken to parse and cache the data
    start_time = time.time()
    full_parse3(cache, parser.scope, num_clocks)
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

discard_terms = {"unnamed", "genblk", ".psel", "tmp"}
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


def full_parse3(cache, root_scope, num_clocks):
    # Dictionary to store the last accessed index for each signal
    signal_indices = {}

    # Dictionary to store preprocessed pointers to input objects and result hierarchy
    hierarchy_pointers = {}

    def initialize_hierarchy(scope, path=""):
        """Initializes hierarchy pointers and result structure."""
        result = {"name": scope.name}
        hierarchy_pointers[path] = scope  # Save a pointer to this scope
        
        if hasattr(scope, 'children'):
            result["children"] = {}
            for name, child in scope.children.items():
                if any(term in name.lower() for term in discard_terms):
                    continue
                
                current_path = f"{path}.{name}" if path else name
                result["children"][name] = initialize_hierarchy(child, current_path)
        else:
            # Base case: signal record
            if hasattr(scope, 'data'):
                result["value"] = None  # Placeholder for signal value
                result["type"] = {
                    "sigType": scope.sigType,
                    "width": scope.width
                }
        return result

    def update_values(timestamp, result, path=""):
        """Updates the values in the result structure using preprocessed pointers."""
        scope = hierarchy_pointers[path]  # Retrieve the corresponding input object
        
        if hasattr(scope, 'children'):
            for name, child_result in result["children"].items():
                current_path = f"{path}.{name}" if path else name
                update_values(timestamp, child_result, current_path)
        else:
            if hasattr(scope, 'data'):
                # i know this looks really stupid, but the parsing package for some reason just gets messed up and the data goes into the vcdId field and the data is nonexistent for some signals
                # so i have to check if the vcdId is a list or not, and get the data accordingly. really nonsensical shit
                data = None
                if (type(scope.vcdId) != str):
                    print("vcdId is a list", "path:", path, "type:", type(scope.vcdId))
                    data = scope.vcdId
                else:
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

    # Initialize the hierarchy and result structure only once
    cached_hierarchy = initialize_hierarchy(root_scope)

    clock = root_scope.children["testbench"].children["clock"].data
    for i in range(num_clocks):  # +1 to include the last cycle
        cycle_number = (i-1) // 2
        is_negedge = i % 2 == 0

        is_negedge_str = "neg" if is_negedge else "pos"

        timestamp = clock[i][0]

        # Update the values in the cached result structure
        update_values(timestamp, cached_hierarchy)

        # Store the updated result for the current cycle in the cache
        cache.set(f"cycle_{cycle_number}_{is_negedge_str}", cached_hierarchy)

    return "Parsing and caching complete"