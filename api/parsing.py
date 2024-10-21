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
def full_parse(cache, root_scope, num_cycles):
    def process_scope(scope, timestamp):
        result = {"name": scope.name}
        if hasattr(scope, 'children'):
            result["children"] = {name: process_scope(child, timestamp) for name, child in scope.children.items()}
        else:
            if hasattr(scope, 'data'):
                data = scope.data
                value = None
                for time, val in data:
                    if time <= timestamp:
                        value = val
                    else:
                        break
                result["value"] = value
                result["type"] = {
                    "sigType": scope.sigType,
                    "width": scope.width
                }
        return result

    for cycle in range(num_cycles):  # +1 to include the last cycle      
        clock = root_scope.children["testbench"].children["clock"].data
        timestamp = clock[(cycle * 2) + 1][0]
        print(f"timestamp: {timestamp}")
        
        cycle_data = process_scope(root_scope, timestamp)
        cache.set(f"cycle_{cycle}", cycle_data)

    return "Parsing and caching complete"