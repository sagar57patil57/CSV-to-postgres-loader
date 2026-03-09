
const ProcessorFactory = require('../processors/processorFactory');

async function processCsv(req, res) {
  try {
    const pipeline = ProcessorFactory.createCSVProcessor();
    const summary = await pipeline.executePipeline();
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: 'failed', details: error.message });
  }
}

module.exports = {
  processCsv,
};
