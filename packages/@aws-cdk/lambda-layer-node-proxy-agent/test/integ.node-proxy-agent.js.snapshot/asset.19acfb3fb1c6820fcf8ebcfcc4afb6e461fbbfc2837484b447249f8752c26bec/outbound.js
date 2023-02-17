"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = exports.invokeFunction = exports.startExecution = void 0;
/* eslint-disable import/no-extraneous-dependencies */
/* istanbul ignore file */
const https = require("https");
const AWS = require("aws-sdk");
const FRAMEWORK_HANDLER_TIMEOUT = 900000; // 15 minutes
// In order to honor the overall maximum timeout set for the target process,
// the default 2 minutes from AWS SDK has to be overriden:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#httpOptions-property
const awsSdkConfig = {
    httpOptions: { timeout: FRAMEWORK_HANDLER_TIMEOUT },
};
async function defaultHttpRequest(options, responseBody) {
    return new Promise((resolve, reject) => {
        try {
            const request = https.request(options, resolve);
            request.on('error', reject);
            request.write(responseBody);
            request.end();
        }
        catch (e) {
            reject(e);
        }
    });
}
let sfn;
let lambda;
async function defaultStartExecution(req) {
    if (!sfn) {
        sfn = new AWS.StepFunctions(awsSdkConfig);
    }
    return sfn.startExecution(req).promise();
}
async function defaultInvokeFunction(req) {
    if (!lambda) {
        lambda = new AWS.Lambda(awsSdkConfig);
    }
    try {
        /**
         * Try an initial invoke.
         *
         * When you try to invoke a function that is inactive, the invocation fails and Lambda sets
         * the function to pending state until the function resources are recreated.
         * If Lambda fails to recreate the resources, the function is set to the inactive state.
         *
         * We're using invoke first because `waitFor` doesn't trigger an inactive function to do anything,
         * it just runs `getFunction` and checks the state.
         */
        return await lambda.invoke(req).promise();
    }
    catch (error) {
        /**
         * The status of the Lambda function is checked every second for up to 300 seconds.
         * Exits the loop on 'Active' state and throws an error on 'Inactive' or 'Failed'.
         *
         * And now we wait.
         */
        await lambda.waitFor('functionActiveV2', {
            FunctionName: req.FunctionName,
        }).promise();
        return await lambda.invoke(req).promise();
    }
}
exports.startExecution = defaultStartExecution;
exports.invokeFunction = defaultInvokeFunction;
exports.httpRequest = defaultHttpRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdXRib3VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBc0Q7QUFDdEQsMEJBQTBCO0FBQzFCLCtCQUErQjtBQUMvQiwrQkFBK0I7QUFHL0IsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxhQUFhO0FBRXZELDRFQUE0RTtBQUM1RSwwREFBMEQ7QUFDMUQsMkZBQTJGO0FBQzNGLE1BQU0sWUFBWSxHQUE2QjtJQUM3QyxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUU7Q0FDcEQsQ0FBQztBQUVGLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxPQUE2QixFQUFFLFlBQW9CO0lBQ25GLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNYO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsSUFBSSxHQUFzQixDQUFDO0FBQzNCLElBQUksTUFBa0IsQ0FBQztBQUV2QixLQUFLLFVBQVUscUJBQXFCLENBQUMsR0FBMEM7SUFDN0UsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDM0M7SUFFRCxPQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDM0MsQ0FBQztBQUVELEtBQUssVUFBVSxxQkFBcUIsQ0FBQyxHQUFpQztJQUNwRSxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN2QztJQUVELElBQUk7UUFDRjs7Ozs7Ozs7O1dBU0c7UUFDSCxPQUFPLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUMzQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBRWQ7Ozs7O1dBS0c7UUFDSCxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7WUFDdkMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZO1NBQy9CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzNDO0FBQ0gsQ0FBQztBQUVVLFFBQUEsY0FBYyxHQUFHLHFCQUFxQixDQUFDO0FBQ3ZDLFFBQUEsY0FBYyxHQUFHLHFCQUFxQixDQUFDO0FBQ3ZDLFFBQUEsV0FBVyxHQUFHLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG4vKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0ICogYXMgQVdTIGZyb20gJ2F3cy1zZGsnO1xuXG5cbmNvbnN0IEZSQU1FV09SS19IQU5ETEVSX1RJTUVPVVQgPSA5MDAwMDA7IC8vIDE1IG1pbnV0ZXNcblxuLy8gSW4gb3JkZXIgdG8gaG9ub3IgdGhlIG92ZXJhbGwgbWF4aW11bSB0aW1lb3V0IHNldCBmb3IgdGhlIHRhcmdldCBwcm9jZXNzLFxuLy8gdGhlIGRlZmF1bHQgMiBtaW51dGVzIGZyb20gQVdTIFNESyBoYXMgdG8gYmUgb3ZlcnJpZGVuOlxuLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L0FXUy9Db25maWcuaHRtbCNodHRwT3B0aW9ucy1wcm9wZXJ0eVxuY29uc3QgYXdzU2RrQ29uZmlnOiBBV1MuQ29uZmlndXJhdGlvbk9wdGlvbnMgPSB7XG4gIGh0dHBPcHRpb25zOiB7IHRpbWVvdXQ6IEZSQU1FV09SS19IQU5ETEVSX1RJTUVPVVQgfSxcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRIdHRwUmVxdWVzdChvcHRpb25zOiBodHRwcy5SZXF1ZXN0T3B0aW9ucywgcmVzcG9uc2VCb2R5OiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICByZXF1ZXN0Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICByZXF1ZXN0LndyaXRlKHJlc3BvbnNlQm9keSk7XG4gICAgICByZXF1ZXN0LmVuZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgc2ZuOiBBV1MuU3RlcEZ1bmN0aW9ucztcbmxldCBsYW1iZGE6IEFXUy5MYW1iZGE7XG5cbmFzeW5jIGZ1bmN0aW9uIGRlZmF1bHRTdGFydEV4ZWN1dGlvbihyZXE6IEFXUy5TdGVwRnVuY3Rpb25zLlN0YXJ0RXhlY3V0aW9uSW5wdXQpOiBQcm9taXNlPEFXUy5TdGVwRnVuY3Rpb25zLlN0YXJ0RXhlY3V0aW9uT3V0cHV0PiB7XG4gIGlmICghc2ZuKSB7XG4gICAgc2ZuID0gbmV3IEFXUy5TdGVwRnVuY3Rpb25zKGF3c1Nka0NvbmZpZyk7XG4gIH1cblxuICByZXR1cm4gc2ZuLnN0YXJ0RXhlY3V0aW9uKHJlcSkucHJvbWlzZSgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkZWZhdWx0SW52b2tlRnVuY3Rpb24ocmVxOiBBV1MuTGFtYmRhLkludm9jYXRpb25SZXF1ZXN0KTogUHJvbWlzZTxBV1MuTGFtYmRhLkludm9jYXRpb25SZXNwb25zZT4ge1xuICBpZiAoIWxhbWJkYSkge1xuICAgIGxhbWJkYSA9IG5ldyBBV1MuTGFtYmRhKGF3c1Nka0NvbmZpZyk7XG4gIH1cblxuICB0cnkge1xuICAgIC8qKlxuICAgICAqIFRyeSBhbiBpbml0aWFsIGludm9rZS5cbiAgICAgKlxuICAgICAqIFdoZW4geW91IHRyeSB0byBpbnZva2UgYSBmdW5jdGlvbiB0aGF0IGlzIGluYWN0aXZlLCB0aGUgaW52b2NhdGlvbiBmYWlscyBhbmQgTGFtYmRhIHNldHNcbiAgICAgKiB0aGUgZnVuY3Rpb24gdG8gcGVuZGluZyBzdGF0ZSB1bnRpbCB0aGUgZnVuY3Rpb24gcmVzb3VyY2VzIGFyZSByZWNyZWF0ZWQuXG4gICAgICogSWYgTGFtYmRhIGZhaWxzIHRvIHJlY3JlYXRlIHRoZSByZXNvdXJjZXMsIHRoZSBmdW5jdGlvbiBpcyBzZXQgdG8gdGhlIGluYWN0aXZlIHN0YXRlLlxuICAgICAqXG4gICAgICogV2UncmUgdXNpbmcgaW52b2tlIGZpcnN0IGJlY2F1c2UgYHdhaXRGb3JgIGRvZXNuJ3QgdHJpZ2dlciBhbiBpbmFjdGl2ZSBmdW5jdGlvbiB0byBkbyBhbnl0aGluZyxcbiAgICAgKiBpdCBqdXN0IHJ1bnMgYGdldEZ1bmN0aW9uYCBhbmQgY2hlY2tzIHRoZSBzdGF0ZS5cbiAgICAgKi9cbiAgICByZXR1cm4gYXdhaXQgbGFtYmRhLmludm9rZShyZXEpLnByb21pc2UoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzdGF0dXMgb2YgdGhlIExhbWJkYSBmdW5jdGlvbiBpcyBjaGVja2VkIGV2ZXJ5IHNlY29uZCBmb3IgdXAgdG8gMzAwIHNlY29uZHMuXG4gICAgICogRXhpdHMgdGhlIGxvb3Agb24gJ0FjdGl2ZScgc3RhdGUgYW5kIHRocm93cyBhbiBlcnJvciBvbiAnSW5hY3RpdmUnIG9yICdGYWlsZWQnLlxuICAgICAqXG4gICAgICogQW5kIG5vdyB3ZSB3YWl0LlxuICAgICAqL1xuICAgIGF3YWl0IGxhbWJkYS53YWl0Rm9yKCdmdW5jdGlvbkFjdGl2ZVYyJywge1xuICAgICAgRnVuY3Rpb25OYW1lOiByZXEuRnVuY3Rpb25OYW1lLFxuICAgIH0pLnByb21pc2UoKTtcbiAgICByZXR1cm4gYXdhaXQgbGFtYmRhLmludm9rZShyZXEpLnByb21pc2UoKTtcbiAgfVxufVxuXG5leHBvcnQgbGV0IHN0YXJ0RXhlY3V0aW9uID0gZGVmYXVsdFN0YXJ0RXhlY3V0aW9uO1xuZXhwb3J0IGxldCBpbnZva2VGdW5jdGlvbiA9IGRlZmF1bHRJbnZva2VGdW5jdGlvbjtcbmV4cG9ydCBsZXQgaHR0cFJlcXVlc3QgPSBkZWZhdWx0SHR0cFJlcXVlc3Q7XG4iXX0=