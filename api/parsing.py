from flask import jsonify
from pprint import pprint
import logging

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

discard_terms = {"file", "unnamed"}
def full_parse(cache, root_scope, num_clocks, num_cycles):
    def process_scope(scope, timestamp):
        result = {"name": scope.name}
        if hasattr(scope, 'children'):
            # result["children"] = {name: process_scope(child, timestamp) for name, child in scope.children.items()}
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

    # clock = root_scope.children["testbench"].children["clock"].data
    # for cycle in range(num_cycles):  # +1 to include the last cycle      
    #     timestamp = clock[(cycle * 2) + 1][0]
        
    #     cycle_data = process_scope(root_scope, timestamp)
    #     cache.set(f"cycle_{cycle}", cycle_data)
    
    # clock starts at 0
    clock = root_scope.children["testbench"].children["clock"].data
    for i in range(num_clocks):  # +1 to include the last cycle      
        cycle_number = (i-1) // 2
        is_negedge = i % 2 == 0
        
        is_negedge_str = "neg" if is_negedge else "pos"
        
        timestamp = clock[i][0]
        
        current_data = process_scope(root_scope, timestamp)
        
        print(f"cycle_{cycle_number}_{is_negedge_str}")
        
        cache.set(f"cycle_{cycle_number}_{is_negedge_str}", current_data)

    return "Parsing and caching complete"