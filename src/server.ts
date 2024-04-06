import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { getRandomValues, randomUUID } from "crypto";
import { generateSlug } from "./utils/generator-slug.js";

const app = fastify();
const prisma = new PrismaClient({
  log: ["query"],
});
app.get("/", () => {
  return "hello user! Backend aplicação criada acompanhando evento NLW Unite!!!!";
});

app.post("/events", async (request, reply) => {
  const createEventSchema = z.object({
    title: z.string(),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().nullable(),
  });
  const slug = generateSlug(request.body.title);

  const v = await prisma.event.findUnique({
    where: {
      slug: slug,
    },
  });
  if (v === null) {
    const data = createEventSchema.parse(request.body);
    const event = await prisma.event.create({
      data: {
        title: data.title,
        details: data.details,
        maximumAttendees: 5000,
        slug: data.title
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "")
          .replace(/\s+/g, "-"),
      },
    });
    console.log(request.body);
    return reply.status(201).send({ eventId: event.id });
  } else
    return reply
      .status(401)
      .send({ message: "Erro este evento já foi cadastrado." });
});
app.listen({ port: 3333 }).then(() => {
  console.log("Server On-Line PORTA 3333");
});
