const fs = require('fs');
const csv = require('csv-parser');
const config = require('../config/config');
const { transformToNestedObject, parseHeaderPaths, AgeDistributionTracker } = require('../utils/commonUtils');
const UserRecordMapper = require('../strategies/userMappingStrategy');
const UserBatchBuffer = require('../processors/batchProcessor');


class DataIngestionPipeline {
  constructor(options = {}) {
    this.userRecordMapper = new UserRecordMapper();
    this.userBatchBuffer = new UserBatchBuffer(options.batchSize || 1000);
    this.demographicStats = new AgeDistributionTracker();
    this.processedCount = 0;
    this.invalidRowCount = 0;
    this.headerPaths = {};
  }

  logSkippedRecord(record, reason) {
    console.warn('[DataIngestionPipeline] Skipping record:', record, '| Reason:', reason);
  }

  /**
   * Run the CSV ingestion pipeline and return a summary.
   * @param {string} filePath - Path to the CSV file.
   * @returns {Promise<Object>} Summary of the ingestion process.
   */
  async executePipeline(filePath = config.csvFilePath) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let headersReady = false;
      let streamError = null;
      const readStream = fs.createReadStream(filePath);
      const parser = csv();

      readStream.on('error', err => {
        streamError = err;
        parser.destroy(err);
      });

      parser
        .on('headers', headers => {
          Object.assign(this.headerPaths, parseHeaderPaths(headers));
          headersReady = true;
        })
        .on('data', row => {
          if (!headersReady) return;
          readStream.pause();
          Promise.resolve()
            .then(() => {
              const nested = transformToNestedObject(row);
              const firstName = nested?.name?.firstName;
              const lastName = nested?.name?.lastName;
              const age = nested?.age;
              if (!firstName || !lastName || !age) {
                this.invalidRowCount++;
                this.logSkippedRecord(row, 'Missing required fields: name.firstName, name.lastName, or age');
                return;
              }
              const mapped = this.userRecordMapper.mapToDatabaseUser(nested);
              this.demographicStats.update(mapped.age);
              this.processedCount++;
              return this.userBatchBuffer.add(mapped);
            })
            .then(() => readStream.resume())
            .catch(err => {
              streamError = err;
              this.logSkippedRecord(row, err.message || err);
              readStream.destroy(err);
            });
        })
        .on('end', async () => {
          try {
            await this.userBatchBuffer.flush();
            if (streamError) return reject(streamError);
            const endTime = Date.now();
            const durationMs = endTime - startTime;
            console.log(`[DataIngestionPipeline] Completed in ${durationMs} ms`);
            resolve({
              totalRecords: this.processedCount,
              invalidRows: this.invalidRowCount,
              ageDistribution: this.demographicStats.getDistribution(this.processedCount),
              executionTimeMs: durationMs
            });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', err => {
          streamError = err;
          reject(err);
        });

      readStream.pipe(parser);
    });
  }
}

module.exports = DataIngestionPipeline;
