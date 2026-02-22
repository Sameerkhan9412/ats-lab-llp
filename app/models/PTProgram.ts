import mongoose, { Schema, Document, Types } from "mongoose";

export interface IParameter {
  parameterName: string;
  testMethod: string;
  minRange: number;
  maxRange: number;
  accreditationStatus: string;
  referenceParameter: string;
}

export interface IPTProgram extends Document {
  programName: string;
  schemeCode: string;
  dispatchDate: Date;
  lastDateOfConsent: Date;
  fees: number;
  parameters: Types.DocumentArray<IParameter>;
}

const ParameterSchema = new Schema<IParameter>(
  {
    parameterName: { type: String, required: true },
    testMethod: { type: String },
    minRange: { type: Number },
    maxRange: { type: Number },
    accreditationStatus: { type: String },
    referenceParameter: { type: String },
  },
  { _id: true }
);

const PTProgramSchema = new Schema<IPTProgram>(
  {
    programName: { type: String, required: true },
    schemeCode: { type: String, required: true },
    dispatchDate: { type: Date },
    lastDateOfConsent: { type: Date },
    fees: { type: Number },
    parameters: [ParameterSchema], // Embedded
  },
  { timestamps: true }
);

export default mongoose.models.PTProgram ||
  mongoose.model<IPTProgram>("PTProgram", PTProgramSchema);