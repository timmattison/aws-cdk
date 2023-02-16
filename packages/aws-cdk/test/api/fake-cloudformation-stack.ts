import { CloudFormationStack, Template } from '../../lib/api/util/cloudformation';
import { default as AWS } from '../../lib/aws-sdk';
import { instanceMockFrom } from '../util';

export interface FakeCloudFormationStackProps {
  readonly stackName: string;
  readonly stackId: string;
}

export class FakeCloudformationStack extends CloudFormationStack {
  public readonly cfnMock: jest.Mocked<AWS.CloudFormation>;
  private readonly props: FakeCloudFormationStackProps;
  private __template: Template;

  public constructor(props: FakeCloudFormationStackProps) {
    const cfnMock = instanceMockFrom(AWS.CloudFormation);
    super(cfnMock, props.stackName);
    this.cfnMock = cfnMock;
    this.props = props;
    this.__template = {};
  }

  public setTemplate(template: Template): void {
    this.__template = template;
  }

  public async template(): Promise<Template> {
    return Promise.resolve(this.__template);
  }

  public get stackId(): string {
    return this.props.stackId;
  }
}
