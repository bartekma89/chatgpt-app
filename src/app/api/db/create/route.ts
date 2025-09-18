import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function createChatTable() {
  await sql`
        CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
}

async function createMessagesTable() {
  await sql`
        CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        chat_id INT NOT NULL,
        role VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        CONSTRAINT fk_chat FOREIGN KEY(chat_id) REFERENCES chats(id)
        )
    `;
}

export async function GET() {
  try {
    await sql.begin(() => [createChatTable(), createMessagesTable()]);

    return Response.json({ message: "Datebase created successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
