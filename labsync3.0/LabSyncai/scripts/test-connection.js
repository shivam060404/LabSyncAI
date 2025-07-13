/**
 * MongoDB connection test script runner
 * 
 * This script compiles and runs the TypeScript connection test script.
 */

const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Compiling and running MongoDB connection test script...');
  
  // Use ts-node to run the TypeScript file directly
  execSync('npx ts-node src/scripts/testConnection.ts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('Connection test completed.');
} catch (error) {
  console.error('Failed to run connection test script:', error);
  process.exit(1);
}