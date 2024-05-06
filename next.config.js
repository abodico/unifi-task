/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                // "https://files.bikeindex.org/uploads/Pu/799683/large_kalkhoff_image_5.b_excite_tiefeinstieg_5.jpg"
                protocol: "https",
                hostname: "files.bikeindex.org",
            },
        ],
    },
}
// module.exports = nextConfig;
