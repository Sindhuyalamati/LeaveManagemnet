const { Resend } = require('resend');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const { to, subject, html, text, attachments } = req.body || {};

    if (!to || !subject || (!html && !text)) {
        return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const cleanedAttachments = Array.isArray(attachments)
            ? attachments.map((a) => ({
                  filename: a.filename || a.name || 'attachment',
                  content: (a.contentBase64 || '').replace(/^data:.*;base64,/, ''),
                  contentType: a.contentType || a.type || undefined,
              }))
            : undefined;

        const data = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'no-reply@your-domain.com',
            to,
            subject,
            html,
            text,
            attachments: cleanedAttachments,
        });

        return res.status(200).json({ ok: true, id: data?.id });
    } catch (error) {
        console.error('Resend send error:', error);
        return res.status(500).json({ ok: false, error: error?.message || 'Unknown error' });
    }
};


