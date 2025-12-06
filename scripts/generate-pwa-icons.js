const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
// Use logo-text.png as source
const inputFile = path.join(__dirname, "../public/assets/logo/logo-text.png");
const outputDir = path.join(__dirname, "../public/assets/icons");

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
    try {
        // Check if input file exists
        if (!fs.existsSync(inputFile)) {
            console.error(`Error: ${inputFile} not found`);
            console.error("Please ensure logo-text.png exists in public/assets/logo/");
            process.exit(1);
        }

        console.log("Generating PWA icons from logo...");

        // Generate icons for each size in webp format
        for (const size of sizes) {
            const outputFile = path.join(outputDir, `icon-${size}x${size}.webp`);
            
            try {
                await sharp(inputFile)
                    .resize(size, size, {
                        fit: "contain",
                        background: { r: 255, g: 255, b: 255, alpha: 1 }
                    })
                    .webp({ quality: 90 })
                    .toFile(outputFile);
                
                console.log(`✓ Created ${outputFile}`);
            } catch (error) {
                console.error(`✗ Failed to create ${outputFile}:`, error.message);
            }
        }

        console.log("\n✅ All PWA icons generated successfully!");
        console.log("Icons are saved in: public/assets/icons/");
    } catch (error) {
        console.error("Error generating icons:", error);
        process.exit(1);
    }
}

generateIcons();

