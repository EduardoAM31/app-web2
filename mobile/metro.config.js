// Configuração padrão do Metro para projetos Expo.
// Estende a config do Expo (necessária para expo-router e resolução de assets).
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
