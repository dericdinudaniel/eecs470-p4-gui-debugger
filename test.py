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
    # data = vcd.scope.children["testbench"].children["DUT"].toJson()
    data = vcd.scope.children["testbench"].toJson()
    print(json.dumps(data, indent=4, sort_keys=True))
    
############
    

# Constants based on your SystemVerilog code
ROB_SZ = 3
PHYS_REG_TAG_SIZE = 6  # 6 bits for PHYS_REG_TAG
REG_IDX_SIZE = 5       # 5 bits for REG_IDX
ROB_DATA_SIZE = 19     # Total size of ROB_DATA in bits

# Define the ROB_DATA struct in Python
# Define the ROB_DATA struct in Python
class ROB_DATA:
    def __init__(self, T_old: Union[int, str], T_new: Union[int, str], R_dest: Union[int, str], valid: Union[bool, str], retireable: Union[bool, str]):
        self.T_old = T_old
        self.T_new = T_new
        self.R_dest = R_dest
        self.valid = valid
        self.retireable = retireable

    def __str__(self):
        return (f"T_old: {self.T_old}, T_new: {self.T_new}, R_dest: {self.R_dest}, "
                f"valid: {self.valid}, retireable: {self.retireable}")

def parse_field(field_bits: str) -> Union[int, str]:
    """Parse a field, returning NaN if it contains 'x', otherwise the integer value."""
    if 'x' in field_bits:
        return 'X'
    return int(field_bits, 2)

def parse_rob_data(binary_string: str) -> List[ROB_DATA]:
    # Ensure the binary string is valid
    if len(binary_string) != ROB_SZ * ROB_DATA_SIZE:
        raise ValueError(f"Binary string length must be {ROB_SZ * ROB_DATA_SIZE} bits.")
    
    rob_data_list = []
    for i in range(ROB_SZ):
        # Extract the bits for each ROB_DATA entry
        start_index = i * ROB_DATA_SIZE
        end_index = start_index + ROB_DATA_SIZE
        entry_bits = binary_string[start_index:end_index]

        # Parse individual fields
        T_old = parse_field(entry_bits[0:PHYS_REG_TAG_SIZE])
        T_new = parse_field(entry_bits[PHYS_REG_TAG_SIZE:2*PHYS_REG_TAG_SIZE])
        R_dest = parse_field(entry_bits[2*PHYS_REG_TAG_SIZE:2*PHYS_REG_TAG_SIZE + REG_IDX_SIZE])
        valid = parse_field(entry_bits[2*PHYS_REG_TAG_SIZE + REG_IDX_SIZE])
        retireable = parse_field(entry_bits[2*PHYS_REG_TAG_SIZE + REG_IDX_SIZE + 1])

        # Create a ROB_DATA instance
        rob_data = ROB_DATA(T_old, T_new, R_dest, valid, retireable)
        rob_data_list.append(rob_data)
    
    return rob_data_list

def parse_rob_data(binary_string: str) -> List[ROB_DATA]:
    # Ensure the binary string is valid
    if len(binary_string) != ROB_SZ * ROB_DATA_SIZE:
        raise ValueError(f"Binary string length must be {ROB_SZ * ROB_DATA_SIZE} bits.")
    
    rob_data_list = []
    # Iterate in reverse order for ROB entries
    for i in range(ROB_SZ-1, -1, -1):
        # Extract the bits for each ROB_DATA entry
        start_index = i * ROB_DATA_SIZE
        end_index = start_index + ROB_DATA_SIZE
        entry_bits = binary_string[start_index:end_index]

        # Parse individual fields
        T_old = parse_field(entry_bits[0:PHYS_REG_TAG_SIZE])
        T_new = parse_field(entry_bits[PHYS_REG_TAG_SIZE:2*PHYS_REG_TAG_SIZE])
        R_dest = parse_field(entry_bits[2*PHYS_REG_TAG_SIZE:2*PHYS_REG_TAG_SIZE + REG_IDX_SIZE])
        valid = parse_field(entry_bits[2*PHYS_REG_TAG_SIZE + REG_IDX_SIZE])
        retireable = parse_field(entry_bits[2*PHYS_REG_TAG_SIZE + REG_IDX_SIZE + 1])

        # Create a ROB_DATA instance
        rob_data = ROB_DATA(T_old, T_new, R_dest, valid, retireable)
        rob_data_list.append(rob_data)
    
    return rob_data_list


# binary_string ="b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011000011xxxxx10000010000010xxxxx10000001000001xxxxx10"
# binary_string ="b000011000011xxxxx10000010000010xxxxx10000001000001xxxxx10"
# binary_string = binary_string[1:]\
    
# # Remove the leading 'b' if present
# if binary_string.startswith('b'):
#     binary_string = binary_string[1:]

# # Parse and print the ROB_DATA array
# rob_data_array = parse_rob_data(binary_string)
# for idx, data in enumerate(rob_data_array):
#     print(f"ROB_DATA[{idx}]: {data}")