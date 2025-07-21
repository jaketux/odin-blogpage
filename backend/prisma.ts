const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");

async function main() {
  const delusers = await prisma.user.deleteMany();
  const hashedPassword = await bcrypt.hash("test", 10);
  const user = await prisma.user.create({
    data: {
      email: "author@test.com",
      username: "author",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      firstname: "author",
      lastname: "author",
      isAuthor: true,
      posts: {
        create: [
          {
            id: 1,
            title: "Test post",
            tagline: "A must see post for you!",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            published: true,
          },
          {
            id: 2,
            title: "Test post two",
            tagline: "This is one you must read.",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            published: false,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "reader@test.com",
      username: "reader",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      firstname: "reader",
      lastname: "reader",
      isAuthor: false,
    },
  });

  console.log(user2);
  console.log(user2.id);

  await prisma.comment.createMany({
    data: [
      {
        postId: 1,
        userId: user2.id,
        content: "A test comment.",
      },
      {
        postId: 1,
        userId: user.id,
        content: "A comment from the author.",
      },
      {
        userId: user2.id,
        content: "A comment from the reader.",
        postId: 1,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

module.exports = prisma;
