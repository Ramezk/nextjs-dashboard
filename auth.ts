import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { prisma } from './app/lib/prisma';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
    try {
        console.log(email)
        const user = await prisma.user.findFirst({
            select: { id: true, name: true, email: true, password: true },
            where: {
                email: { equals: email }
            }
        });
        console.log(user)

        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                //console.log(credentials)
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    console.log(user.password)

                    const passwordsMatch = await bcrypt.compare(password, user.password) //|| password === user.password;
                    // bcrypt.genSalt(10, function (err, salt) {
                    //     bcrypt.hash(password, salt, function (err, hash) {
                    //         if (err) console.log(err);
                    //         console.log(hash);// Store hash in your password DB.
                    //     });
                    // });
                    // console.log(await bcrypt.hash(password, '123'))
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});