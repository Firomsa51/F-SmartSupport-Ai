const API_BASE = 'https://smart-support-ai-firo.vercel.app/api';

async function getClerkToken() {
  return new Promise((resolve) => {
    const tryGet = async () => {
      try {
        const token = await window.Clerk?.session?.getToken();
        resolve(token || null);
      } catch {
        resolve(null);
      }
    };

    if (window.Clerk?.session) {
      tryGet();
    } else {
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        if (window.Clerk?.session) {
          clearInterval(interval);
          tryGet();
        } else if (attempts > 20) {
          clearInterval(interval);
          resolve(null);
        }
      }, 100);
    }
  });
}

async function request(method, path, body) {
  const token = await getClerkToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`API error ${res.status}:`, text);
    throw new Error(`API error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const base44 = {
  entities: {
    Chatbot: {
      list: () => request('GET', '/chatbots'),
      filter: ({ id } = {}) => id
        ? request('GET', `/chatbots/${id}`).then(r => [r])
        : request('GET', '/chatbots'),
      get: (id) => request('GET', `/chatbots/${id}`),
      create: (data) => request('POST', '/chatbots', {
        name: data.name,
        description: data.description,
        systemPrompt: data.system_prompt,
        primaryColor: data.primary_color,
        welcomeMessage: data.welcome_message,
      }),
      update: (id, data) => request('PATCH', `/chatbots/${id}`, {
        name: data.name,
        description: data.description,
        systemPrompt: data.system_prompt || data.systemPrompt,
        primaryColor: data.primary_color || data.primaryColor,
        welcomeMessage: data.welcome_message || data.welcomeMessage,
        status: data.status,
      }),
      delete: (id) => request('DELETE', `/chatbots/${id}`),
    },

    Document: {
      filter: ({ chatbot_id }) => request('GET', `/chatbots/${chatbot_id}/documents`),
      create: (data) => request('POST', `/chatbots/${data.chatbot_id}/documents`, {
        title: data.title,
        sourceType: data.source_type || data.sourceType,
        content: data.content || '',
        sourceUrl: data.source_url || data.sourceUrl,
      }),
      delete: (id, chatbotId) => request('DELETE', `/chatbots/${chatbotId}/documents/${id}`),
    },

    Conversation: {
      filter: ({ chatbot_id }) => request('GET', `/chatbots/${chatbot_id}/conversations`),
    },

    Message: {
      filter: ({ conversation_id, chatbot_id }) =>
        request('GET', `/chatbots/${chatbot_id}/conversations/${conversation_id}/messages`),
    },
  },

  auth: {
    logout: () => window.Clerk?.signOut(),
  },
};
