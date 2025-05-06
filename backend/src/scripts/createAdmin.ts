import { connectDB } from '../config/db';
import { User } from '../models/user.model';

await connectDB();

const admin = await User.create({
    name: "Grace",
    email: "dhanjuankush0@gmail.com",
    password: 'SecureAdminPassword123',
    role: 'admin',
});


console.log('Admin Created', admin.email);
process.exit();

