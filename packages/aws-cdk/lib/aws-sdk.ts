/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-extraneous-dependencies */
import * as SDK from 'aws-sdk';
import { CloudFormation, ConfigurationOptions } from 'aws-sdk';

// Clients for tests
import * as codebuild from 'aws-sdk/clients/codebuild';
import * as lambda from 'aws-sdk/clients/lambda';
import * as stepfunctions from 'aws-sdk/clients/stepfunctions';

import type { PromiseResult } from 'aws-sdk/lib/request';
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

export const regionUtil = require('aws-sdk/lib/region_config');
export { ConfigurationOptions };
export type { PromiseResult };
export type CreateChangeSetInput = CloudFormation.CreateChangeSetInput;

export { codebuild };
export { lambda };
export { stepfunctions };
export default SDK;