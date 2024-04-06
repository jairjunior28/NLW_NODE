import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";

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
  const data = createEventSchema.parse(request.body);
  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: 5000,
      slug: "1321564f56sfdfdbn6df5",
    },
  });
  console.log(request.body);
  return reply.status(201).send({ eventId: event.id });
});
app.listen({ port: 3333 }).then(() => {
  console.log("Server On-Line PORTA 3333");
});
