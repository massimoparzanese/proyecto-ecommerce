import userRepository from '../repositories/user';

const seedUsersData = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'User One',
    email: 'user1@example.com',
    password: 'password123',
    role: 'user',
  },
];

export async function seedUsers() {
  for (const u of seedUsersData) {
    const existing = await userRepository.getUserByEmail(u.email);
    if (existing) {
      console.log('Skipping (exists):', u.email);
      continue;
    }
    const created = await userRepository.createUser(u);
    console.log('Created:', created.email);
  }
}
