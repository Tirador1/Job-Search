import { Schema, model } from 'mongoose';

const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: Number,
      min: 11,
      required: true,
    },
    companyEmail: {
      type: String,
      trim: true,
    },
    companyHR: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Company = model('Company', companySchema);

export default Company;
