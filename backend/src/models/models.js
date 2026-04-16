import mongoose from 'mongoose';

const modelDefinitions = {
  employees: {
    modelName: 'Employee',
    collection: 'employees',
    schemaDefinition: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      position: { type: String, required: true },
      department: { type: String, required: true },
      salary: { type: Number, required: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      // Audit trail fields
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      updatedAt: { type: Date },
      // Soft delete field
      deleted: { type: Boolean, default: false },
      deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      deletedAt: { type: Date },
    },
    fields: [
      { name: 'firstName', label: 'First Name', inputType: 'text', required: true },
      { name: 'lastName', label: 'Last Name', inputType: 'text', required: true },
      { name: 'email', label: 'Email Address', inputType: 'email', required: true, gridClass: 'md:col-span-2' },
      { name: 'position', label: 'Position', inputType: 'text', required: true },
      { name: 'department', label: 'Department', inputType: 'text', required: true },
      { name: 'salary', label: 'Annual Salary (PHP)', inputType: 'number', required: true, gridClass: 'md:col-span-2' },
      { name: 'createdBy', label: 'Created By', hidden: true },
      { name: 'updatedBy', label: 'Updated By', hidden: true },
      { name: 'updatedAt', label: 'Updated At', hidden: true },
      { name: 'deleted', label: 'Deleted', hidden: true },
      { name: 'deletedBy', label: 'Deleted By', hidden: true },
      { name: 'deletedAt', label: 'Deleted At', hidden: true },
    ],
  },
};

const models = {};

for (const [, def] of Object.entries(modelDefinitions)) {
  const schema = new mongoose.Schema(def.schemaDefinition, { timestamps: true });
  models[def.modelName] = mongoose.models[def.modelName] || mongoose.model(def.modelName, schema);
}

export { models, modelDefinitions };
