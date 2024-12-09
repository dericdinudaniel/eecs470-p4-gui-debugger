import React from "react";
import { ScopeData } from "@/lib/tstypes";
import { constantsStore as Constants } from "@/lib/constants-store";
import {
  displayValue,
  displayValueHex,
  extractSignalValue,
  extractSignalValueToBool,
  extractSignalValueToInt,
  parseBoolArrToString,
} from "@/lib/utils";
import { CardHeaderSmall } from "./dui/Card";
import { SimpleValDisplay } from "./dui/SimpleValDisplay";

const DisplayMultStage: React.FC<{
  className: string;
  signalMultStage: ScopeData;
  display: boolean;
  idx: number;
}> = ({ className, signalMultStage, display, idx }) => {
  // signal inputs
  const start = extractSignalValueToBool(signalMultStage, "start");
  const avail = Number(extractSignalValueToBool(signalMultStage, "avail"));

  // signal outputs
  const done = Number(extractSignalValueToBool(signalMultStage, "done"));
  const busy = Number(extractSignalValueToBool(signalMultStage, "busy"));

  // data inputs
  const prev_sum = extractSignalValueToInt(signalMultStage, "prev_sum");
  const mplier = extractSignalValueToInt(signalMultStage, "mplier");
  const mcand = extractSignalValueToInt(signalMultStage, "mcand");
  const tag_in = extractSignalValueToInt(signalMultStage, "tag_in");
  const b_mask_in = parseBoolArrToString(
    extractSignalValue(signalMultStage, "b_mask_in").value
  );

  // data outputs
  const b_mask_out = parseBoolArrToString(
    extractSignalValue(signalMultStage, "b_mask_out").value
  );
  const tag_out = extractSignalValueToInt(signalMultStage, "tag_out");
  const product_sum = extractSignalValueToInt(signalMultStage, "product_sum");
  const next_mplier = extractSignalValueToInt(signalMultStage, "next_mplier");
  const next_mcand = extractSignalValueToInt(signalMultStage, "next_mcand");
  const partial_product = extractSignalValueToInt(
    signalMultStage,
    "partial_product"
  );

  return (
    <div
      className={`justify-items-center border rounded-lg p-1 ${
        start ? "bg-good" : "bg-bad"
      }`}
    >
      <CardHeaderSmall label={`Stage ${idx}`}></CardHeaderSmall>
      <div className="justify-items-center">
        <div className="justify-items-center">
          <CardHeaderSmall label="Inputs" className="text-xs underline" />
          <div className="mt-[-.4rem] space-y-[-.50rem] w-40">
            <div className="flex gap-x-2">
              <SimpleValDisplay
                label="Tag:"
                labelClassName="text-xs"
                dataClassName="text-xs"
              >
                {tag_in}
              </SimpleValDisplay>
              <SimpleValDisplay
                label="Avail:"
                labelClassName="text-xs"
                dataClassName="text-xs"
              >
                {avail}
              </SimpleValDisplay>
            </div>
            <SimpleValDisplay
              label="B Mask: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {b_mask_in}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="Prev Sum: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {displayValueHex(prev_sum)}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="Mplier: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {displayValueHex(mplier)}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="Mcand: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {displayValueHex(mcand)}
            </SimpleValDisplay>
          </div>
        </div>

        <div className="justify-items-center">
          <CardHeaderSmall label="Outputs" className="text-xs underline" />
          <div className="mt-[-.4rem] space-y-[-.50rem] w-40">
            <SimpleValDisplay
              label="Tag: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {tag_out}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="B Mask: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {b_mask_out}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="Product Sum: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {displayValueHex(product_sum)}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="Next Mplier: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {displayValueHex(next_mplier)}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="Next Mcand: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {displayValueHex(next_mcand)}
            </SimpleValDisplay>
            <SimpleValDisplay
              label="Partial Prod: "
              labelClassName="text-xs"
              dataClassName="text-xs"
            >
              {displayValueHex(partial_product)}
            </SimpleValDisplay>
            <div className="flex gap-x-1 items-center">
              <SimpleValDisplay
                label="Done:"
                labelClassName="text-xs"
                dataClassName="text-xs"
              >
                {done}
              </SimpleValDisplay>
              <SimpleValDisplay
                label="Busy:"
                labelClassName="text-xs"
                dataClassName="text-xs"
              >
                {busy}
              </SimpleValDisplay>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type DisplayMultProps = {
  className: string;
  signalMult: any;
};
const DisplayMult: React.FC<DisplayMultProps> = ({ className, signalMult }) => {
  const multCore = signalMult?.children.mult_core;
  let mult_stages: any[] = [];
  for (let i = 0; i < Constants.get("MULT_STAGES"); i++) {
    const m = (multCore as any).children[`mstage[${i}]`] as ScopeData;
    mult_stages.push(m);
  }

  return (
    <>
      {multCore && (
        <div
          className={`${className} hover:shadow-2xl transition-shadow border rounded-lg p-2`}
        >
          <div className="flex gap-x-2">
            {mult_stages.map((stage, idx) => {
              return (
                <div key={idx}>
                  <DisplayMultStage
                    signalMultStage={mult_stages[idx]}
                    display={true}
                    className="p-2"
                    idx={idx}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayMult;
