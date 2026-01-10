import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(githubProfile) {
        return {
          id: githubProfile.id.toString(),
          name: githubProfile.name || githubProfile.login,
          email: githubProfile.email,
          image: githubProfile.avatar_url,
          provider: "github",
          providerId: githubProfile.id.toString(),
          creationDate: Date.now(),
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(googleProfile) {
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          provider: "google",
          providerId: googleProfile.sub,
          creationDate: Date.now(),
        };
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      // Check if this is a new user (not an existing one being updated)
      const isNewUser = !existingUserId;

      // Get the user data
      const user = await ctx.db.get(userId);

      if (user) {
        // Set the creation date if not already set
        if (!user.creationDate) {
          await ctx.db.patch(userId, {
            creationDate: Date.now(),
          });
        }

        // Send welcome email only for new users
        if (isNewUser && user.email) {
          // Schedule the welcome email to be sent asynchronously
          await ctx.scheduler.runAfter(0, internal.resend.sendWelcomeEmail, {
            to: user.email,
            userName: user.name || "there",
          });
          console.log(`Welcome email scheduled for new user: ${user.email}`);
        }
      }
    },
  },
});
