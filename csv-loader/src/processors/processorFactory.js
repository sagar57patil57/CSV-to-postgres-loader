const DataIngestionPipeline = require('../services/csvProcessingService');

class ProcessorFactory {
  static createCSVProcessor(options) {
    return new DataIngestionPipeline(options);
  }
}

module.exports = ProcessorFactory;
