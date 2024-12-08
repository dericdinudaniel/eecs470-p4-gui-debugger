import json
import sys
from pyDigitalWaveTools.vcd.parser import VcdParser
import math
import time
from typing import List, Union

if len(sys.argv) > 1:
    fname = sys.argv[1]
else:
    print('Give me a vcd file to parse')
    sys.exit(-1)

with open(fname) as vcd_file:
    vcd = VcdParser()
    
    start_time = time.time()
    vcd.parse(vcd_file)
    end_time = time.time()

    data = vcd.scope.children["testbench"].toJson()

    print('Time to parse: ', end_time - start_time)

    # dump json to same filename.json in testing folder
    with open("testing/" + fname.split('/')[-1] + ".json", "w") as out_file:
        json.dump(data, out_file, indent=4)



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