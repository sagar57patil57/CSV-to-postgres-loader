class UserBatchBuffer {
  constructor(batchSize = 1000) {
    this.batchSize = batchSize;
    this.bufferedRecords = [];
    this.userRepo = new (require('../repositories/userRepository'))();
  }

  async add(record) {
    this.bufferedRecords.push(record);
    if (this.bufferedRecords.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush() {
    if (this.bufferedRecords.length === 0) return;
    const batch = this.bufferedRecords;
    this.bufferedRecords = [];
    await this.userRepo.insertUsers(batch);
  }
}

module.exports = UserBatchBuffer;
