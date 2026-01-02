const twilio = require('twilio');

class NotificationService {
    constructor() {
        const sid = process.env.TWILIO_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const phone = process.env.TWILIO_PHONE_NUMBER;

        // Check if keys are present and NOT the default placeholders
        this.enabled = sid && token && phone &&
            !sid.includes('your_twilio_sid') &&
            !token.includes('your_token');

        if (this.enabled) {
            try {
                this.client = twilio(sid, token);
                this.fromPhone = phone;
                this.whatsAppFrom = 'whatsapp:' + (process.env.TWILIO_WHATSAPP_NUMBER || '14155238886');
            } catch (err) {
                console.error('Twilio Init Error:', err.message);
                this.enabled = false;
            }
        } else {
            console.log('ℹ️ Twilio SMS/WhatsApp disabled (missing or placeholder credentials). Using console simulation.');
        }
    }

    /**
     * Send a notification to a property owner about a new broadcast request.
     * @param {Object} owner - The owner user object (must have phone property).
     * @param {Object} requestDetails - Details of the broadcast request.
     */
    async sendBroadcastNotification(owner, requestDetails) {
        if (!owner || !owner.phone) {
            console.error(`❌ Cannot send notification: Owner ${owner.username || 'Unknown'} has no phone number.`);
            return;
        }

        const messageBody = `
🔥 * New ZenithStays Application! *
📍 Location: ${requestDetails.location}
📅 Dates: ${requestDetails.checkInDate} - ${requestDetails.checkOutDate}
👥 Guests: ${requestDetails.guests}
💰 Potential Value: HIGH

Login to your dashboard to accept sending an offer!
        `.trim();

        try {
            if (this.enabled) {
                // 1. Send SMS
                await this.client.messages.create({
                    body: messageBody.replace('*', '').replace('*', ''), // Strip markdown for SMS
                    from: this.fromPhone,
                    to: owner.phone
                });

                // 2. Send WhatsApp (if configured)
                // Note: Twilio Sandbox requires users to join first. 
                // In production, you'd use a verified Business Profile.
                if (process.env.TWILIO_WHATSAPP_NUMBER) {
                    await this.client.messages.create({
                        body: messageBody,
                        from: this.whatsAppFrom,
                        to: 'whatsapp:' + owner.phone
                    });
                }

                console.log(`✅ SMS / WhatsApp sent to ${owner.phone} `);
            } else {
                // Simulation Mode
                console.log('--- [SIMULATED SMS/WHATSAPP] ---');
                console.log(`To: ${owner.phone} `);
                console.log(`Message: \n${messageBody} `);
                console.log('--------------------------------');
            }
        } catch (error) {
            console.error('❌ Failed to send Twilio notification:', error.message);
        }
    }
}

module.exports = new NotificationService();
