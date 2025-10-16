import boto3
from dotenv import load_dotenv
from strands.models import BedrockModel

load_dotenv()


_boto_session = boto3.Session(region_name="us-east-1")

bedrock_model = BedrockModel(
    boto_session=_boto_session,
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    # model_id="openai.gpt-oss-120b-1:0",
    temperature=0.3,
)
