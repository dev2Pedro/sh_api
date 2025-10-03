// api/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = Fastify({ logger: true });

// CORS
app.register(cors, { origin: [FRONTEND_URL] });

// Rotas
app.get("/", async () => ({ message: "Hello World" }));

app.post("/contact", async (request: any, reply) => {
  const body = request.body as {
    name: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
  };

  try {
    const phone = body.phone ?? null;

    // Salva no banco
    await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phone,
        service: body.service,
        message: body.message,
      },
    });

    // Envia email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Formulário de Contato" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: body.email,
      subject: `Novo contato - ${body.service}`,
      text: `${body.message}\n\nTelefone: ${phone || "Não informado"}`,
    });

    return reply.send({
      success: true,
      message: "Contato salvo e email enviado com sucesso!",
    });
  } catch (error) {
    console.error(error);
    return reply
      .status(500)
      .send({ success: false, message: "Erro ao processar contato" });
  }
});

// Inicia servidor
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando em: ${address}`);
});
