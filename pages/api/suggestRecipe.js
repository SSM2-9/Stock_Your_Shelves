import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { pantryItems } = req.body;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY, // Access environment variable here
    });
    const openai = new OpenAIApi(configuration);

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Suggest a recipe using the following ingredients: ${pantryItems}.`,
        max_tokens: 100,
      });

      const recipe = completion.data.choices[0].text.trim();
      res.status(200).json({ recipe });
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ error: 'Failed to fetch a recipe. Please try again later.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}