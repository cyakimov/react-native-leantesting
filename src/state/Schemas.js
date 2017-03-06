import {normalize, Schema, arrayOf, valuesOf} from 'normalizr';

const projectSchema = new Schema('projects');
const versionSchema = new Schema('versions');
const bugSchema = new Schema('bugs');
const componentSchema = new Schema('components');
const typeSchema = new Schema('bugTypeScheme');
const statusSchema = new Schema('bugStatusScheme');
const userSchema = new Schema('users');
const organizationSchema = new Schema('organizations');

projectSchema.define({
  bugTypeScheme: arrayOf(typeSchema),
  bugStatusScheme: arrayOf(statusSchema),
  components: arrayOf(statusSchema),
  version: arrayOf(versionSchema)
});

bugSchema.define({
  version: versionSchema,
  assignedUser: userSchema,
  reporter: userSchema,
  component: componentSchema,
  status: statusSchema,
  type: typeSchema,
});

// Schemas for LT API responses.
export const Schemas = {
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  PROJECT: projectSchema,
  PROJECT_ARRAY: arrayOf(projectSchema),
  VERSION: versionSchema,
  VERSION_ARRAY: arrayOf(versionSchema),
  BUG: bugSchema,
  BUG_ARRAY: arrayOf(bugSchema),
  ORGANIZATION: organizationSchema,
  ORGANIZATION_ARRAY: arrayOf(organizationSchema),
  COMPONENT: componentSchema,
  COMPONENT_ARRAY: arrayOf(componentSchema),
};
