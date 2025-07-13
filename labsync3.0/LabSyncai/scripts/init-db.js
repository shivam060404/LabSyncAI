/**
 * Database initialization script runner
 * 
 * This script compiles and runs the TypeScript database initialization script.
 */

const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Compiling and running database initialization script...');
  
  // Use ts-node to run the TypeScript file directly
  execSync('npx ts-node src/scripts/initDb.ts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('Database initialization completed.');
} catch (error) {
  console.error('Failed to run database initialization script:', error);
  process.exit(1);
}