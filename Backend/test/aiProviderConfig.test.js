const test = require('node:test');
const assert = require('node:assert/strict');
const { getAiProviderMetadata, getEmbeddingIdentity } = require('../config/aiProvider');

test('provider metadata resolves Gemini configuration', () => {
  const environment = {
    AI_PROVIDER: 'GeMiNi',
    GEMINI_API_KEY: 'configured',
    GEMINI_CHAT_MODEL: 'custom-chat',
    GEMINI_EMBEDDING_MODEL: 'custom-embedding',
  };
  assert.deepEqual(getAiProviderMetadata(environment), {
    provider: 'gemini',
    configured: true,
    chatModel: 'custom-chat',
    embeddingModel: 'custom-embedding',
  });
  assert.deepEqual(getEmbeddingIdentity(environment), {
    embeddingProvider: 'gemini',
    embeddingModel: 'custom-embedding',
  });
});

test('provider metadata defaults to OpenAI and rejects unsupported providers', () => {
  const metadata = getAiProviderMetadata({});
  assert.equal(metadata.provider, 'openai');
  assert.equal(metadata.configured, false);
  assert.equal(metadata.embeddingModel, 'text-embedding-3-small');
  assert.throws(() => getAiProviderMetadata({ AI_PROVIDER: 'other' }), /Unsupported AI_PROVIDER/);
});
