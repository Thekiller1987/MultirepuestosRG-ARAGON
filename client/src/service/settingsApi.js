
export const getSettings = async (token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            // If 404 or 500, don't try to parse html
            const text = await response.text();
            console.warn("Settings API Error:", response.status, text.substring(0, 100));
            return null;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            // Probably HTML (404 handled by React Router on server)
            console.warn("Settings API returned non-JSON:", contentType);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("getSettings error:", error);
        return null; // Return null instead of throwing to prevent app crash
    }
};

export const updateSettings = async (token, settings) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Error al actualizar configuración');
    return await response.json();
};

export const uploadLogo = async (token, file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/settings/logo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ logo: reader.result })
                });

                if (!response.ok) throw new Error('Error subiendo logo');
                const data = await response.json();
                resolve(data.logoUrl);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
    });
};
