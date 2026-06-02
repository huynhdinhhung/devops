const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = async (to, subject, html) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email skip (No credentials):', subject, 'to', to);
            return;
        }

        const mailOptions = {
            from: `"GYM Manage System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Email Error:', error);
    }
};

exports.sendWelcomeEmail = async (user) => {
    const subject = 'Chào mừng bạn đến với GYM Manage System!';
    const html = `
        <h1>Chào mừng ${user.fullName}!</h1>
        <p>Cảm ơn bạn đã đăng ký tham gia hệ thống quản lý phòng tập của chúng tôi.</p>
        <p>Hãy khám phá các gói tập và bắt đầu hành trình sức khỏe của bạn ngay hôm nay!</p>
        <br>
        <p>Trân trọng,</p>
        <p>Đội ngũ GYM Manage System</p>
    `;
    return await this.sendEmail(user.email, subject, html);
};

exports.sendExpiryReminder = async (user, endDate) => {
    const subject = 'Nhắc nhở: Gói tập của bạn sắp hết hạn';
    const html = `
        <h1>Chào ${user.fullName},</h1>
        <p>Gói tập hiện tại của bạn sẽ hết hạn vào ngày <strong>${new Date(endDate).toLocaleDateString('vi-VN')}</strong>.</p>
        <p>Hãy gia hạn ngay để không bị gián đoạn quá trình tập luyện nhé!</p>
        <br>
        <p>Trân trọng,</p>
        <p>Đội ngũ GYM Manage System</p>
    `;
    return await this.sendEmail(user.email, subject, html);
};
