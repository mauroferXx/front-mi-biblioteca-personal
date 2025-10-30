#!/usr/bin/env node

// Script de inicio rápido para el frontend de trivia
const { spawn } = require('child_process');
const path = require('path');

console.log('⚛️ Iniciando Frontend de Trivia Game...\n');

// Verificar si node_modules existe
const fs = require('fs');
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Instalando dependencias...');
  
  const npm = spawn('npm', ['install'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  npm.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencias instaladas correctamente\n');
      startApp();
    } else {
      console.error('❌ Error instalando dependencias');
      process.exit(1);
    }
  });
} else {
  startApp();
}

function startApp() {
  console.log('🚀 Iniciando aplicación React...');
  console.log('🌐 Aplicación disponible en: http://localhost:3000');
  console.log('📡 Conectando con backend en: http://localhost:3001\n');
  
  const app = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  app.on('close', (code) => {
    console.log(`\n👋 Aplicación cerrada con código ${code}`);
  });

  // Manejar Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando aplicación...');
    app.kill('SIGINT');
    process.exit(0);
  });
}
