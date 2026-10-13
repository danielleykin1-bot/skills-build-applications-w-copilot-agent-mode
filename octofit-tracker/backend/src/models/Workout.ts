import { model, Schema } from 'mongoose'

const workoutSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

export default model('Workout', workoutSchema)
