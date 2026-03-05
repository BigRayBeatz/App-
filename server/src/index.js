const fs = require('fs');
const path = require('path');

// Inside your Stripe Webhook logic:
if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { beatTitle, downloadUrl, userId } = session.metadata;

    // Load the HTML template
    let emailHtml = fs.readFileSync(path.join(__dirname, '../templates/download-email.html'), 'utf8');

    // Replace placeholders with real data
    emailHtml = emailHtml.replace('{{beatTitle}}', beatTitle)
                         .replace('{{downloadUrl}}', downloadUrl);

    const msg = {
        to: session.customer_details.email,
        from: 'deliveries@yourdomain.com', // Verified SendGrid sender
        subject: `Download: ${beatTitle} (SMGPUB)`,
        html: emailHtml,
    };

    await sgMail.send(msg);
    console.log(`📧 Beat Node: Delivery sent for ${beatTitle}`);
};
const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: 'price_123...', quantity: 1 }],
    mode: 'payment',
    // CRITICAL: This allows the webhook to know WHO and WHAT
    metadata: {
        userId: 'user_98765', 
        beatTitle: 'Midnight Logic',
        downloadUrl: 'https://storage.supabase.co/beats/midnight.wav'
    },
    success_url: 'https://smgpub.com/dashboard?success=true',
    cancel_url: 'https://smgpub.com/beats',
});

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/ai/generate-marketing', async (req, res) => {
    const { title, mood, bpm } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // 2026 industry standard
            messages: [{
                role: "system",
                content: "You are a top-tier music marketing agent. Create a viral 280-character post to sell a beat."
            }, {
                role: "user",
                content: `Beat Title: ${title}, Mood: ${mood}, BPM: ${bpm}. Include a call to action to buy at SMGPUB.`
            }],
        });

        res.json({ copy: completion.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: "AI Node Timeout" });
    }
});

