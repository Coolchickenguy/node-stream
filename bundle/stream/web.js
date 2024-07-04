//Patch
//BOCK
var primordials = require("../internal/per_context/primordials.js");var process = require("../internal/process.js");'use strict';

const {
  TransformStream,
  TransformStreamDefaultController,
} = require('../internal/webstreams/transformstream');

const {
  WritableStream,
  WritableStreamDefaultController,
  WritableStreamDefaultWriter,
} = require('../internal/webstreams/writablestream');

const {
  ReadableStream,
  ReadableStreamDefaultReader,
  ReadableStreamBYOBReader,
  ReadableStreamBYOBRequest,
  ReadableByteStreamController,
  ReadableStreamDefaultController,
} = require('../internal/webstreams/readablestream');

const {
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
} = require('../internal/webstreams/queuingstrategies');

const {
  TextEncoderStream,
  TextDecoderStream,
} = require('../internal/webstreams/encoding');

const {
  CompressionStream,
  DecompressionStream,
} = require('../internal/webstreams/compression');

module.exports = {
  ReadableStream,
  ReadableStreamDefaultReader,
  ReadableStreamBYOBReader,
  ReadableStreamBYOBRequest,
  ReadableByteStreamController,
  ReadableStreamDefaultController,
  TransformStream,
  TransformStreamDefaultController,
  WritableStream,
  WritableStreamDefaultWriter,
  WritableStreamDefaultController,
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
  TextEncoderStream,
  TextDecoderStream,
  CompressionStream,
  DecompressionStream,
};
