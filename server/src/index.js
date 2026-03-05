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
});const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const upload = multer({ dest: 'temp/' }); // Temporary local storage

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Bulk Upload + AI Auto-Description
app.post('/api/beats/bulk', upload.array('files', 50), async (req, res) => {
    const results = [];

    for (const file of req.files) {
        // 1. Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('beats')
            .upload(`raw/${Date.now()}-${file.originalname}`, file);

        if (data) {
            // 2. Trigger AI for this specific beat
            const aiDescription = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: `Write a 1-sentence hype description for a beat named ${file.originalname}` }]
            });

            // 3. Save to Database
            const dbEntry = await pool.query(
                'INSERT INTO beats (title, audio_url, description) VALUES ($1, $2, $3) RETURNING *',
                [file.originalname, data.path, aiDescription.choices[0].message.content]
            );
            results.push(dbEntry.rows[0]);
        }
    }
    res.json({ message: "Bulk Node Synced", uploaded: results.length });
});


