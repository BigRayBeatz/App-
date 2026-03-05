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


