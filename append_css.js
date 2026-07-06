
const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

css += \
/* ======================================================
   GALLERY SCROLLYTELLING OVERLAY
   ====================================================== */
.gallery-section {
    position: relative;
}

.gallery-scrolly {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    z-index: 10;
    pointer-events: none; /* Let clicks pass through to gallery */
    background: transparent;
}

/* Subtle dark overlay to make text readable over photos */
.gallery-scrolly::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%);
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.gallery-scrolly .scrolly-text {
    text-shadow: 0 4px 30px rgba(0,0,0,1); /* Stronger shadow for photo background */
}
\;

fs.writeFileSync('style.css', css);

