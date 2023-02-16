import { LazyListStackResources } from '../../lib/api/evaluate-cloudformation-template';
import { default as AWS } from '../../lib/aws-sdk';
import { MockSdk } from '../util/mock-sdk';

describe('Lazy ListStackResources', () => {
  test('correctly caches calls to the CloudFormation API', async () => {
    // GIVEN
    const listStackResMock: jest.Mock<AWS.CloudFormation.ListStackResourcesOutput, AWS.CloudFormation.ListStackResourcesInput[]> = jest.fn();
    const mockSdk = new MockSdk();
    mockSdk.stubCloudFormation({
      listStackResources: listStackResMock,
    });
    listStackResMock.mockReturnValue({
      StackResourceSummaries: [],
      NextToken: undefined,
    });
    const res = new LazyListStackResources(mockSdk, 'StackName');

    // WHEN
    void res.listStackResources();
    void res.listStackResources();
    void res.listStackResources();
    const result = await res.listStackResources();

    // THEN
    expect(result.length).toBe(0);
    expect(listStackResMock).toHaveBeenCalledTimes(1);
  });
});
