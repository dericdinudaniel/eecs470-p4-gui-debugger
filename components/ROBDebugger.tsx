import React, { useState } from "react";
import { Parser } from "binary-parser";
import * as Utils from "@/lib/utils";
import * as Constants from "@/lib/constants";
import * as Types from "@/lib/types";

type SignalType = {
  sigType: string;
  width: number;
};

type SignalData = {
  name: string;
  type: SignalType;
  value: string;
};

type ScopeData = {
  [key: string]: SignalData | { children: ScopeData };
};

type ROBDebuggerProps = {
  className: string;
  signalData: ScopeData;
};

export class ROBDataParser {
  private static parser = new Parser().endianness("big").array("entries", {
    length: Constants.ROB_SZ,
    type: new Parser()
      .uint16("T_old", { length: Types.PHYS_REG_TAG_WIDTH })
      .uint16("T_new", { length: Types.PHYS_REG_TAG_WIDTH })
      .uint8("R_dest", { length: Constants.REG_IDX_WIDTH })
      .bit1("valid")
      .bit1("retireable"),
  });

  static parseBinaryString(binaryString: string): Types.ROB_DATA[] {
    // Convert binary string to Buffer
    const binaryArray = binaryString
      .match(/.{1,8}/g)!
      .map((byte) => parseInt(byte, 2));
    const buffer = Buffer.from(binaryArray);

    // Parse the buffer
    const result = this.parser.parse(buffer);
    return result.entries;
  }

  // Helper method to validate binary string format
  static validateBinaryString(binaryString: string): boolean {
    // Check if string contains only 0s and 1s
    if (!/^[01]+$/.test(binaryString)) {
      throw new Error("Binary string must contain only 0s and 1s");
    }

    // Calculate expected length based on structure
    const bitsPerEntry =
      Types.PHYS_REG_TAG_WIDTH * 2 + // T_old and T_new
      Constants.REG_IDX_WIDTH + // R_dest
      2; // valid and retireable
    const expectedLength = bitsPerEntry * Constants.ROB_SZ;

    if (binaryString.length !== expectedLength) {
      throw new Error(
        `Binary string must be exactly ${expectedLength} bits long`
      );
    }

    return true;
  }
}

// function to extract values from the signal data
const extractSignal = (signalData: ScopeData, name: string): SignalData => {
  return (signalData as unknown as { children: ScopeData }).children[
    name
  ] as SignalData;
};

const ROBDebugger: React.FC<ROBDebuggerProps> = ({ className, signalData }) => {
  const head = Utils.binaryStringToInt(extractSignal(signalData, "head").value);
  const tail = Utils.binaryStringToInt(extractSignal(signalData, "tail").value);

  const entries = extractSignal(signalData, "entries").value;

  try {
    ROBDataParser.validateBinaryString(entries.replace(/^b/, ""));
  } catch (e) {
    console.error("Error validating ROB entries:", e);
    return <div className={className}>Error validating ROB entries</div>;
  }

  return (
    <>
      <div>ROBDebugger</div>
    </>
  );
};

export default ROBDebugger;
