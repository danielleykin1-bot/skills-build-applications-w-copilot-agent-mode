import mongoose from 'mongoose'
import Activity from '../models/Activity.js'
import Leaderboard from '../models/Leaderboard.js'
import Team from '../models/Team.js'
import User from '../models/User.js'
import Workout from '../models/Workout.js'
import { connectDatabase } from '../config/database.js'

async function createOrUpdate<T>(
  findExisting: () => Promise<T | null>,
  create: () => Promise<T>,
  update: () => Promise<T | null>,
  label: string,
): Promise<T> {
  if (!(await findExisting())) {
    return create()
  }

  const record = await update()
  if (!record) {
    throw new Error(`Could not update seeded ${label}`)
  }
  return record
}

/**
 * Seed the octofit_db database with test data.
 */
async function seedDatabase() {
  await connectDatabase()

  try {
    const teamRecords = await Promise.all([
      createOrUpdate(
        () => Team.findOne({ name: 'Trail Blazers' }),
        () => Team.create({
          name: 'Trail Blazers',
          description: 'A team focused on outdoor running and endurance.',
        }),
        () => Team.findOneAndUpdate(
          { name: 'Trail Blazers' },
          { $set: { description: 'A team focused on outdoor running and endurance.' } },
          { returnDocument: 'after' },
        ),
        'Trail Blazers team',
      ),
      createOrUpdate(
        () => Team.findOne({ name: 'Power Pioneers' }),
        () => Team.create({
          name: 'Power Pioneers',
          description: 'A team building strength through consistent training.',
        }),
        () => Team.findOneAndUpdate(
          { name: 'Power Pioneers' },
          { $set: { description: 'A team building strength through consistent training.' } },
          { returnDocument: 'after' },
        ),
        'Power Pioneers team',
      ),
    ])
    const teams = new Map(teamRecords.map((team) => [team.name, team]))

    const userRecords = await Promise.all([
      createOrUpdate(
        () => User.findOne({ email: 'alex.morgan@example.com' }),
        () => User.create({
          email: 'alex.morgan@example.com',
          name: 'Alex Morgan',
          team: teams.get('Trail Blazers')!._id,
        }),
        () => User.findOneAndUpdate(
          { email: 'alex.morgan@example.com' },
          { $set: { name: 'Alex Morgan', team: teams.get('Trail Blazers')!._id } },
          { returnDocument: 'after' },
        ),
        'Alex Morgan user',
      ),
      createOrUpdate(
        () => User.findOne({ email: 'jamie.chen@example.com' }),
        () => User.create({
          email: 'jamie.chen@example.com',
          name: 'Jamie Chen',
          team: teams.get('Trail Blazers')!._id,
        }),
        () => User.findOneAndUpdate(
          { email: 'jamie.chen@example.com' },
          { $set: { name: 'Jamie Chen', team: teams.get('Trail Blazers')!._id } },
          { returnDocument: 'after' },
        ),
        'Jamie Chen user',
      ),
      createOrUpdate(
        () => User.findOne({ email: 'sam.rivera@example.com' }),
        () => User.create({
          email: 'sam.rivera@example.com',
          name: 'Sam Rivera',
          team: teams.get('Power Pioneers')!._id,
        }),
        () => User.findOneAndUpdate(
          { email: 'sam.rivera@example.com' },
          { $set: { name: 'Sam Rivera', team: teams.get('Power Pioneers')!._id } },
          { returnDocument: 'after' },
        ),
        'Sam Rivera user',
      ),
    ])
    const users = new Map(userRecords.map((user) => [user.email, user]))

    await Promise.all([
      Team.updateOne(
        { name: 'Trail Blazers' },
        { $addToSet: { members: { $each: [users.get('alex.morgan@example.com')!._id, users.get('jamie.chen@example.com')!._id] } } },
      ),
      Team.updateOne(
        { name: 'Power Pioneers' },
        { $addToSet: { members: users.get('sam.rivera@example.com')!._id } },
      ),
    ])

    const activities = [
      {
        email: 'alex.morgan@example.com',
        type: 'Outdoor run',
        durationMinutes: 38,
        distanceKilometers: 6.2,
        calories: 410,
        recordedAt: new Date('2026-10-10T08:00:00.000Z'),
      },
      {
        email: 'jamie.chen@example.com',
        type: 'Cycling',
        durationMinutes: 52,
        distanceKilometers: 18.5,
        calories: 520,
        recordedAt: new Date('2026-10-11T09:30:00.000Z'),
      },
      {
        email: 'sam.rivera@example.com',
        type: 'Strength training',
        durationMinutes: 45,
        calories: 330,
        recordedAt: new Date('2026-10-11T17:00:00.000Z'),
      },
      {
        email: 'alex.morgan@example.com',
        type: 'Interval run',
        durationMinutes: 30,
        distanceKilometers: 4.8,
        calories: 375,
        recordedAt: new Date('2026-10-12T07:45:00.000Z'),
      },
    ]
    await Promise.all(
      activities.map(async ({ email, ...activity }) => {
        const userId = users.get(email)!._id
        const filter = { user: userId, type: activity.type, recordedAt: activity.recordedAt }
        const values = { ...activity, user: userId }
        return createOrUpdate(
          () => Activity.findOne(filter),
          () => Activity.create(values),
          () => Activity.findOneAndUpdate(filter, { $set: values }, { returnDocument: 'after' }),
          `${activity.type} activity`,
        )
      }),
    )

    const leaderboardEntries = [
      { email: 'alex.morgan@example.com', points: 1280 },
      { email: 'jamie.chen@example.com', points: 1045 },
      { email: 'sam.rivera@example.com', points: 920 },
    ]
    await Promise.all(
      leaderboardEntries.map(async ({ email, points }) => {
        const userId = users.get(email)!._id
        return createOrUpdate(
          () => Leaderboard.findOne({ user: userId }),
          () => Leaderboard.create({ user: userId, points }),
          () => Leaderboard.findOneAndUpdate(
            { user: userId },
            { $set: { points } },
            { returnDocument: 'after' },
          ),
          `leaderboard entry for ${email}`,
        )
      }),
    )

    const workouts = [
      {
        title: 'Steady-State Starter Run',
        description: 'A conversational-pace run to build aerobic endurance.',
        difficulty: 'beginner' as const,
        durationMinutes: 25,
      },
      {
        title: 'Tempo Run Builder',
        description: 'Alternate warm-up, sustained tempo effort, and a relaxed cool-down.',
        difficulty: 'intermediate' as const,
        durationMinutes: 40,
      },
      {
        title: 'Full-Body Strength Circuit',
        description: 'A balanced circuit of squats, presses, rows, and core work.',
        difficulty: 'intermediate' as const,
        durationMinutes: 35,
      },
    ]
    await Promise.all(
      workouts.map((workout) =>
        createOrUpdate(
          () => Workout.findOne({ title: workout.title }),
          () => Workout.create(workout),
          () => Workout.findOneAndUpdate(
            { title: workout.title },
            { $set: workout },
            { returnDocument: 'after' },
          ),
          `${workout.title} workout`,
        ),
      ),
    )

    console.log('Database seeding complete')
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding octofit_db:', error)
  process.exitCode = 1
})
