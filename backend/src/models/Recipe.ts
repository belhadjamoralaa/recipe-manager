import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRecipe extends Document {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  author: mongoose.Types.ObjectId;
  favoritesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, required: true },
    imageUrl: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    favoritesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Recipe: Model<IRecipe> = mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
