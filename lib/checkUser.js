import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return null;
    }

    const userByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (userByEmail) {
      const updatedUser = await db.user.update({
        where: { id: userByEmail.id },
        data: {
          clerkUserId: user.id,
          imageUrl: user.imageUrl,
        },
      });
      return updatedUser;
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: name || null,
        imageUrl: user.imageUrl,
        email,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
