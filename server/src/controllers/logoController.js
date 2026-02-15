const fs = require('fs');
const path = require('path');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/logo');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadLogo = async (req, res) => {
    try {
        const { logo } = req.body; // Base64 encoded image
        if (!logo) {
            return res.status(400).json({ msg: 'No se recibió ninguna imagen.' });
        }

        // Remove header if present (e.g., data:image/png;base64,)
        const base64Data = logo.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Always save as business_logo.png to overwrite previous
        const filename = 'business_logo.png';
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, buffer);

        res.json({
            msg: 'Logo actualizado correctamente',
            logoUrl: `/uploads/logo/${filename}?t=${Date.now()}`
        });

    } catch (err) {
        console.error('Error in uploadLogo:', err);
        res.status(500).json({ msg: 'Error al procesar el logo.' });
    }
};

exports.getLogo = (req, res) => {
    const filename = 'business_logo.png';
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Return a default or empty if not found
        res.status(404).json({ msg: 'Logo no configurado' });
    }
};
