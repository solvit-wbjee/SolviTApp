import mongoose, { Schema, Document } from "mongoose";

// Define an interface representing a document in MongoDB.
interface IExam extends Document {
  year: number;

  uploadedAt: Date;
}

// Create a Schema corresponding to the document interface.
const yearSchema: Schema<IExam> = new Schema({
  year: {
    type: Number,
    required: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model and return your interface
export default mongoose.model<IExam>("Exam-Year", yearSchema);
