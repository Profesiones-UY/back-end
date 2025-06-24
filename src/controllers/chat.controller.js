const OpenAI = require('openai');
const ChatHistory = require('../models/chatHistory.model');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chat = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user ? req.user._id : null; // O lo que uses para identificar al usuario
    if (!message) return res.status(400).json({ error: 'Mensaje requerido' });

    const systemMessage = {
      role: "system",
      content: `
Eres un asistente virtual para la app Profesiones UY. Ayudas a usuarios a consultar sobre servicios profesionales, agendar citas y resolver dudas sobre el funcionamiento de la plataforma. Responde siempre en español.

Funciones principales de la aplicación:
- Registro y login de usuarios (clientes y profesionales)
- Búsqueda de profesionales por especialidad
- Solicitud y gestión de citas entre clientes y profesionales
- Calificación de profesionales por parte de los clientes
- Consulta de disponibilidad de profesionales
- Recuperación de contraseña por email

Ejemplos de preguntas que puedes responder:
- ¿Cómo agendo una cita con un profesional?
- ¿Cómo puedo calificar a un profesional?
- ¿Qué hago si olvidé mi contraseña?
- ¿Cómo veo mi perfil o actualizo mis datos?

No des información médica ni legal. Limítate a explicar el funcionamiento de la plataforma.`
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        systemMessage,
        { role: 'user', content: message }
      ],
      max_tokens: 500,
    });

    const aiReply = response.choices[0].message.content;

    // --- GUARDAR HISTORIAL ---
    let chatHistory;
    if (chatId) {
      chatHistory = await ChatHistory.findById(chatId);
      if (!chatHistory) {
        // Si el chatId no existe, crea uno nuevo
        chatHistory = await ChatHistory.create({
          user: userId,
          messages: []
        });
      }
    } else {
      chatHistory = await ChatHistory.create({
        user: userId,
        messages: []
      });
    }

    chatHistory.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiReply }
    );
    await chatHistory.save();

    // Devuelves la respuesta y el chatId para que el frontend lo use en la próxima consulta
    res.json({ reply: aiReply, chatId: chatHistory._id });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Error al consultar la IA' });
  }
};

module.exports = { chat }; 