import userRepository from '../repositories/user';

const seedUsersData = [
  {
    name: 'Admin',
    email: 'admin@tienda.com',
    password: 'admin',
    role: 'admin',
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password',
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
