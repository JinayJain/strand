import { PrismaClient } from "@prisma/client";
import { randMovie, randQuote, randUser } from "@ngneat/falso";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const NUM_USERS = 20;
const NUM_STORIES = 20;
const NUM_STRAND_PER_STORY = 20;

async function main() {
  // const users = await prisma.user.createMany({
  //   data: randUser({ length: NUM_USERS }).map((user) => ({
  //     email: user.email,
  //     name: user.username,
  //   })),
  // });

  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const newUser = randUser();
    const user = await prisma.user.create({
      data: {
        email: newUser.email,
        name: newUser.firstName,
        username: newUser.username,
        image: newUser.img,
      },
    });

    users.push(user);
  }

  const stories = [];
  for (let i = 0; i < NUM_STORIES; i++) {
    const storyId = uuidv4();

    const strandStory = await prisma.strandStory.create({
      data: {
        id: storyId,
        title: randMovie(),
        active_date: dayjs()
          .add(i - NUM_STORIES / 2, "day")
          .toDate(),
        root: {
          create: {
            story_id: storyId,
            content: randQuote(),
            author_id: users[i % NUM_USERS]?.id || "",
          },
        },
      },
      include: {
        root: true,
      },
    });

    const strands = [strandStory.root];
    for (let j = 0; j < NUM_STRAND_PER_STORY; j++) {
      const strand = await prisma.strand.create({
        data: {
          story_id: storyId,
          parent_id: strands[(Math.random() * strands.length) | 0]?.id || "",
          author_id: users[j % NUM_USERS]?.id || "",
          content: randQuote(),
        },
      });

      strands.push(strand);
    }

    stories.push(strandStory);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
