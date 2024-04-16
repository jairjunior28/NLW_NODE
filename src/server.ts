import fastify from "fastify";
import z from "zod";
import { PrismaClient } from "@prisma/client";
import { getRandomValues, randomUUID, verify } from "crypto";
import { generateSlug } from "./utils/generator-slug.js";
import { hashPassword } from "./utils/hashPassword.js";
import { verifyPassword } from "./utils/verifyPassword.js";

const app = fastify();
const prisma = new PrismaClient({
  log: ["query"],
});
app.get("/", () => {
  return "hello user! Backend aplicação criada acompanhando evento NLW Unite!!!!";
});
app.post("/signup", async (request: Request, reply: Response) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().nullable(),
    password: z.string().nullable(),
  });
  const userData = createUserSchema.parse(request.body);
  const userExists = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (userExists) {
    return reply
      .status(401)
      .send({ message: "Erro este email já foi cadastrado." });
  } else {
    const userAdded = await prisma.user.create({
      data: {
        name: userData.name,
        password: await hashPassword(userData.password),
        email: userData.email,
        level: 1,
        status: false,
      },
    });
    // console.log(userAdded);
    return reply
      .status(201)
      .send({ message: "Usuário cadastrado. Id: " + userAdded.id });
  }
});
app.post("/signin", async (request: Request, reply: Response) => {
  const createSigninSchema = z.object({
    email: z.string().nullable(),
    password: z.string().nullable(),
  });
  const signinData = createSigninSchema.parse(request.body);
  const userExist = await prisma.user.findUnique({
    where: {
      email: signinData.email,
    },
  });
  if (userExist) {
    const verify = await verifyPassword(
      signinData.password,
      userExist.password
    );
    console.log(verify);
  }
});
app.post("/events", async (request: Request, reply: Response) => {
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
    // console.log(request.body);
    return reply.status(201).send({ eventId: event.id });
  } else
    return reply
      .status(401)
      .send({ message: "Erro este evento já foi cadastrado." });
});
app.listen({ port: 3333 }).then(() => {
  console.log("Server On-Line PORTA 3333");
});
