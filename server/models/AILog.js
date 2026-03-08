const mongoose = require('mongoose'); 
const aiLogSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', 
    required: true 
  },
  codeSnippet: { 
    type: String, 
    required: true 
  },
  feedback: {
    type: Object, 
    required: true 
  },
  timestamp: { 
    type: Date,
    default: Date.now 
  }
});

const AILog = mongoose.model('AILog', aiLogSchema); 
module.exports = AILog; 