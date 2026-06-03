/**
 * Nebaz AI Academy - Certificate Request Handler
 * Supports both server-backed and offline (file://) generation.
 * Certificates are stored in localStorage under "nebaz_certs".
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateLocalCertId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'NEBAZAI-';
    for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

function saveLocalCert(certData) {
    try {
        const store = JSON.parse(localStorage.getItem('nebaz_certs') || '{}');
        store[certData.cert_id] = certData;
        localStorage.setItem('nebaz_certs', JSON.stringify(store));
    } catch (e) { console.error('Failed to save cert:', e); }
}

function getLocalCert(certId) {
    try {
        const store = JSON.parse(localStorage.getItem('nebaz_certs') || '{}');
        return store[certId.toUpperCase()] || null;
    } catch (e) { return null; }
}

// ─── Form Handling ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.certificate-request-form').forEach(form => {
        form.addEventListener('submit', handleCertificateRequest);
    });
});

async function handleCertificateRequest(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('.submit-button');
    const successMessage = form.closest('.certificate-section').querySelector('.success-message');
    const errorMessage = form.closest('.certificate-section').querySelector('.error-message');

    const formData = {
        name: form.querySelector('input[name="name"]').value.trim(),
        email: form.querySelector('input[name="email"]').value.trim(),
        course: form.dataset.course || 'AI Course',
        timestamp: new Date().toISOString()
    };

    if (!validateCertificateForm(formData, errorMessage)) return;

    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.textContent = '';
    errorMessage.classList.remove('show');

    // ── Offline / file:// path ──────────────────────────────────────────────
    if (window.location.protocol === 'file:') {
        const cert_id = generateLocalCertId();
        const certData = { ...formData, cert_id, verified: true, date: new Date().toISOString() };
        saveLocalCert(certData);
        trackCertificateRequest(formData.course, formData.email);
        showSuccessMessage(successMessage, { cert_id, success: true }, formData, true);
        form.style.display = 'none';
        resetButton(submitButton);
        return;
    }

    // ── Online path ────────────────────────────────────────────────────────
    try {
        const response = await fetch(`${window.location.origin}/api/generate-certificate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (response.ok && result.success) {
            // Also store locally so verify.html works offline later
            saveLocalCert({ ...formData, cert_id: result.cert_id, verified: true, date: new Date().toISOString() });
            showSuccessMessage(successMessage, result, formData, false);
            form.style.display = 'none';
            trackCertificateRequest(formData.course, formData.email);
        } else {
            showError(errorMessage, result.message || 'Failed to generate certificate. Please try again.');
            resetButton(submitButton);
        }
    } catch (error) {
        console.warn('Server unavailable, generating certificate offline:', error);
        const cert_id = generateLocalCertId();
        const certData = { ...formData, cert_id, verified: true, date: new Date().toISOString() };
        saveLocalCert(certData);
        trackCertificateRequest(formData.course, formData.email);
        showSuccessMessage(successMessage, { cert_id, success: true }, formData, true);
        form.style.display = 'none';
        resetButton(submitButton);
    }
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateCertificateForm(data, errorElement) {
    if (!data.name || data.name.length < 2) {
        showError(errorElement, 'Please enter your full name (at least 2 characters).');
        return false;
    }
    if (data.name.length > 100) {
        showError(errorElement, 'Name is too long (maximum 100 characters).');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showError(errorElement, 'Please enter a valid email address.');
        return false;
    }
    if (data.email.length > 255) {
        showError(errorElement, 'Email is too long.');
        return false;
    }
    return true;
}

// ─── UI Helpers ──────────────────────────────────────────────────────────────

function showSuccessMessage(element, result, formData, isOffline) {
    const base = window.location.protocol === 'file:'
        ? window.location.href.split('/certificates/')[0] + '/certificates'
        : window.location.origin + '/certificates';
    const verificationUrl = `${base}/verify.html?id=${result.cert_id}`;
    const courseName = formData.course;
    const offlineBadge = isOffline
        ? `<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:0.6rem 1rem;margin:1rem 0;font-size:0.88rem;color:#92400e;">
               📴 Generated offline — certificate saved locally. It will be validated online once internet is available.
           </div>` : '';

    element.innerHTML = `
        <h3>✅ Certificate Generated!</h3>
        <p><strong>Congratulations, ${escapeHtml(formData.name)}!</strong></p>
        ${offlineBadge}
        <p style="font-size:0.9rem;margin-top:1rem;">
            <strong>Verification ID:</strong> ${result.cert_id}<br>
            <a href="${verificationUrl}" target="_blank" style="color:#047857;text-decoration:underline;">
                Verify &amp; Download your certificate →
            </a>
        </p>
        <div class="share-buttons" style="margin-top:1.25rem;">
            <a href="https://www.linkedin.com/feed/?shareActive=true&text=I%20just%20completed%20${encodeURIComponent(courseName)}%20on%20Nebaz AI%20Academy!%20%F0%9F%8E%93%20${encodeURIComponent(verificationUrl)}"
               target="_blank" class="share-button share-linkedin">Share on LinkedIn</a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('I just completed ' + courseName + ' on Nebaz AI Academy! 🎓')}&url=${encodeURIComponent(verificationUrl)}"
               target="_blank" class="share-button share-twitter">Share on Twitter</a>
        </div>
    `;
    element.classList.add('show');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(element, message) {
    element.textContent = '⚠️ ' + message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 5000);
}

function resetButton(button) {
    button.disabled = false;
    button.classList.remove('loading');
    button.textContent = '🎓 Generate My Certificate';
}

function trackCertificateRequest(course, email) {
    try {
        const certs = JSON.parse(localStorage.getItem('nebaz_cert_log') || '[]');
        certs.push({ course, email, timestamp: Date.now() });
        localStorage.setItem('nebaz_cert_log', JSON.stringify(certs));
    } catch (e) { /* silent */ }
    if (typeof gtag !== 'undefined') {
        gtag('event', 'certificate_request', { event_category: 'engagement', event_label: course, value: 1 });
    }
}

// ─── Verification (used by verify.html inline script via window.NebazCert) ─

window.NebazCert = {
    getLocalCert,
    generateLocalCertId,
    saveLocalCert,
    escapeHtml
};
