#!/usr/bin/env node

/**
 * Script to remove white background from GIF files and make them transparent
 * Uses ImageMagick to process GIF files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const GIF_DIR = path.join(__dirname, '../public/assets/giff');
const BACKUP_DIR = path.join(__dirname, '../public/assets/giff/backup');

// GIF files to process
const gifFiles = [
    'market-research.gif',
    'green-screen.gif',
    'monitor.gif',
    'printer.gif',
    'social-media.gif',
    'trending.gif',
    'vector.gif',
    'web-developer.gif'
];

function createBackup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log('📁 Created backup directory');
    }

    console.log('💾 Creating backups...');
    gifFiles.forEach(file => {
        const sourcePath = path.join(GIF_DIR, file);
        const backupPath = path.join(BACKUP_DIR, file);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, backupPath);
            console.log(`  ✓ Backed up ${file}`);
        }
    });
}

function processGif(inputPath, outputPath) {
    try {
        // ImageMagick command to remove white background more carefully
        // Using a more conservative approach:
        // 1. First convert to a format that supports better transparency
        // 2. Use fuzz to catch near-white colors (anti-aliased edges)
        // 3. Make white and near-white transparent
        // 4. Optimize layers
        
        // More conservative approach - only remove pure white and very close colors
        // Using -fuzz 5% to catch anti-aliased edges without affecting main colors
        // -channel alpha: work on alpha channel
        // -threshold: make pixels above threshold transparent
        const command = `convert "${inputPath}" -fuzz 5% -transparent white -layers optimize "${outputPath}"`;
        
        execSync(command, { stdio: 'pipe' });
        return true;
    } catch (error) {
        console.error(`❌ Error processing ${path.basename(inputPath)}:`, error.message);
        return false;
    }
}

function main() {
    console.log('🎨 Starting GIF white background removal...\n');

    // Check if ImageMagick is available
    try {
        execSync('which convert', { stdio: 'ignore' });
    } catch (error) {
        console.error('❌ ImageMagick (convert) is not installed or not in PATH');
        console.log('Please install ImageMagick: sudo apt-get install imagemagick');
        process.exit(1);
    }

    // Create backups first
    createBackup();
    console.log('');

    // Process each GIF
    let successCount = 0;
    let failCount = 0;

    gifFiles.forEach(file => {
        const inputPath = path.join(GIF_DIR, file);
        const outputPath = path.join(GIF_DIR, file);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  File not found: ${file}`);
            failCount++;
            return;
        }

        console.log(`🔄 Processing ${file}...`);
        if (processGif(inputPath, outputPath)) {
            console.log(`  ✓ Successfully processed ${file}\n`);
            successCount++;
        } else {
            failCount++;
        }
    });

    console.log('\n📊 Summary:');
    console.log(`  ✓ Successfully processed: ${successCount}`);
    console.log(`  ✗ Failed: ${failCount}`);
    console.log(`\n💾 Backups saved in: ${BACKUP_DIR}`);
    console.log('\n✨ Done!');
}

if (require.main === module) {
    main();
}

module.exports = { processGif, createBackup };

