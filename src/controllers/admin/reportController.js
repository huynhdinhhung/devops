const PDFDocument = require('pdfkit');
const Payment = require('../../models/Payment');

exports.exportRevenueReport = async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'Success' })
            .populate({ path: 'member', populate: { path: 'user' } })
            .sort({ createdAt: -1 });

        const doc = new PDFDocument({ margin: 50 });
        let filename = `Revenue_Report_${Date.now()}.pdf`;
        
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Header
        doc.fillColor('#444444').fontSize(20).text('GYM MANAGE SYSTEM', { align: 'center' });
        doc.fontSize(15).text('BÁO CÁO DOANH THU', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Ngày xuất: ${new Date().toLocaleString('vi-VN')}`, { align: 'right' });
        doc.moveDown();

        // Table Header
        const tableTop = 150;
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text('Ngày', 50, tableTop);
        doc.text('Hội viên', 150, tableTop);
        doc.text('Mã giao dịch', 300, tableTop);
        doc.text('Số tiền', 450, tableTop, { align: 'right' });

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table Content
        let y = tableTop + 25;
        let totalRevenue = 0;
        doc.font('Helvetica');

        payments.forEach(p => {
            doc.fontSize(9).text(new Date(p.createdAt).toLocaleDateString('vi-VN'), 50, y);
            doc.text(p.member.user.fullName, 150, y);
            doc.text(p.transactionId, 300, y);
            doc.text(`${Number(p.amount).toLocaleString('vi-VN')} đ`, 450, y, { align: 'right' });
            
            totalRevenue += p.amount;
            y += 20;

            if (y > 700) { // Page break
                doc.addPage();
                y = 50;
            }
        });

        doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
        doc.fontSize(12).font('Helvetica-Bold').text(`TỔNG DOANH THU: ${Number(totalRevenue).toLocaleString('vi-VN')} đ`, 350, y + 20, { align: 'right' });

        doc.end();
        doc.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Generation Error');
    }
};
