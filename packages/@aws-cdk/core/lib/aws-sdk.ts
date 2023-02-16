/* eslint-disable import/no-extraneous-dependencies */
import * as SDK from 'aws-sdk';
import type { RetryDelayOptions as Options } from 'aws-sdk/lib/config-base';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

export type RetryDelayOptions = Options;
export { SDK };