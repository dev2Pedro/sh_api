import Fastify from "fastify";
import cors from "@fastify/cors";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

await app.register(cors, { origin: "*" });

app.get("/", async () => {
  return { message: "Hello World" };
});

app.post("/contact", async (request: any) => {
  const body = request.body as {
    name: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
  };

  try {
    const phone = body.phone ?? null;

    await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phone,
        service: body.service,
        message: body.message,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Formulário de Contato" <pedro.servfaz@gmail.com>`,
      to: "pedro.servfaz@gmail.com",
      replyTo: body.email,
      subject: `Novo contato - ${body.service}`,
      text: `${body.message}\n\nTelefone: ${phone || "Não informado"}`,
    });

    return {
      success: true,
      message: "Contato salvo e email enviado com sucesso!",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao processar contato" };
  }
});

app.listen({ port: 3333 });
console.log("Server running at port: 3333");
