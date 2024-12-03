import json
import sys
from pyDigitalWaveTools.vcd.parser import VcdParser
import math
from typing import List, Union

if len(sys.argv) > 1:
    fname = sys.argv[1]
else:
    print('Give me a vcd file to parse')
    sys.exit(-1)

with open(fname) as vcd_file:
    vcd = VcdParser()
    vcd.parse(vcd_file)

    data = vcd.scope.children["testbench"].toJson()
    # print(json.dumps(data, indent=4, sort_keys=True))
    # test = vcd.scope.children["testbench"].children["mustafa"].children["Front_End"].children["fetcher"].children["cacher"].children["take_branch"].vcdId
    reset = vcd.scope.children["testbench"].children["reset"];
    print(type(reset.vcdId))
    # test1 = test[0]
    # time, value = test1
    # print(vcd.scope.children["testbench"].children["mustafa"].children["Front_End"].children["fetcher"].children["cacher"].children["take_branch"].vcdId)
    # print(vcd.scope.children["testbench"].children["mustafa"].children["Front_End"].children["fetcher"].children["cacher"].children["take_branch"]);
    
    print("time, value")
############

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