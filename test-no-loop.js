const { io } = require('socket.io-client');

console.log('🔌 Probando conexión Socket.IO sin bucle infinito...');

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
  timeout: 10000,
  forceNew: false,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000
});

let connected = false;
let joinResultCount = 0;

socket.on('connect', () => {
  console.log('✅ Conectado al servidor Socket.IO');
  console.log('🆔 ID del socket:', socket.id);
  connected = true;
  
  // Probar unirse a una sala
  socket.emit('join_room', {
    roomId: 'TEST123',
    userName: 'UsuarioPrueba'
  });
});

socket.on('join_result', (data) => {
  joinResultCount++;
  console.log(`📝 Resultado de unirse #${joinResultCount}:`, data);
  
  if (joinResultCount > 3) {
    console.log('❌ BUCLE INFINITO DETECTADO - Más de 3 resultados de unirse');
    socket.disconnect();
    process.exit(1);
  }
  
  if (data.success) {
    console.log('✅ Unión exitosa a la sala');
    console.log('🎮 Estado del juego:', data.gameState);
    
    // Desconectar después de la prueba exitosa
    setTimeout(() => {
      console.log('🔌 Desconectando...');
      socket.disconnect();
      process.exit(0);
    }, 2000);
  } else {
    console.log('❌ Error al unirse:', data.message);
    // Esperar un poco antes de desconectar
    setTimeout(() => {
      console.log('🔌 Desconectando...');
      socket.disconnect();
      process.exit(0);
    }, 1000);
  }
});

socket.on('connect_error', (error) => {
  console.error('❌ Error de conexión:', error.message);
  process.exit(1);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Desconectado:', reason);
  if (connected) {
    console.log('✅ Desconexión exitosa');
  }
});

// Timeout de seguridad
setTimeout(() => {
  if (!connected) {
    console.log('⏰ Timeout - cerrando conexión');
    socket.disconnect();
    process.exit(1);
  }
}, 15000);
