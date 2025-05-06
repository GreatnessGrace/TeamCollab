import 'dotenv/config';
import connectDB from '../config/db';
import { User } from '../models/user.model';

async function run() {
  try {
    await connectDB();
    console.log('Connected to DB');

    const email = 'admin@example.com';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists');
      return process.exit(0);
    }

    const admin = await User.create({
      name: 'Grace Admin',
      email,
      password: 'StrongPassword123',
      role: 'admin',
    });

    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

// To run the script ---> npx ts-node src/scripts/createAdmin.ts
