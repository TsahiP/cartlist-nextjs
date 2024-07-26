import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      // required: true,
      // min:6
    },
    img: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const itemSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      desc: {
        type: String,
        default: "",
      },
      img: {
        type: String,
        default: "",
      },

    },
    { timestamps: true }
  );
  
// sharedWith schema
const sharedWithSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
      },
      permission: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      }
    },
    { timestamps: true }
  );


  const listSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      creatorId: {
        type: String,
        required: true,
      },
      items: [itemSchema],
      sharedWith: [sharedWithSchema],
    },
    { timestamps: true }
  );

// export const User = mongoose.models?.User || mongoose.model("User", userSchema);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const List = mongoose.models?.List || mongoose.model("List", listSchema);
